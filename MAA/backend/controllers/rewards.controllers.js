const model = require('../models/rewards.models');

const addReward = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }
    let name = req.body.name;
    let points_required = req.body.points;
    let description = req.body.description;
    let image_url = req.body.image_url;
    
    

    if (!name || !description || !points_required || !image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let newReward = [name, description, points, image_url, expiration_date];
    try {
        const addedReward = await model.createReward(newReward);
        res.status(201).json(addedReward);
    } catch (error) {
        console.error('Error adding reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllRewards = async (req, res) => {
    try {
        const rewards = await model.getAllRewards();
        res.json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneReward = async (req, res) => {
    let rewardId = req.params.rewardId;
    
    if (!rewardId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const reward = await model.getOneReward(rewardId);
        res.json(reward);
    } catch (error) {
        console.error('Error fetching reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateReward = async (req, res) => {
    let rewardId = req.params.rewardId;
    let updatedData = req.body;

    if (!rewardId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedReward = await model.updateReward(rewardId, updatedData);
        res.json(updatedReward);
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReward = async (req, res) => {
    let rewardId = req.params.rewardId;

    if (!rewardId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedReward = await model.deleteReward(rewardId);
        res.json(deletedReward);
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addReward,
    getAllRewards,
    getOneReward,
    updateReward,
    deleteReward
};