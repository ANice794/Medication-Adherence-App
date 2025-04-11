const express = require("express");
const controller = require("../controllers/patients.controllers.js");

const router = express.Router();

router.post("/", controller.addPatient);
router.get("/", controller.getPatients);
router.get("/:patientId", controller.getOnePatient);
router.put("/:patientId", controller.updatePatient);
router.delete("/:patientId", controller.deletePatient);
router.get("/chats/:patientId", controller.getAllChats);
router.get("/messages/:patientId", controller.getAllMessages);
router.get("/user/:patientId/chats/:chatId", controller.getAllMessagesForOneChat);
router.post("/chats/doctor/:doctorId/patient/:patientId", controller.createNewChat);
router.get("/doctor/:patientId", controller.getAllDoctorsForOnePatient);

module.exports = router;