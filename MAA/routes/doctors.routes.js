const express = require("express");
const controller = require("../controllers/doctors.controllers.js");

const router = express.Router();

router.post("/", controller.addDoctor);
router.get("/", controller.getDoctors);
router.get("/:doctorId/patients", controller.getAllPatientsForOneDoctor);
router.get("/:doctorId", controller.getOneDoctor);
router.put("/:doctorId", controller.updateDoctor);
router.delete("/:doctorId", controller.deleteDoctor);
router.get("/chats/:doctorId", controller.getAllChats);
router.get("/patients/:doctorId", controller.howManyPatientsPerDoctor);
router.post("/chats/doctor/:doctorId/patient/:patientId", controller.createNewChat);

module.exports = router;

