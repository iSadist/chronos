const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllItems = async () => {
  const params = {
    TableName: 'TimeEntries',
  };

  try {
    const data = await dynamodb.scan(params).promise();
    return data.Items;
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

const getAllTimeEntries = async (clientId) => {
  try {
    items = await getAllItems();

    // Group time entries by client ID
    const groupedData = groupData(items);

    if (clientId) {
      const response = {
        hours: groupedData[clientId] || 0,
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(groupedData),
    };
  } catch (error) {
    console.error('Could not retrieve time entries. Error: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not retrieve time entries.', error })
    };
  }
}

const getTimeEntriesByDateRange = async (clientId, from, to) => {
  // Try to convert the date strings to timestamps
  const fromDate = Date.parse(from);
  const toDate = Date.parse(to);

  if (isNaN(fromDate) || isNaN(toDate)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid date format. Please use ISO 8601 format.' })
    };
  }

  try {
    const items = await getAllItems();

    const filteredData = items.filter(item => {
      const itemDate = Date.parse(item.Date);

      return itemDate >= fromDate && itemDate <= toDate;
    });

    const groupedData = groupData(filteredData);

    if (clientId) {
      const response = {
        from: from,
        to: to,
        hours: groupedData[clientId] || 0,
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(groupedData),
    };
  } catch(error) {
    console.error('Could not retrieve time entries. Error: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not retrieve time entries.', error })
    };
  }
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { clientId, from, to } = body;

  // Option to how to get the time report:
  // 1. Hours day by day
  // 2. Total hours in a range of days
  // 3. Total hours per week
  // 4. Total hours per month

  // Possibility to get a full printed report with all time entries and summary.

  // If from and to are not provided, get all time entries for the client
  if (!from && !to) {
    return getAllTimeEntries(clientId);
  }

  // If from and to are provided, get time entries for the client within the specified range
  return getTimeEntriesByDateRange(clientId, from, to);
};