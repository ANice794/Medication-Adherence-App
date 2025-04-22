const { Client } = require('pg');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'MAA',
    password: 'P@$$w0rd',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        // Test query to ensure the connection works
        return client.query('SELECT NOW() + interval \'3 day\' AS "current_time_plus_3_days"');

    })
    .then(result => console.log('Database test query result:', result.rows[0]))
    .catch(err => {
        console.error('Connection error', err.stack); // Log the error stack
        process.exit(1); // Exit the process if the connection fails
    });

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
module.exports = client;