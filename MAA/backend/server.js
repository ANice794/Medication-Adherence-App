require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('./models/db-conn');

// Import routes
const doctorRouter = require('./routes/doctors.routes.js');
const patientRouter = require('./routes/patients.routes.js');
const chatRouter = require('./routes/chats.routes.js');
const medicationsRouter = require('./routes/medications.routes.js');
const rewardsRouter = require('./routes/rewards.routes.js');
const remindersRouter = require('./routes/reminders.routes.js');
const adminRouter = require('./routes/admin.routes.js');
const authRouter = require('./routes/auth.routes.js');

const app = express();
const saltRounds = 10;

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/chats', chatRouter);
app.use('/medications', medicationsRouter);
app.use('/rewards', rewardsRouter);
app.use('/reminders', remindersRouter);
app.use('/admin', adminRouter);

// Register route
app.post("/register", async (req, res) => {
    const { dob, email, firstName, lastName, password } = req.body;
    
    if (!email || !password || !firstName || !lastName || !dob) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required' 
        });
    }

    try {
        // Check if user already exists
        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                success: false,
                message: 'Email already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create new user
        const result = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [firstName, lastName, email, hashedPassword, null, dob, 'patient']
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: result.rows[0].id,
                    email: result.rows[0].email,
                    firstName: result.rows[0].first_name,
                    lastName: result.rows[0].last_name,
                    role: result.rows[0].roles
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});