const express = require("express");
const controller = require("../controllers/medications.controllers.js");

const router = express.Router();

router.post("/", controller.addMedication);
router.get("/", controller.getAllMedications);
router.get("/:medicationId", controller.getOneMedication);
router.put("/:medicationId", controller.updateMedication);
router.delete("/:medicationId", controller.deleteMedication);
router.get("/patients/:patientId", controller.getAllMedicationsForOnePatient);
router.get("/patients/:patientId/:medicationId", controller.getOneMedicationForOnePatient);
router.put("/patients/:patientId/:medicationId", controller.updateMedicationForOnePatient);
router.delete("/patients/:patientId/:medicationId", controller.deleteMedicationForOnePatient);

module.exports = router;