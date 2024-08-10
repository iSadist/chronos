const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const getAllItems = async () => {
    const params = {
        TableName: 'TimeEntries',
    };
  
    try {
        const data = await dynamo.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Could not retrieve items. Error: ', error);
        return [];
    }
}

/**
 * Returns a list of all clients
 * @returns Endpoint response
 */
async function getAllClients() {
    try {
        const allItems = await getAllItems();
        const clients = allItems.map(item => item.ClientId);

        // Remove duplicates
        const unique = Array.from(new Set(clients));

        return {
            statusCode: 200,
            body: JSON.stringify(unique)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            message: 'Could not retrieve clients.'
        };
    }
}

/**
 * Create a new client by adding a new time entry with a duration of 0
 * @param {*} clientId The client ID
 * @returns Endpoint response
 */
async function createClient(clientId) {
    const params = {
        TableName: 'TimeEntries',
        Item: {
            EntryId: `${clientId}-${Date.now()}`,
            ClientId: clientId,
            Duration: 0,
            Date: '2020-01-01'
        }
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            message: `New client recorded: ${clientId}`
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            message: 'Could not create client.'
        };
    }
}

/**
 * Deletes all time entries for a client
 * @param {*} clientId The client ID
 * @returns Endpoint response
 */
async function deleteClient(clientId) {
    try {
        // Delete all time entries for the client
        const params = {
            TableName: 'TimeEntries',
        };

        const data = await dynamo.scan(params).promise();

        const items = data.Items.filter(item => item.ClientId === clientId);

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
            message: 'Client deleted.'
        };
    } catch(error) {
        console.error(error);

        return {
            statusCode: 500,
            message: 'Could not delete client.'
        };
    }
}

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { action, clientId } = body;

    if (action === 'create') {
        return await createClient(clientId);
    }

    if (action === 'get') {
        return await getAllClients();
    }

    if (action === 'delete') {
        return await deleteClient(clientId);
    }

    return {
        statusCode: 400,
        message: 'Invalid action.'
    };
};
