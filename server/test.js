const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://jeff:E8vSahM78GNVvvv5@swemates.ksq44.mongodb.net/?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        console.log('Connected to MongoDB');

        // Perform operations here, for example, listing databases
        const databasesList = await client.db().admin().listDatabases();
        console.log(databasesList.databases);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        // Close the connection
        await client.close();
    }
}

run().catch(console.error);
