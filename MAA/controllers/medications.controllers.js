const model = require('../models/medications.models');

const getAllMedications = async (req, res) => {
    try {
        const medications = await model.getAllMedications();
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addMedication = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let user_id = req.body.user_id;
    let fhir_medication_id = req.body.fhir_medication_id || null;
    let name = req.body.name;
    let dosage = req.body.dosage;
    let route = req.body.route;
    let frequency = req.body.frequency;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date || null;
    let source = req.body.source;

    // Validate input data
    if (!name || !dosage || !frequency || !start_date || !user_id || !route || !source) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let newMedication = [user_id, fhir_medication_id, name, dosage, route, frequency, start_date, end_date, source, "NOW()"];

    try {
        const addedMedication = await model.addMedication(newMedication);
        res.status(201).json(addedMedication);
    } catch (error) {
        console.error('Error adding medication:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneMedication = async (req, res) => {
    let medicationId = req.params.medicationId;

    if (!medicationId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const medication = await model.getOneMedication(medicationId);
        res.json(medication);
    } catch (error) {
        console.error('Error fetching medication:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateMedication = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let medicationId = req.params.medicationId;
    let updatedData = req.body;

    // Validate input data
    if (!medicationId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedMedication = await model.updateMedication(medicationId, updatedData);
        res.status(200).json(updatedMedication);
    } catch (error) {
        console.error('Error updating medication:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMedication = async (req, res) => {
    let medicationId = req.params.medicationId;

    if (!medicationId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedMedication = await model.deleteMedication(medicationId);
        res.status(200).json(deletedMedication);
    } catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllMedicationsForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const medications = await model.getAllMedicationsForOnePatient(patientId);
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneMedicationForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let medicationId = req.params.medicationId;

    if (!patientId || !medicationId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const medication = await model.getOneMedicationForOnePatient(patientId, medicationId);
        res.json(medication);
    } catch (error) {
        console.error('Error fetching medication for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateMedicationForOnePatient = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is undefined' });
    }

    let patientId = req.params.patientId;
    let medicationId = req.params.medicationId;
    let updatedData = req.body;

    // Validate input data
    if (!patientId || !medicationId || !updatedData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedMedication = await model.updateMedicationForOnePatient(patientId, medicationId, updatedData);
        res.status(200).json(updatedMedication);
    } catch (error) {
        console.error('Error updating medication for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMedicationForOnePatient = async (req, res) => {
    let patientId = req.params.patientId;
    let medicationId = req.params.medicationId;

    if (!patientId || !medicationId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const deletedMedication = await model.deleteMedicationForOnePatient(patientId, medicationId);
        res.status(200).json(deletedMedication);
    } catch (error) {
        console.error('Error deleting medication for patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllMedications,
    addMedication,
    getOneMedication,
    updateMedication,
    deleteMedication,
    getAllMedicationsForOnePatient,
    getOneMedicationForOnePatient,
    updateMedicationForOnePatient,
    deleteMedicationForOnePatient
};