const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

// sample user connection URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'turkey';

async function validateAddress(address) {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.results.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error validating address:', error);
        return false;
    }
}

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
                const existingUser = await usersCollection.findOne({ name });
                if (existingUser) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                const isValidAddress = await validateAddress(address);
                if (!isValidAddress) {
                    return res.status(400).json({ error: 'Invalid address.' });
                }
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
