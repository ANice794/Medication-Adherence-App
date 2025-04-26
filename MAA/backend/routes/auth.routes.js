const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../models/db-conn');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    console.log('Login attempt started');
    console.log('Request body:', { email: req.body.email, passwordReceived: !!req.body.password });

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing credentials:', { email: !!email, password: !!password });
        return res.status(400).json({ 
            success: false,
            message: 'Email and password are required' 
        });
    }

    let conn;
    try {
        console.log('Attempting to connect to database...');
        // Get a connection from the pool
        conn = await client.connect();
        console.log('Database connection established');

        // Check if user exists
        console.log('Querying database for user with email:', email);
        const result = await conn.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Database query completed. Found rows:', result.rows.length);
        
        if (result.rows.length === 0) {
            console.log('No user found with email:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        const user = result.rows[0];
        console.log('User found:', { id: user.id, email: user.email, role: user.roles });

        // Compare passwords
        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check if JWT_SECRET is configured
        console.log('Checking JWT_SECRET configuration...');
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not configured in environment variables');
            return res.status(500).json({ 
                success: false,
                message: 'Server configuration error' 
            });
        }
        console.log('JWT_SECRET is properly configured');

        // Generate JWT token
        console.log('Generating JWT token...');
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                role: user.roles
            },
            jwtSecret,
            { expiresIn: '24h' }
        );
        console.log('JWT token generated successfully');

        // Send successful response
        console.log('Sending successful response...');
        return res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.roles
                }
            }
        });
    } catch (err) {
        console.error('Login error details:', {
            error: err.message,
            stack: err.stack,
            type: err.constructor.name
        });
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    } finally {
        if (conn) {
            console.log('Releasing database connection...');
            try {
                await conn.release();
                console.log('Database connection released successfully');
            } catch (releaseErr) {
                console.error('Error releasing connection:', releaseErr);
            }
        }
    }
});

module.exports = router; 