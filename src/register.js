const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
};

// TODO: Get the user ID from the JWT token and use that as the user ID

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

function deleteTimeEntry(id) {
    const params = {
        TableName: 'TimeEntries',
        Key: {
            EntryId: id
        }
    };

    return dynamo.delete(params).promise();
}

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const { entries } = body;

        if (!entries) {
            return {
                statusCode: 400,
                headers: { ...CORS_HEADERS },
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
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Time entries recorded.' })
        };

        return response;
    } catch (error) {
        console.error(error);

        const response = {
            statusCode: 500,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Could not record time entry.' })
        };

        return response;
    }
};

exports.delete = async (event) => {
    try {
        const { EntryId } = event.queryStringParameters;

        if (!EntryId) {
            return {
                statusCode: 400,
                headers: { ...CORS_HEADERS },
                body: JSON.stringify({ message: 'Invalid request. Missing field `EntryId`.' })
            };
        }

        await deleteTimeEntry(EntryId);

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Time entry deleted.' })
        };
    }
    catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Could not delete time entry.' })
        };
    }
};

exports.options = async (event) => {
    return {
        statusCode: 200,
        headers: { ...CORS_HEADERS },
        body: JSON.stringify({ message: 'Options request successful.'}),
    };
};
