const model = require('../models/reminders.models');

const addReminder = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is undefined' });
        }
        let user_id = req.body.user_id;
        let medication_id = req.body.medication_id;
        let dosage = req.body.dosage;
        let schedule_time = req.body.schedule_time;
        let frequency = req.body.frequency;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;

        // Validate input data
        if (!user_id || !medication_id|| !dosage || !schedule_time || !frequency || !start_date || !end_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let newReminder = [user_id, medication_id, dosage, schedule_time, frequency, start_date, end_date];

        const addedReminder = await model.addReminder(newReminder);
        res.status(201).json(addedReminder);
    } catch (error) {
        console.error('Error adding reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllReminders = async (req, res) => {
    try {
        const reminders = await model.getAllReminders();
        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneReminder = async (req, res) => {
    let reminderId = req.params.reminderId;

    if (!reminderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const reminder = await model.getOneReminder(reminderId);
        res.json(reminder);
    } catch (error) {
        console.error('Error fetching reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateReminder = async (req, res) => {
    let reminderId = req.params.reminderId;
    let updatedData = req.body;

    if (!reminderId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedReminder = await model.updateReminder(reminderId, updatedData);
        res.status(200).json(updatedReminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReminder = async (req, res) => {
    let reminderId = req.params.reminderId;

    if (!reminderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedReminder = await model.deleteReminder(reminderId);
        res.json(deletedReminder);
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    addReminder,
    getAllReminders,
    getOneReminder,
    updateReminder,
    deleteReminder
};
