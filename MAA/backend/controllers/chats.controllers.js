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

const createNewMessage = async (req, res) => {
    const chatId = req.params.chatId;
    //chat_id, sender_id, receiver_id, content, sent_at, is_read, status, parent_message_id
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const content = req.body.content;
    const parent_message_id = req.body.parent_message_id || null;
    

    // Validate input data
    if (!chatId || !sender_id || !receiver_id || !content ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const message = [chatId, sender_id, receiver_id, content, parent_message_id];
        const newMessage = await model.createNewMessage(message);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating new message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    // Validate input data
    if (!messageId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await model.deleteMessage(messageId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const softDeleteMessage = async (req, res) => {
    const { messageId } = req.params;

    // Validate input data
    if (!messageId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await model.softDeleteMessage(messageId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error soft-deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editMessage = async (req, res) => {
    const messageId  = req.params.messageId;
    const newContent = req.body.content;

    // Validate input data
    if (!messageId || !newContent) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedMessage = await model.editMessage(messageId, newContent);
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const markAsRead = async (req, res) => {
    const { messageId } = req.params;

    // Validate input data
    if (!messageId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await model.markAsRead(messageId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllUnreadMessages = async (req, res) => {
    const { userId } = req.params;

    // Validate input data
    if (!userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const unreadMessages = await model.getAllUnreadMessages(userId);
        res.status(200).json(unreadMessages);
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllReadMessages = async (req, res) => {
    const { userId } = req.params;

    // Validate input data
    if (!userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const readMessages = await model.getAllReadMessages(userId);
        res.status(200).json(readMessages);
    } catch (error) {
        console.error('Error fetching read messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getChatById = async (req, res) => {
    const { chatId } = req.params;

    // Validate input data
    if (!chatId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chat = await model.getChatById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Internal server error' });
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