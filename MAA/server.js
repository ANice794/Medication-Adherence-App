const doctorRouter = require('./routes/doctors.routes.js');
const express = require('express');
const app = express();

app.use(express.json()); // Only JSON parsing middleware

app.use("/doctors", doctorRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});