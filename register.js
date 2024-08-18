const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { clientId, duration, date, userId } = body;

    const params = {
        TableName: 'TimeEntries',
        Item: {
            EntryId: `${clientId}-${Date.now()}`,
            ClientId: clientId,
            Duration: duration,
            Date: date,
            UserId: userId,
        }
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            message: 'Time entry recorded.'
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            message: 'Could not record time entry.'
        };
    }
};
