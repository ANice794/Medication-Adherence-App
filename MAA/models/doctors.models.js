const client = require('./db-conn');

function createDoctor(newDoctor) {
    newDoctor[6] = 'doctor'; // Set the role to 'doctor'
    try {
        const result = client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', newDoctor
        );
        return result; // Return the created doctor object
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllDoctors = async () => {
    try {
        const result = await client.query('SELECT * FROM users WHERE roles = $1', ['doctor']);
        return result.rows;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllPatientsForOneDoctor = async (doctorId) => {
    try {
        const result = await client.query('SELECT * FROM patient_and_doctor WHERE doctor_id = $1', [doctorId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching patients for doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
}

module.exports = { createDoctor, getAllDoctors, getAllPatientsForOneDoctor };