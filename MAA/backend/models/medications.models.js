const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const getAllMedications = async () => {
    try {
        const query = 'SELECT * FROM medications ORDER BY start_date DESC';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllMedications model:', error);
        throw error;
    }
};

const addMedication = async (medicationData) => {
    try {
        const { name, dosage, frequency, route, startDate, patientId, epicReference } = medicationData;
        
        const query = `
            INSERT INTO medications (name, dosage, frequency, route, start_date, user_id, epic_reference)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [name, dosage, frequency, route, startDate, patientId, epicReference];
        const result = await db.query(query, values);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in addMedication:', error);
        throw error;
    }
};

const getOneMedication = async (medicationId) => {
    try {
        const result = await db.query('SELECT * FROM medications WHERE id = $1;', [medicationId]);
        return result.rows[0]; // Return single medication object
    } catch (error) {
        console.error('Error fetching medication:', error);
        throw error;
    }
};

const updateMedication = async (medicationId, updatedData) => {
    try {
        const query = 'UPDATE medications SET name = $1, dosage = $2, frequency = $3, start_date = $4, end_date = $5, user_id = $6, notes = $7 WHERE id = $8 RETURNING *;';
        const values = [updatedData.name, updatedData.dosage, updatedData.frequency, updatedData.start_date, updatedData.end_date, updatedData.user_id, updatedData.notes, medicationId];
        const result = await db.query(query, values);
        return result.rows[0]; // Return single updated medication object
    } catch (error) {
        console.error('Error updating medication:', error);
        throw error;
    }
};

const deleteMedication = async (medicationId) => {
    try {
        const result = await db.query('DELETE FROM medications WHERE id = $1 RETURNING *;', [medicationId]);
        return result.rows[0]; // Return deleted medication object
    } catch (error) {
        console.error('Error deleting medication:', error);
        throw error;
    }
};

const getAllMedicationsForOnePatient = async (patientId) => {
    try {
        const result = await db.query('SELECT * FROM medications WHERE user_id = $1 ORDER BY start_date DESC', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching medications for patient:', error);
        throw error;
    }
};

const addMedicationForOnePatient = async (patientId, medicationId) => {
    try {
        const result = await db.query('INSERT INTO medications (user_id, fhir_medication_id) VALUES ($1, $2) RETURNING *;', [patientId, medicationId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding medication for patient:', error);
        throw error;
    }
};

const updateMedicationForOnePatient = async (patientId, medicationId, updatedData) => {
    try {
        const query = 'UPDATE medications SET fhir_medication_id = $1, name = $2, dosage = $3, frequency = $4, start_date = $5, end_date = $6, source = $7 WHERE id = $8 AND user_id = $9 RETURNING *;';
        const values = [updatedData.fhir_medication_id, updatedData.name, updatedData.dosage, updatedData.frequency, updatedData.start_date, updatedData.end_date, updatedData.source, medicationId, patientId];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating medication for patient:', error);
        throw error;
    }
};

const deleteMedicationForOnePatient = async (patientId, medicationId) => {
    try {
        const result = await db.query('DELETE FROM medications WHERE id = $1 AND user_id = $2 RETURNING *;', [medicationId, patientId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting medication for patient:', error);
        throw error;
    }
};

const newMedication = async (medicationData) => {
    const { name, dosage, frequency, route, startDate, patientId, epicMedicationId } = medicationData;
    
    const query = `
        INSERT INTO medications (name, dosage, frequency, route, start_date, user_id, epic_medication_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    
    const values = [name, dosage, frequency, route, startDate, patientId, epicMedicationId];
    
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error in newMedication:', error);
        throw error;
    }
};

const createMedication = async ({ name, dosage, frequency, route, startDate, patientId }) => {
    try {
        const query = `
            INSERT INTO medications (name, dosage, frequency, route, start_date, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [name, dosage, frequency, route, startDate, patientId];
        const result = await db.query(query, values);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in createMedication model:', error);
        throw error;
    }
};

const getMedicationsByPatientId = async (patientId) => {
    try {
        const query = 'SELECT * FROM medications WHERE user_id = $1 ORDER BY start_date DESC';
        const result = await db.query(query, [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getMedicationsByPatientId model:', error);
        throw error;
    }
};

module.exports = {
    getAllMedications,
    addMedication,
    getOneMedication,
    updateMedication,
    deleteMedication,
    getAllMedicationsForOnePatient,
    addMedicationForOnePatient,
    updateMedicationForOnePatient,
    deleteMedicationForOnePatient,
    newMedication,
    createMedication,
    getMedicationsByPatientId
};