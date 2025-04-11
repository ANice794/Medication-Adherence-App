const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const createNewChat = async (doctorId, patientId) => {
    try {
        const result = await client.query(
            'INSERT INTO chats (doctor_id, patient_id) VALUES ($1, $2) RETURNING *;', [doctorId, patientId]
        );
        return result.rows[0]; // Return the created chat object
    } catch (error) {
        console.error('Error creating new chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllChats = async (userId) => {
    try {
        const result = await client.query('SELECT * FROM chats WHERE doctor_id = $1 OR patient_id = $1;', [userId]);
        return result.rows; // Return the chats for the user
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessages = async (chatId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE chat_id = $1;', [chatId]);
        return result.rows; // Return the messages for the chat
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = {
    createNewChat,
    getAllChats,
    getAllMessages
};