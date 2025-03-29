const model = require('../models/doctors.models');

const addDoctor = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let profile_picture = req.body.profile_picture || null; // Default to null if not provided
    let dob = req.body.dob;

    // Validate input data
    if (!first_name || !last_name || !email || !password || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let newDoctor = [first_name, last_name, email, password, profile_picture, dob];
    try {
        res.json(model.createDoctor(newDoctor));
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await model.getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllPatientsForOneDoctor = async (req, res) => {
    try {
        const patients = await model.getAllPatientsForOneDoctor(req.params.doctorId);
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error getting all of the patients for a doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addDoctor, getDoctors, getAllPatientsForOneDoctor };
