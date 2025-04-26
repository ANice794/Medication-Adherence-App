const express = require("express");
const controller = require("../controllers/medications.controllers.js");
const { validateMedication } = require('../middleware/validation');

const router = express.Router();

router.post("/", validateMedication, controller.createMedication);
router.get("/", controller.getAllMedications);
router.get("/:medicationId", controller.getOneMedication);
router.put("/:medicationId", controller.updateMedication);
router.delete("/:medicationId", controller.deleteMedication);
router.get("/patients/:patientId", controller.getAllMedicationsForOnePatient);
router.post("/patients/:patientId", validateMedication, controller.addMedicationForOnePatient);
router.get("/:medicationId/patients/:patientId", controller.getOneMedicationForOnePatient);
router.put("/:medicationId/patients/:patientId", controller.updateMedicationForOnePatient);
router.delete("/:medicationId/patients/:patientId", controller.deleteMedicationForOnePatient);
router.get("/patient/:patientId", controller.getMedicationsByPatientId);

module.exports = router;