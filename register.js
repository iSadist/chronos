const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

// Register a time entry and returns a promise
function registerTimeEntry(clientId, duration, date, userId) {
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

    return dynamo.put(params).promise();
}

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const { entries } = body;

        if (!entries) {
            return {
                statusCode: 400,
                message: 'Invalid request. Missing field `entries`.'
            };
        }

        const promises = entries.map(entry => {
            const { clientId, duration, date, userId } = entry;
            return registerTimeEntry(clientId, duration, date, userId);
        });

        await Promise.all(promises);

        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Time entries recorded.' })
        };

        return response;
    } catch (error) {
        console.error(error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not record time entry.' })
        };

        return response;
    }
};
