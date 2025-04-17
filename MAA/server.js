const doctorRouter = require('./routes/doctors.routes.js');
const patientRouter = require('./routes/patients.routes.js');
const chatRouter = require('./routes/chats.routes.js');
const medicationsRouter = require('./routes/medications.routes.js');
const rewardsRouter = require('./routes/rewards.routes.js');
const remindersRouter = require('./routes/reminders.routes.js');
const express = require('express');
const app = express();

app.use(express.json()); // Only JSON parsing middleware

app.use("/doctors", doctorRouter);
app.use("/patients", patientRouter);
app.use("/chats", chatRouter);
app.use("/medications", medicationsRouter);
app.use("/rewards", rewardsRouter);
app.use("/reminders", remindersRouter);

app.use("/login" , (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }
        req.userId = decoded.id;
        next();
    });
});

app.use("/register" , (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Bad Request');
    }
    // Logic to register the user
    res.status(201).send('User registered successfully');
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