const model = require('../models/medications.models');
const { epicService } = require('../services/epicService');
const { createMedication: createMedicationModel } = require('../models/medications.models');

const getAllMedications = async (req, res) => {
    try {
        const medications = await model.getAllMedications();
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createMedication = async (req, res) => {
    try {
        const { name, dosage, frequency, route, startDate, patientId } = req.body;

        // Create the medication
        const result = await createMedicationModel({
            name,
            dosage,
            frequency,
            route,
            startDate,
            patientId
        });

        if (!result) {
            return res.status(400).json({
                error: 'Failed to create medication',
                details: 'Could not create medication record'
            });
        }

        return res.status(201).json({
            message: 'Medication created successfully',
            data: result
        });

    } catch (error) {
        console.error('Error creating medication:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
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

const addMedicationForOnePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { name, dosage, frequency, route, startDate } = req.body;

        // Create the medication for the specific patient
        const result = await createMedicationModel({
            name,
            dosage,
            frequency,
            route,
            startDate,
            patientId: parseInt(patientId)
        });

        if (!result) {
            return res.status(400).json({
                error: 'Failed to add medication',
                details: 'Could not add medication for the patient'
            });
        }

        return res.status(201).json({
            message: 'Medication added successfully',
            data: result
        });

    } catch (error) {
        console.error('Error adding medication:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
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

const getMedicationsByPatientId = async (req, res) => {
    let patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const medications = await model.getMedicationsByPatientId(patientId);
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications by patient ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllMedications,
    createMedication,
    getOneMedication,
    addMedicationForOnePatient,
    updateMedication,
    deleteMedication,
    getAllMedicationsForOnePatient,
    getOneMedicationForOnePatient,
    updateMedicationForOnePatient,
    deleteMedicationForOnePatient,
    getMedicationsByPatientId
};