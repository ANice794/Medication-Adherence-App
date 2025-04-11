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
        res.json(await model.createPatient(newPatient));
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
    getAllDoctorsForOnePatient
};
