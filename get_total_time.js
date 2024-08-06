const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const clientId = event.clientId;

  const params = {
    TableName: 'TimeEntries'
  };

  try {
    const data = await dynamodb.scan(params).promise();

    // Group time entries by client ID
    const groupedData = data.Items.reduce((acc, item) => {
      if (acc[item.ClientId]) {
        acc[item.ClientId] += item.Duration;
      } else {
        acc[item.ClientId] = item.Duration;
      }

      return acc;
    }, {});

    // Get total time for each client
    const totalTime = Object.keys(groupedData).map(clientId => {
      return {
        clientId,
        totalTime: groupedData[clientId]
      };
    });

    return {
      statusCode: 200,
      totalTime: JSON.stringify(totalTime),
      body: JSON.stringify(groupedData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not retrieve time entries.', error })
    };
  }
};