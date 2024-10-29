const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// sample user connection URI
const uri = 'mongodb+srv://jeff:E8vSahM78GNVvvv5@swemates.ksq44.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// connect to MongoDB and start server
async function run() {
    try {
        // connect the client to the server
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('Account'); // database name
        const usersCollection = db.collection('Users'); // collection name

        app.post('/api/users', async (req, res) => {
            try {
                const newUser = req.body;
                await usersCollection.insertOne(newUser);
                res.status(201).json(newUser);
            } catch (error) {
                console.error('Error saving user:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.get('/api/users', async (req, res) => {
            try {
                const users = await usersCollection.find({}).toArray();
                res.status(200).json(users);
            } catch (error) {
                console.error('Error retrieving users:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }

    process.on('SIGINT', async () => {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    });
}

run().catch(console.error);
