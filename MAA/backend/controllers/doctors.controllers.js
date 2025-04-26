const model = require('../models/doctors.models');

const addDoctor = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    let profile_picture = req.body.profile_picture || null; // Default to null if not provided
    let dob = req.body.dob;

    if (!first_name || !last_name || !email || !password || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let newDoctor = [first_name, last_name, email, password, profile_picture, dob];
    try {
        const addedDoctor = await model.createDoctor(newDoctor);
        res.status(201).json(addedDoctor);
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await model.getAllDoctors();
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneDoctor = async (req, res) => {
    let doctorId = req.params.doctorId;
    
    if (!doctorId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const doctor = await model.getOneDoctor(doctorId);
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllPatientsForOneDoctor = async (req, res, next) => {
    try {
        const patients = await model.getAllPatientsForOneDoctor(req.params.doctorId);
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error getting all of the patients for a doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateDoctor = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let doctorId = req.params.doctorId;
    let updatedData = req.body;

    // Validate input data
    if (!doctorId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedDoctor = await model.updateDoctor(doctorId, updatedData);
        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDoctor = async (req, res, next) => {
    let doctorId = req.params.doctorId;

    // Validate input data
    if (!doctorId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await model.deletePatient(doctorId);
        const deletedDoctor = await model.deleteDoctor(doctorId);
        res.status(200).json(deletedDoctor);
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const howManyPatientsPerDoctor = async (req, res, next) => {
    let doctorId = req.params.doctorId;
    
    if (!doctorId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const patientCount = await model.howManyPatientsPerDoctor(doctorId);
        res.status(200).json({ count: patientCount });
    } catch (error) {  
        console.error('Error counting patients for doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllChats = async (req, res, next) => {
    let doctorId = req.params.doctorId;

    // Validate input data
    if (!doctorId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chats = await model.getAllChats(doctorId);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllMessages = async (req, res, next) => {
    let doctorId = req.params.doctorId;

    // Validate input data
    if (!doctorId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const messages = await model.getAllMessages(doctorId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNewChat = async (req, res, next) => {
    let doctorId = req.params.doctorId;
    let patientId = req.params.patientId;

    // Validate input data
    if (!doctorId || !patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newChat = await model.createNewChat(doctorId, patientId);
        res.status(201).json(newChat);
    } catch (error) {
        console.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNewMessage = async (req, res, next) => {
    let doctorId = req.params.doctorId;
    let patientId = req.params.patientId;
    let message = req.body.message;
    let chatId = req.params.chatId;
    let parent_message_id = req.params.parent_message_id;

    // Validate input data
    if (!doctorId || !patientId || !message || !chatId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let newMessage = [chatId, doctorId, patientId, message, parent_message_id || null];
        const addedNewMessage = await model.createNewMessage(newMessage);
        res.status(201).json(addedNewMessage);
    } catch (error) {
        console.error('Error creating new message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const softDeleteMessage = async (req, res, next) => {
    let messageId = req.params.messageId;

    // Validate input data
    if (!messageId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedMessage = await model.softDeleteMessage(messageId);
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addPatientToDoctor = async (req, res) => {
    const { doctorId, patientId } = req.params;

    if (!doctorId || !patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // First, check if the relationship already exists
        const existingRelationship = await model.checkPatientDoctorRelationship(doctorId, patientId);
        if (existingRelationship) {
            return res.status(400).json({ error: 'Patient is already assigned to this doctor' });
        }

        // Add the patient to the doctor
        const result = await model.addPatientToDoctor(doctorId, patientId);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding patient to doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addDoctor,
    getDoctors,
    getOneDoctor,
    getAllPatientsForOneDoctor,
    updateDoctor,
    deleteDoctor,
    getAllChats,
    getAllMessages,
    createNewChat,
    createNewMessage,
    softDeleteMessage,
    howManyPatientsPerDoctor,
    addPatientToDoctor,
};
