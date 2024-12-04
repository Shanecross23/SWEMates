const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// sample user connection URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'turkey';

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
                const { name, password, cuisine, address } = req.body;
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const newUser = { name, password: hashedPassword, cuisine, address };
                await usersCollection.insertOne(newUser);
                res.status(201).json(newUser);
            } catch (error) {
                console.error('Error saving user:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        //login route
        app.post('/api/login', async (req, res) => {
            try {
                const { username, password } = req.body;
                const user = await usersCollection.findOne({ name: username });
                if (!user) {
                    return res.status(400).json({ error: 'User not found' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid password' });
                }
                const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ token, address: user.address });
            } catch (error) {
                console.error('Error during login:', error);
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
