const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const createDoctor = async (newDoctor) => {
    newDoctor[6] = 'doctor'; // Set the role to 'doctor'
    try {
        const result = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', newDoctor
        );
        return result.rows; // Return the created doctor object
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllDoctors = async () => {
    try {
        const result = await client.query('SELECT * FROM users WHERE roles = $1 ORDER BY id;', ['doctor']);
        return result.rows;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneDoctor = async (doctorId) => {
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1;', [doctorId]);
        return result.rows; // Return the doctor object
    } catch (error) {
        console.error('Error fetching doctor:', error);
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
};

const updateDoctor = async (doctorId, updatedData) => {
    try {
        const query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, profile_picture = $5, dob = $6, updated_at = $7 WHERE id = $8 RETURNING *;';
        const values = [updatedData.first_name, updatedData.last_name, updatedData.email, updatedData.password, updatedData.profile_picture, updatedData.dob, "NOW()", doctorId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated doctor object
    } catch (error) {
        console.error('Error updating doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteDoctor = async (doctorId) => {
    try {
        const result = await client.query('DELETE FROM users WHERE id = $1;', [doctorId]);
        return result.rows; // Return the deleted doctor object
    } catch (error) {
        console.error('Error deleting doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const howManyPatientsPerDoctor = async (doctorId) => {
    try {
        const result = await client.query('SELECT COUNT(*) FROM patient_and_doctor WHERE doctor_id = $1', [doctorId]);
        return result.rows[0].count; // Return the count of patients for the doctor
    } catch (error) {
        console.error('Error counting patients for doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deletePatient = async (doctorId) => {
    try {
        const result = await client.query('DELETE FROM patient_and_doctor WHERE doctor_id = $1;', [doctorId]);
        return result.rows; // Return the deleted doctor object
    } catch (error) {
        console.error('Error deleting doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllChats = async (doctorId) => {
    try {
        const result = await client.query('SELECT * FROM chats WHERE doctor = $1', [doctorId]);
        return result.rows; // Return the chats for the doctor
    } catch (error) {
        console.error('Error fetching chats for doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessages = async (doctorId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE doctor_id = $1', [doctorId]);
        return result.rows; // Return the messages for the doctor
    } catch (error) {
        console.error('Error fetching messages for doctor:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const createNewChat = async (doctorId, patientId) => {
    try {
        const result = await client.query('INSERT INTO chats (doctor, patient) VALUES ($1, $2) RETURNING *;', [doctorId, patientId]);
        return result.rows; // Return the created chat object
    } catch (error) {
        console.error('Error creating new chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const createNewMessage = async (newMessage) => {
    try {
        const result = await client.query('INSERT INTO messages (chat_id, sender_id, receiver_id, content, parent_message_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;', newMessage);
        return result.rows; // Return the created message object
    } catch (error) {
        console.error('Error creating new message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const softDeleteMessage = async (messageId) => {
    try {
        const result = await client.query('UPDATE messages SET deleted_at = NOW() WHERE id = $1 RETURNING *;', [messageId]);
        return result.rows; // Return the soft-deleted message object
    } catch (error) {
        console.error('Error soft-deleting message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = { 
    createDoctor, 
    getAllDoctors,
    getOneDoctor, 
    getAllPatientsForOneDoctor, 
    updateDoctor, 
    deleteDoctor, 
    howManyPatientsPerDoctor, 
    deletePatient, 
    getAllChats, 
    getAllMessages, 
    createNewChat, 
    createNewMessage, 
    softDeleteMessage 
};
