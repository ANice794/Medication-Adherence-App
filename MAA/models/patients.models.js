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

const addRewardToPatient = async (patientId, rewardId) => {
    try {
        const result = await client.query('INSERT INTO user_rewards (patient_id, reward_id, redeemed_at, expiration_date) VALUES ($1, $2, $3, $4) RETURNING *;', [patientId, rewardId, "NOW()", "NOW() + interval \'3 day\'"]);
        return result.rows; // Return the added reward for the patient
    } catch (error) {
        console.error('Error adding reward to patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllRewardsForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM user_rewards WHERE patient_id = $1', [patientId]);
        return result.rows; // Return the rewards for the patient
    } catch (error) {
        console.error('Error fetching rewards for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const removeRewardFromPatient = async (patientId, rewardId) => {
    try {
        const result = await client.query('DELETE FROM user_rewards WHERE patient_id = $1 AND reward_id = $2 RETURNING *;', [patientId, rewardId]);
        return result.rows; // Return the removed reward for the patient
    } catch (error) {
        console.error('Error removing reward from patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getReward = async (rewardId) => {
    try {
        const result = await client.query('SELECT * FROM rewards WHERE id = $1;', [rewardId]);
        return result.rows[0]; // Return the reward object
    } catch (error) {
        console.error('Error fetching reward:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const removePointsFromPatient = async (patientId, points) => {
    try {
        const result = await client.query('UPDATE points SET current_points = current_points - $1 WHERE id = $2 RETURNING *;', [points, patientId]);
        return result.rows[0]; // Return the updated patient object
    } catch (error) {
        console.error('Error removing points from patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addPointsToPatient = async (patientId, points) => {
    try {
        const result = await client.query('UPDATE points SET current_points = current_points + $1, overall_points = overall_points + $2, last_updated = $3 WHERE user_id = $4 RETURNING *;', [points, points, "NOW()", patientId]);
        return result.rows[0]; // Return the updated patient object
    } catch (error) {
        console.error('Error adding points to patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllPointsForPatient = async (patientId) => {
    try {
        const result = await client.query('SELECT overall_points FROM points WHERE user_id = $1;', [patientId]);
        return result.rows[0]; // Return the points object for the patient
    } catch (error) {
        console.error('Error fetching points for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getCurrentPointsForPatient = async (patientId) => {
    try {
        const result = await client.query('SELECT current_points FROM points WHERE user_id = $1;', [patientId]);
        return result.rows[0]; // Return the current points for the patient
    } catch (error) {
        console.error('Error fetching current points for patient:', error);
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
    getAllDoctorsForOnePatient,
    addRewardToPatient,
    removeRewardFromPatient,
    getAllRewardsForOnePatient,
    getReward,
    removePointsFromPatient,
    addPointsToPatient,
    getAllPointsForPatient,
    getCurrentPointsForPatient,
};