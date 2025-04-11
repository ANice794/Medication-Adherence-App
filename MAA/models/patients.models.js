const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const newPatient = async (newPatient) => {
    newPatient[6] = 'patient'; // Set the role to 'patient'
    try {
        const result = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7);', newPatient
        );
        return result; // Return the created patient object
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllPatients = async () => {
    try {
        const result = await client.query('SELECT * FROM users WHERE roles = $1 ORDER BY id;', ['patient']);
        return result.rows;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1;', [patientId]);
        return result.rows; // Return the patient object
    } catch (error) {
        console.error('Error fetching patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updatePatient = async (patientId, updatedData) => {
    try {
        const query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, profile_picture = $5, dob = $6, updated_at = $7 WHERE id = $8 RETURNING *;';
        const values = [updatedData.first_name, updatedData.last_name, updatedData.email, updatedData.password, updatedData.profile_picture, updatedData.dob, "NOW()", patientId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated patient object
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deletePatient = async (patientId) => {
    try {
        const result = await client.query('DELETE FROM users WHERE id = $1;', [patientId]);
        return result; // Return the deleted patient object
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllChats = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM chat WHERE patient_id = $1', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching chats for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessages = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE patient_id = $1', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessagesForOneChat = async (patientId, chatId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE patient_id = $1 AND chat_id = $2', [patientId, chatId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages for one chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const createNewChat = async (doctorId, patientId) => {
    try {
        const result = await client.query('INSERT INTO chat (doctor_id, patient_id) VALUES ($1, $2) RETURNING *;', [doctorId, patientId]);
        return result.rows; // Return the created chat object
    } catch (error) {
        console.error('Error creating new chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllDoctorsForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM doctor WHERE patient_id = $1', [patientId]);
        return result.rows; // Return the doctors for the patient
    } catch (error) {
        console.error('Error fetching doctors for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = {
    newPatient,
    getAllPatients,
    getOnePatient,
    updatePatient,
    deletePatient,
    getAllChats,
    getAllMessages,
    getAllMessagesForOneChat,
    createNewChat,
    getAllDoctorsForOnePatient
};