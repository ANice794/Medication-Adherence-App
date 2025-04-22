const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const getAllReminders = async () => {
    try {
        const result = await client.query('SELECT * FROM reminders ORDER BY id;');
        return result.rows;
    } catch (error) {
        console.error('Error fetching reminders:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const addReminder = async (newReminder) => {
    try {
        const result = await client.query(
            'INSERT INTO reminders (user_id, medication_name, dosage, schedule_time, frequency, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6);', newReminder
        );
        return result; // Return the created reminder object
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneReminder = async (reminderId) => {
    try {
        const result = await client.query('SELECT * FROM reminders WHERE id = $1;', [reminderId]);
        return result.rows; // Return the reminder object
    } catch (error) {
        console.error('Error fetching reminder:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateReminder = async (reminderId, updatedData) => {
    try {
        const query = 'UPDATE reminders SET user_id = $1, medication_name = $2, dosage = $3, schedule_time = $4, frequency = $5, start_date = $6, end_date = $7 WHERE id = $8 RETURNING *;';
        const values = [updatedData.user_id, updatedData.medication_name, updatedData.dosage, updatedData.schedule_time, updatedData.frequency, updatedData.start_date, updatedData.end_date, reminderId];
        const result = await client.query(query, values);
        return result.rows; // Return the updated reminder object
    } catch (error) {
        console.error('Error updating reminder:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteReminder = async (reminderId) => {
    try {
        const result = await client.query('DELETE FROM reminders WHERE id = $1;', [reminderId]);
        return result; // Return the deleted reminder object
    } catch (error) {
        console.error('Error deleting reminder:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = {
    getAllReminders,
    addReminder,
    getOneReminder,
    updateReminder,
    deleteReminder
};