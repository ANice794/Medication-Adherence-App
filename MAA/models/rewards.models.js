const client = require('./db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds for bcrypt hashing
const jwt = require('jsonwebtoken');

const createReward = async (newReward) => {
    try {
        const result = await client.query(
            'INSERT INTO rewards (name, description, points_required, image_url) VALUES ($1, $2, $3, $4) RETURNING *;', newReward
        );
        return result.rows[0]; // Return the created reward object
    } catch (error) {
        console.error('Error creating reward:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getAllRewards = async () => {
    try {
        const result = await client.query('SELECT * FROM rewards ORDER BY id;');
        return result.rows; // Return all rewards
    } catch (error) {
        console.error('Error fetching rewards:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const getOneReward = async (rewardId) => {
    try {
        const result = await client.query('SELECT * FROM rewards WHERE id = $1;', [rewardId]);
        return result.rows[0]; // Return the reward object
    } catch (error) {
        console.error('Error fetching reward:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const updateReward = async (rewardId, updatedData) => {
    try {
        const query = 'UPDATE rewards SET name = $1, description = $2, points_required = $3, image_url = $4 WHERE id = $5 RETURNING *;';
        const values = [updatedData.name, updatedData.description, updatedData.points_required, updatedData.image_url, rewardId];
        const result = await client.query(query, values);
        return result.rows[0]; // Return the updated reward object
    } catch (error) {
        console.error('Error updating reward:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

const deleteReward = async (rewardId) => {
    try {
        const result = await client.query('DELETE FROM rewards WHERE id = $1 RETURNING *;', [rewardId]);
        return result.rows[0]; // Return the deleted reward object
    } catch (error) {
        console.error('Error deleting reward:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = {
    createReward,
    getAllRewards,
    getOneReward,
    updateReward,
    deleteReward
};