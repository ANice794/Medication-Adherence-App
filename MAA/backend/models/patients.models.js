const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const newPatient = async (newPatient) => {
    newPatient[6] = 'patient'; // Set the role to 'patient'
    try {
        const result = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, profile_picture, dob, roles) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', newPatient
        );
        //patientId = result.rows[0].id; // Get the ID of the newly created patient
        return result.rows; // Return the created patient object
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
        const result = await client.query('SELECT * FROM chats WHERE patient = $1;', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching chats for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessages = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1;', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllMessagesForOneChat = async (patientId, chatId) => {
    try {
        const result = await client.query('SELECT * FROM messages WHERE (sender_id = $1 OR receiver_id = $1) AND chat_id = $2', [patientId, chatId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages for one chat:', error);
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

const getAllDoctorsForOnePatient = async (patientId) => {
    try {
        const result = await client.query(`
            SELECT u.id, u.first_name, u.last_name, u.email
            FROM patient_and_doctor pad
            JOIN users u ON pad.doctor_id = u.id
            WHERE pad.patient_id = $1
            ORDER BY u.last_name, u.first_name;
        `, [patientId]);
        return result.rows; // Return the doctors for the patient
    } catch (error) {
        console.error('Error fetching doctors for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addRewardToPatient = async (patientId, rewardId) => {
    try {
        const result = await client.query('INSERT INTO user_rewards (user_id, reward_id, redeemed_at, expiration_date) VALUES ($1, $2, $3, $4) RETURNING *;', [patientId, rewardId, "NOW()", "NOW() + interval \'3 day\'"]);
        return result.rows; // Return the added reward for the patient
    } catch (error) {
        console.error('Error adding reward to patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllRewardsForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM user_rewards WHERE user_id = $1', [patientId]);
        return result.rows; // Return the rewards for the patient
    } catch (error) {
        console.error('Error fetching rewards for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const removeRewardFromPatient = async (patientId, rewardId) => {
    try {
        const result = await client.query('DELETE FROM user_rewards WHERE user_id = $1 AND reward_id = $2 RETURNING *;', [patientId, rewardId]);
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

const addPointTrackerToPatient = async (patientId) => {
    try {
        const result = await client.query('INSERT INTO points (user_id, current_points, overall_points, last_updated) VALUES ($1, $2, $2, $3) RETURNING *;', [patientId, 0, "NOW()"]);
        return result.rows; // Return the added points tracker object
    } catch (error) {
        console.error('Error adding points tracker to patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const pointTrackerExists = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM points WHERE user_id = $1;', [patientId]);
        return result.rows.length > 0; // Return true if the points tracker exists, false otherwise 
    } catch (error) {
        console.error('Error checking if points tracker exists:', error);
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
        const result = await client.query('SELECT current_points, overall_points FROM points WHERE user_id = $1;', [patientId]);
        return result.rows[0] || { current_points: 0, overall_points: 0 }; // Return the points object with defaults
    } catch (error) {
        console.error('Error fetching current points for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addReminderToPatient = async (newReminder) => {
    try {
        const result = await client.query(
            'INSERT INTO reminders (user_id, medication_id, dosage, schedule_time, frequency, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', newReminder
        );
        return result.rows[0]; // Return the added reminder object
    } catch (error) {
        console.error('Error adding reminder to patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllRemindersForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT reminders.id, reminders.medication_id, medications.name, reminders.dosage, reminders.schedule_time, reminders.frequency, reminders.start_date, reminders.end_date FROM reminders JOIN medications ON reminders.medication_id = medications.id WHERE reminders.user_id = $1;', [patientId]);
        return result.rows; // Return the reminders for the patient
    } catch (error) {
        console.error('Error fetching reminders for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateReminderForOnePatient = async (patientId, reminderId, updatedData) => {
    try {
        const query = 'UPDATE reminders SET medication_name = $1, dosage = $2, schedule_time = $3, frequency = $4, start_date = $5, end_date = $6 WHERE user_id = $7 AND id = $8 RETURNING *;';
        const values = [updatedData.medication_name, updatedData.dosage, updatedData.schedule_time, updatedData.frequency, updatedData.start_date, updatedData.end_date, patientId, reminderId];
        const result = await client.query(query, values);
        return result.rows[0]; // Return the updated reminder object
    } catch (error) {
        console.error('Error updating reminder for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteReminderForOnePatient = async (patientId, reminderId) => {
    try {
        const result = await client.query('DELETE FROM reminders WHERE user_id = $1 AND id = $2 RETURNING *;', [patientId, reminderId]);
        return result.rows[0]; // Return the deleted reminder object
    } catch (error) {
        console.error('Error deleting reminder for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneReminderForOnePatient = async (patientId, reminderId) => {
    try {
        const result = await client.query('SELECT * FROM reminders WHERE user_id = $1 AND id = $2;', [patientId, reminderId]);
        return result.rows[0]; // Return the reminder object
    } catch (error) {
        console.error('Error fetching reminder for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAdherenceForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM adherence WHERE user_id = $1;', [patientId]);
        return result.rows[0]; // Return the adherence object
    } catch (error) {
        console.error('Error fetching adherence for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addAdherenceForOnePatient = async (adherence) => {
    try {
        const result = await client.query(
            'INSERT INTO adherence (user_id, reminder_id, scheduled_for, points_awarded) VALUES ($1, $2, $3, $4) RETURNING *;', adherence
        );
        return result.rows[0]; // Return the added adherence object
    } catch (error) {
        console.error('Error adding adherence for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateAdherenceForOnePatient = async (patientId, adherenceId, updatedData) => {
    try {
        const query = 'UPDATE adherence SET medication_name = $1, dosage = $2, scheduled_for = $3, frequency = $4, start_date = $5, end_date = $6 WHERE user_id = $7 AND id = $8 RETURNING *;';
        const values = [updatedData.medication_name, updatedData.dosage, updatedData.schedule_time, updatedData.frequency, updatedData.start_date, updatedData.end_date, patientId, adherenceId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated adherence object
    } catch (error) {
        console.error('Error updating adherence for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteAdherenceForOnePatient = async (patientId, adherenceId) => {
    try {
        const result = await client.query('DELETE FROM adherence WHERE user_id = $1 AND id = $2 RETURNING *;', [patientId, adherenceId]);
        return result.rows; // Return the deleted adherence object
    } catch (error) {
        console.error('Error deleting adherence for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneAdherenceForOnePatient = async (patientId, adherenceId) => {
    try {
        const result = await client.query('SELECT * FROM adherence WHERE user_id = $1 AND id = $2;', [patientId, adherenceId]);
        return result.rows; // Return the adherence object
    } catch (error) {
        console.error('Error fetching adherence for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAdherenceForOneReminderForOnePatient = async (patientId, reminderId) => {
    try {
        const result = await client.query('SELECT * FROM adherence WHERE user_id = $1 AND reminder_id = $2;', [patientId, reminderId]);
        return result.rows; // Return the adherence object
    } catch (error) {
        console.error('Error fetching adherence for reminder for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addHealthDataForOnePatient = async (healthData) => {
    try {
        const result = await client.query(
            'INSERT INTO health_data (user_id, data_type, value, unit, recorded_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;', healthData
        );
        return result.rows; // Return the added health data object
    } catch (error) {
        console.error('Error adding health data for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllHealthDataForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM health_data WHERE user_id = $1;', [patientId]);
        return result.rows; // Return the health data for the patient
    } catch (error) {
        console.error('Error fetching health data for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneHealthDataForOnePatient = async (patientId, healthId) => {
    try {
        const result = await client.query('SELECT * FROM health_data WHERE user_id = $1 AND id = $2;', [patientId, healthId]);
        return result.rows; // Return the health data object
    } catch (error) {
        console.error('Error fetching health data for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateHealthDataForOnePatient = async (patientId, healthId, updatedData) => {
    try {
        const query = 'UPDATE health_data SET data_type = $1, value = $2, unit = $3, recorded_at = $4 WHERE user_id = $5 AND id = $6 RETURNING *;';
        const values = [updatedData.data_type, updatedData.value, updatedData.unit, "NOW()", patientId, healthId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated health data object
    } catch (error) {
        console.error('Error updating health data for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteHealthDataForOnePatient = async (patientId, healthId) => {
    try {
        const result = await client.query('DELETE FROM health_data WHERE user_id = $1 AND id = $2 RETURNING *;', [patientId, healthId]);
        return result.rows; // Return the deleted health data object
    } catch (error) {
        console.error('Error deleting health data for patient:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getLastHealthDataForOnePatient = async (patientId) => {
    try {
        const result = await client.query('SELECT * FROM health_data WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1;', [patientId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching last health data for patient:', error);
        throw error;
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
    addPointTrackerToPatient,
    pointTrackerExists,
    getAllPointsForPatient,
    getCurrentPointsForPatient,
    addReminderToPatient,
    getAllRemindersForOnePatient,
    updateReminderForOnePatient,
    deleteReminderForOnePatient,
    getOneReminderForOnePatient,
    getAdherenceForOnePatient,
    addAdherenceForOnePatient,
    updateAdherenceForOnePatient,
    deleteAdherenceForOnePatient,
    getOneAdherenceForOnePatient,
    getAdherenceForOneReminderForOnePatient,
    addHealthDataForOnePatient,
    getAllHealthDataForOnePatient,
    getOneHealthDataForOnePatient,
    updateHealthDataForOnePatient,
    deleteHealthDataForOnePatient,
    getLastHealthDataForOnePatient,
};