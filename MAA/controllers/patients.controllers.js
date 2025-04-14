const model = require('../models/patients.models');

const addPatient = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let profile_picture = req.body.profile_picture || null; // Default to null if not provided
    let dob = req.body.dob;

    // Validate input data
    if (!first_name || !last_name || !email || !password || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let newPatient = [first_name, last_name, email, password, profile_picture, dob];
    try {

        let theNewPatient = await model.createPatient(newPatient);
        await model.addPointsToPatient([theNewPatient.id]);
        res.json(theNewPatient);
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await model.getAllPatients();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOnePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const patient = await model.getOnePatient(patientId);
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let updatedData = req.body;

    if (!patientId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedPatient = await model.updatePatient(patientId, updatedData);
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedPatient = await model.deletePatient(patientId);
        res.json(deletedPatient);
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllChats = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chats = await model.getAllChats(patientId);
        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllMessages = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const messages = await model.getAllMessages(patientId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllMessagesForOneChat = async (req, res) => {
    let patientId = req.params.patientId;
    let chatId = req.params.chatId;

    if (!patientId || !chatId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const messages = await model.getAllMessagesForOneChat(patientId, chatId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages for chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNewChat = async (req, res) => {
    let doctorId = req.params.doctorId;
    let patientId = req.params.patientId;

    if (!doctorId || !patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newChat = await model.createNewChat(doctorId, patientId);
        res.json(newChat);
    } catch (error) {
        console.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllDoctorsForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const doctors = await model.getAllDoctorsForOnePatient(patientId);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addRewardToPatient = async (req, res) => {
    let patientId = req.params.patientId;
    let rewardId = req.params.rewardId;

    if (!patientId || !rewardId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedPatient = await model.addRewardToPatient(patientId, rewardId);
        const reward = await model.getReward(rewardId);
        await (model.removePointsFromPatient(reward.points, patientId));
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error adding reward to patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const removeRewardFromPatient = async (req, res) => {
    let patientId = req.params.patientId;
    let rewardId = req.params.rewardId;

    if (!patientId || !rewardId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedPatient = await model.removeRewardFromPatient(patientId, rewardId);
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error removing reward from patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllRewardsForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const rewards = await model.getAllRewardsForOnePatient(patientId);
        const goodRewards = [];
        for (let i = 0; i < rewards.length; i++) {
            console.log(rewards[i].expiration_date);
            if (rewards[i].expiration_date > Date.now()) {
                goodRewards.push(rewards[i]);
            } else {
                await model.removeRewardFromPatient(patientId, rewards[i].reward_id);
            }
        }
        res.json(goodRewards);
    } catch (error) {
        console.error('Error fetching rewards for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCurrentPointsForPatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const points = await model.getCurrentPointsForPatient(patientId);
        res.json(points);
    } catch (error) {
        console.error('Error fetching points for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllPointsForPatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const points = await model.getAllPointsForPatient(patientId);
        res.json(points);
    } catch (error) {
        console.error('Error fetching points for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addPointsToPatient = async (req, res) => {
    let patientId = req.params.patientId;
    let points = 10; // Default points to add

    if (!patientId || !points) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedPatient = await model.addPointsToPatient(patientId, points);
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error adding points to patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addReminder = async (req, res) => {
    let user_id = req.params.patientId;
    let medication_name = req.body.medication_name;
    let dosage = req.body.dosage;
    let schedule_time = req.body.schedule_time;
    let frequency = req.body.frequency;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    if (!user_id || !medication_name || !dosage || !schedule_time || !frequency || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let newReminder = [user_id, medication_name, dosage, schedule_time, frequency, start_date, end_date];
    try {
        const updatedPatient = await model.addReminderToPatient(newReminder);
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error adding reminder to patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllRemindersForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const reminders = await model.getAllRemindersForOnePatient(patientId);
        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateReminderForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let reminderId = req.params.reminderId;
    let updatedData = req.body;

    if (!patientId || !reminderId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedReminder = await model.updateReminderForOnePatient(patientId, reminderId, updatedData);
        res.json(updatedReminder);
    } catch (error) {
        console.error('Error updating reminder for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReminderForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let reminderId = req.params.reminderId;

    if (!patientId || !reminderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedReminder = await model.deleteReminderForOnePatient(patientId, reminderId);
        res.json(deletedReminder);
    } catch (error) {
        console.error('Error deleting reminder for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneReminderForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let reminderId = req.params.reminderId;

    if (!patientId || !reminderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const reminder = await model.getOneReminderForOnePatient(patientId, reminderId);
        res.json(reminder);
    } catch (error) {
        console.error('Error fetching reminder for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAdherenceForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;


    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const adherence = await model.getAdherenceForOnePatient(patientId);
        res.json(adherence);
    } catch (error) {
        console.error('Error fetching adherence for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addAdherenceForOnePatient = async (req, res) => {
    let user_id = req.params.patientId;
    let reminder_id = req.params.reminderId;
    let schedule_for = req.body.schedule_for;
    let points_rewarded = req.body.points_rewarded;
    try {

        if (!user_id || !reminder_id || !schedule_for || !points_rewarded) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedAdherence = await model.addAdherenceForOnePatient(patientId, medicationId, adherence);
        res.json(updatedAdherence);
    } catch (error) {
        console.error('Error adding adherence for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateAdherenceForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let adherenceId = req.params.adherenceId;
    let updatedData = req.body;

    if (!patientId || !adherenceId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedAdherence = await model.updateAdherenceForOnePatient(patientId, adherenceId, updatedData);
        res.json(updatedAdherence);
    } catch (error) {
        console.error('Error updating adherence for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteAdherenceForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let adherenceId = req.params.adherenceId;

    if (!patientId || !adherenceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedAdherence = await model.deleteAdherenceForOnePatient(patientId, adherenceId);
        res.json(deletedAdherence);
    } catch (error) {
        console.error('Error deleting adherence for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneAdherenceForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let adherenceId = req.params.adherenceId;

    if (!patientId || !adherenceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const adherence = await model.getOneAdherenceForOnePatient(patientId, adherenceId);
        res.json(adherence);
    } catch (error) {
        console.error('Error fetching adherence for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAdherenceForOneReminderForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let reminderId = req.params.reminderId;

    if (!patientId || !reminderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const adherence = await model.getAdherenceForOneReminderForOnePatient(patientId, reminderId);
        res.json(adherence);
    } catch (error) {
        console.error('Error fetching adherence for reminder for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addPatient,
    getPatients,
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
    getCurrentPointsForPatient,
    getAllPointsForPatient,
    addPointsToPatient,
    addReminder,
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
};
