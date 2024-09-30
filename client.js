const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

/**
 * Returns all items from the TimeEntries table
 * @param {*} userId The user ID
 * @returns List of items
 * 
 * @example
 * const items = await getAllItems('1234');
 *
 */
const getAllItems = async (userId) => {
    const params = {
        TableName: 'TimeEntries',
    };

    try {
        const data = await dynamo.scan(params).promise();

        // Filter out the items that don't belong to the user
        const userItems = data.Items.filter(item => item.UserId === userId);

        return userItems;
    } catch (error) {
        console.error('Could not retrieve items. Error: ', error);
        return [];
    }
}

async function getFullClientList(userId) {
    const allItems = await getAllItems(userId);
    const clients = allItems.map(item => item.ClientId);
    const unique = Array.from(new Set(clients));
    return unique;
}

/**
 * Returns a list of all clients
 * @param {*} userId The user ID
 * @returns Endpoint response
 */
async function getAllClients(userId) {
    try {
        const clients = await getFullClientList(userId);

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify(clients)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Could not retrieve clients.'}),
        };
    }
}

/**
 * Create a new client by adding a new time entry with a duration of 0
 * @param {*} clientId The client ID
 * @param {*} userId The user ID
 * @returns Endpoint response
 */
async function createClient(clientId, userId) {
    const params = {
        TableName: 'TimeEntries',
        Item: {
            EntryId: `${clientId}-${Date.now()}`,
            ClientId: clientId,
            Duration: 0,
            Date: '2020-01-01',
            UserId: userId,
        }
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: `New client recorded: ${clientId}`}),
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Could not create client.'}),
        };
    }
}

/**
 * Deletes all time entries for a client
 * @param {*} clientId The client ID
 * @param {*} userId The user ID
 * @returns Endpoint response
 */
async function deleteClient(clientId, userId) {
    try {
        // Get all existing clients
        const clients = await getFullClientList(userId);

        // Check if the client exists
        if (!clients.includes(clientId)) {
            return {
                statusCode: 404,
                headers: { ...CORS_HEADERS },
                body: JSON.stringify({ message: `Client does not exist: ${clientId}.`}),
            };
        }

        // Delete all time entries for the client
        const params = {
            TableName: 'TimeEntries',
        };

        const data = await dynamo.scan(params).promise();

        const items = data.Items.filter(item => item.ClientId === clientId && item.UserId === userId);

        for (const item of items) {
            await dynamo.delete({
                TableName: 'TimeEntries',
                Key: {
                    EntryId: item.EntryId
                }
            }).promise();
        }

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Client deleted.'}),
        };
    } catch(error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Could not delete client.'}),
        };
    }
}

exports.handler = async (event) => {
    const { userId } = event.queryStringParameters;

    if(!userId) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'User ID is required.'}),
        };
    }

    return await getAllClients(userId);
};

exports.options = async (event) => {
    return {
        statusCode: 200,
        headers: { ...CORS_HEADERS },
        body: JSON.stringify({ message: 'Options request successful.'}),
    };
};

exports.create = async (event) => {
    const { clientId, userId } = event.queryStringParameters;

    if (!clientId) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Client ID is required.'}),
        };
    }

    if(!userId) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'User ID is required.'}),
        };
    }

    // Get the current client list
    const clients = await getFullClientList(userId);

    if (clients.includes(clientId)) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: `Client already exists: ${clientId}`}),
        };
    }

    return await createClient(clientId, userId);
};

exports.delete = async (event) => {
    const { clientId, userId } = event.queryStringParameters;

    if (!clientId) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'Client ID is required.'}),
        };
    }

    if(!userId) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS },
            body: JSON.stringify({ message: 'User ID is required.'}),
        };
    }

    return await deleteClient(clientId, userId);
}
