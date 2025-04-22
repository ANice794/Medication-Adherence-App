const doctorRouter = require('./routes/doctors.routes.js');
const patientRouter = require('./routes/patients.routes.js');
const chatRouter = require('./routes/chats.routes.js');
const medicationsRouter = require('./routes/medications.routes.js');
const rewardsRouter = require('./routes/rewards.routes.js');
const remindersRouter = require('./routes/reminders.routes.js');
const express = require('express');
const app = express();
const client = require('./models/db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing

app.use(express.json()); // Only JSON parsing middleware

// Routes
app.use('/chats', chatRouter);
app.use('/doctors', doctorRouter); // Use loginRouter for modularity
app.use('/medications', medicationsRouter);
app.use('/patients', patientRouter);
app.use('/reminders', remindersRouter);
app.use('/rewards', rewardsRouter);

app.use('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Bad Request');
    }
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(401).send('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
    }
    res.status(200).json(user.rows);
    
});

app.use("/register", async (req, res) => {
    const { dob, email, firstName, lastName, password } = req.body;
    if (!email || !password || !firstName || !lastName || !dob) {
        return res.status(400).send('Bad Request');
    }
    let newPatient = [firstName, lastName, email, password, null, dob, 'patient'];

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        newPatient[3] = hashedPassword;

        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).send('Email already exists');
        }

        const createdPatient = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', newPatient);

        res.status(201).json(createdPatient.rows);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});