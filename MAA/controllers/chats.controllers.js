const model = require('../models/chats.models');

const createNewChat = async (req, res) => {
    const { doctorId, patientId } = req.params;

    // Validate input data
    if (!doctorId || !patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chat = await model.createNewChat(doctorId, patientId);
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllChats = async (req, res) => {
    const { userId } = req.params;

    // Validate input data
    if (!userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chats = await model.getAllChats(userId);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllMessages = async (req, res) => {
    const { chatId } = req.params;

    // Validate input data
    if (!chatId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const messages = await model.getAllMessages(chatId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createNewChat,
    getAllChats,
    getAllMessages
};