const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const createNewChat = async (doctorId, patientId) => {
    try {
        const result = await client.query(
            'INSERT INTO chats (doctor, patient) VALUES ($1, $2) RETURNING *;', [doctorId, patientId]
        );
        return result.rows[0]; // Return the created chat object
    } catch (error) {
        console.error('Error creating new chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllChats = async (userId) => {
    try {
        const result = await client.query('SELECT * FROM chats WHERE doctor = $1 OR patient = $1;', [userId]);
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

const createNewMessage = async (message) => {
    try {
        const result = await client.query(
            'INSERT INTO messages (chat_id, sender_id, receiver_id, content, parent_message_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;', message
        );
        return result.rows[0]; // Return the created message object
    } catch (error) {
        console.error('Error creating new message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteMessage = async (messageId) => {
    try {
        const result = await client.query('DELETE FROM messages WHERE id = $1 RETURNING *;', [messageId]);
        return result.rows[0]; // Return the deleted message object
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const softDeleteMessage = async (messageId) => {
    try {
        const result = await client.query('UPDATE messages SET deleted_at = NOW() WHERE id = $1 RETURNING *;', [messageId]);
        return result.rows[0]; // Return the updated message object
    } catch (error) {
        console.error('Error soft deleting message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const editMessage = async (messageId, content) => {
    try {
        const result = await client.query('UPDATE messages SET content = $1 WHERE id = $2 RETURNING *;', [content, messageId]);
        return result.rows[0]; // Return the updated message object
    } catch (error) {
        console.error('Error editing message:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const markAsRead = async (messageId) => {
    try {
        const result = await client.query('UPDATE messages SET is_read = TRUE, status = \'read\' WHERE id = $1 RETURNING *;', [messageId]);
        return result.rows[0]; // Return the updated message object
    } catch (error) {
        console.error('Error marking message as read:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllUnreadMessages = async (userId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE receiver_id = $1 AND is_read = FALSE;', [userId]);
        return result.rows; // Return the unread messages for the user
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllReadMessages = async (userId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE receiver_id = $1 AND is_read = TRUE;', [userId]);
        return result.rows; // Return the read messages for the user
    } catch (error) {
        console.error('Error fetching read messages:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getChatById = async (chatId) => {
    try {
        const result = await client.query('SELECT * FROM chats WHERE id = $1;', [chatId]);
        return result.rows[0]; // Return the first (and should be only) chat
    } catch (error) {
        console.error('Error fetching chat:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = {
    createNewChat,
    getAllChats,
    getAllMessages,
    createNewMessage,
    deleteMessage,
    softDeleteMessage,
    editMessage,
    markAsRead,
    getAllUnreadMessages,
    getAllReadMessages,
    getChatById,
};