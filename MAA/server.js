const doctorRouter = require('./routes/doctors.routes.js');
const patientRouter = require('./routes/patients.route.js');
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