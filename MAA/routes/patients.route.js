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
router.post("/:patientId/rewards/:rewardId", controller.addRewardToPatient);
router.get("/rewards/:patientId", controller.getAllRewardsForOnePatient);
router.get("/:patientId/points/current", controller.getCurrentPointsForPatient);
router.get("/:patientId/points/all", controller.getAllPointsForPatient);
router.post("/:patientId/points", controller.addPointsToPatient);



module.exports = router;