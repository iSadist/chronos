const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
};

/**
 * Decodes a JWT token and returns the user ID
 * @param {*} token The JWT token
 * @returns User ID
 */
const decodeTokenUserID = (token) => {
  try {
      const decoded = jwt.decode(token);
      return decoded.sub;
  } catch (error) {
      console.error('Could not decode token. Error: ', error);
      return null;
  }
}

const getAllItems = async (userId) => {
  const params = {
    TableName: 'TimeEntries',
  };

  try {
    const data = await dynamodb.scan(params).promise();

    // Filter out the items that don't belong to the user
    const userItems = data.Items.filter(item => item.UserId === userId);

    // Sort according to the date
    userItems.sort((a, b) => {
      return new Date(a.Date) - new Date(b.Date);
    });

    return userItems;
  } catch (error) {
    console.error('Could not retrieve items. Error: ', error);
    return [];
  }
}

const groupData = (items) => {
  return items.reduce((acc, item) => {
    if (acc[item.ClientId]) {
      acc[item.ClientId] += item.Duration;
    } else {
      acc[item.ClientId] = item.Duration;
    }

    return acc;
  }, {});
}

const mapRecordToClient = (items) => {
  return items.reduce((acc, item) => {
    if (acc[item.ClientId]) {
      acc[item.ClientId].push(item);
    } else {
      acc[item.ClientId] = [item];
    }

    return acc;
  }, {});
}

const getAllTimeEntries = async (clientId, mode, userId) => {
  try {
    items = await getAllItems(userId);

    let data = undefined;

    if (mode === 'daily') {
      data = mapRecordToClient(items);
    } else {
      // Group time entries by client ID
      data = groupData(items);
    }

    if (clientId) {
      const response = {
        data: data[clientId] || 0,
      }
  
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS },
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Could not retrieve time entries. Error: ', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify({ message: 'Could not retrieve time entries.', error })
    };
  }
}

const getTimeEntriesByDateRange = async (clientId, from, to, mode, userId) => {
  // Try to convert the date strings to timestamps
  const fromDate = Date.parse(from);
  const toDate = Date.parse(to);

  if (isNaN(fromDate) || isNaN(toDate)) {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify({ message: 'Invalid date format. Please use ISO 8601 format.' })
    };
  }

  try {
    const items = await getAllItems(userId);

    const filteredData = items.filter(item => {
      const itemDate = Date.parse(item.Date);
      return itemDate >= fromDate && itemDate <= toDate;
    });

    let data = undefined;

    if (mode === 'daily') {
      data = mapRecordToClient(filteredData);
    } else {
      // Group time entries by client ID
      data = groupData(filteredData);
    }

    if (clientId) {
      const response = {
        from: from,
        to: to,
        data: data[clientId] || 0,
      }
      
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS },
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify(data),
    };
  } catch(error) {
    console.error('Could not retrieve time entries. Error: ', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS },
      body: JSON.stringify({ message: 'Could not retrieve time entries.', error })
    };
  }
}

exports.handler = async (event) => {
  const {
    clientId,
    from,
    to,
    mode,
  } = event.queryStringParameters || {};
  const userId = decodeTokenUserID(event.headers.authorization);

  // Option to how to get the time report (mode):
  // "daily": Hours day by day
  // 2. Total hours in a range of days
  // 3. Total hours per week
  // 4. Total hours per month

  // Possibility to get a full printed report with all time entries and summary.

  // If from and to are not provided, get all time entries for the client
  if (!from && !to) {
    return getAllTimeEntries(clientId, mode, userId);
  }

  // If from and to are provided, get time entries for the client within the specified range
  return getTimeEntriesByDateRange(clientId, from, to, mode, userId);
};