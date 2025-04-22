const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const getAllMedications = async () => {
    try {
        const result = await client.query('SELECT * FROM medications ORDER BY id;');
        return result.rows;
    } catch (error) {
        console.error('Error fetching medications:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addMedication = async (newMedication) => {
    try {
        const result = await client.query(
            'INSERT INTO medications (user_id, fhir_medication_id, name, dosage, route, frequency, start_date, end_date, source, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;', newMedication
        );
        return result.rows; // Return the created medication object
    } catch (error) {
        console.error('Error adding medication:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneMedication = async (medicationId) => {
    try {
        const result = await client.query('SELECT * FROM medications WHERE id = $1;', [medicationId]);
        return result.rows; // Return the medication object
    } catch (error) {
        console.error('Error fetching medication:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateMedication = async (medicationId, updatedData) => {
    try {
        const query = 'UPDATE medications SET name = $1, dosage = $2, frequency = $3, start_date = $4, end_date = $5, user_id = $6, notes = $7 WHERE id = $8 RETURNING *;';
        const values = [updatedData.name, updatedData.dosage, updatedData.frequency, updatedData.start_date, updatedData.end_date, updatedData.user_id, updatedData.notes, medicationId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated medication object
    } catch (error) {
        console.error('Error updating medication:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteMedication = async (medicationId) => {
    try {
        const result = await client.query('DELETE FROM medications WHERE id = $1;', [medicationId]);
        return result; // Return the deleted medication object
    } catch (error) {
        console.error('Error deleting medication:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMedicationsForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM medications WHERE user_id = $1', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching medications for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateMedicationForOnePatient = async (patientId, medicationId, updatedData) => {
    try {
        const query = 'UPDATE medications SET fhir_medication_id = $1, name = $2, dosage = $3, frequency = $4, start_date = $5, end_date = $6, source = $7 WHERE id = $8 AND user_id = $9 RETURNING *;';
        const values = [updatedData.fhir_medication_id, updatedData.name, updatedData.dosage, updatedData.frequency, updatedData.start_date, updatedData.end_date, updatedData.source, medicationId, patientId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated medication object
    } catch (error) {
        console.error('Error updating medication for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteMedicationForOnePatient = async (patientId, medicationId) => {
    try {
        const result = await client.query('DELETE FROM medications WHERE id = $1 AND user_id = $2;', [medicationId, patientId]);
        return result; // Return the deleted medication object
    } catch (error) {
        console.error('Error deleting medication for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};



module.exports = {
    getAllMedications,
    addMedication,
    getOneMedication,
    updateMedication,
    deleteMedication,
    getAllMedicationsForOnePatient,
    updateMedicationForOnePatient,
    deleteMedicationForOnePatient,

};