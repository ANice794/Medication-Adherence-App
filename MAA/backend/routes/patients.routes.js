const express = require("express");
const controller = require("../controllers/patients.controllers.js");

const router = express.Router();

//PATIENT ROUTES
router.post("/", controller.addPatient);
router.get("/", controller.getPatients);
router.get("/:patientId", controller.getOnePatient);
router.put("/:patientId", controller.updatePatient);
router.delete("/:patientId", controller.deletePatient);
router.get("/:patientId/doctor", controller.getAllDoctorsForOnePatient);

//CHATS ROUTES
router.get("/:patientId/chats", controller.getAllChats);
router.get("/:patientId/messages", controller.getAllMessages);
router.get("/:patientId/chats/:chatId", controller.getAllMessagesForOneChat);
router.post("/:patientId/chats/doctor/:doctorId", controller.createNewChat);

//REWARDS ROUTES
router.post("/:patientId/rewards/:rewardId", controller.addRewardToPatient);
router.get("/:patientId/rewards", controller.getAllRewardsForOnePatient);

//POINTS ROUTES
router.get("/:patientId/points/current", controller.getCurrentPointsForPatient);
router.get("/:patientId/points/all", controller.getAllPointsForPatient);
router.put("/:patientId/points", controller.addPointsToPatient);
router.post("/:patientId/points", controller.addPointTrackerToPatient);

//REMINDERS ROUTES
router.post("/:patientId/reminders", controller.addReminder);
router.get("/:patientId/reminders", controller.getAllRemindersForOnePatient);
router.put("/:patientId/reminders/:reminderId", controller.updateReminderForOnePatient);
router.delete("/:patientId/reminders/:reminderId", controller.deleteReminderForOnePatient);
router.get("/:patientId/reminders/:reminderId", controller.getOneReminderForOnePatient);

//ADHERENCE ROUTES
router.get("/:patientId/adherence", controller.getAdherenceForOnePatient);
router.post("/:patientId/reminders/:reminderId/adherence", controller.addAdherenceForOnePatient);
router.put("/:patientId/adherence/:adherenceId", controller.updateAdherenceForOnePatient);
router.delete("/:patientId/adherence/:adherenceId", controller.deleteAdherenceForOnePatient);
router.get("/:patientId/adherence/:adherenceId", controller.getOneAdherenceForOnePatient);
router.get("/:patientId/adherence/reminders/:reminderId", controller.getAdherenceForOneReminderForOnePatient);


//HEALTH ROUTES
router.post("/:patientId/health", controller.addHealthDataForOnePatient);
router.get("/:patientId/health", controller.getAllHealthDataForOnePatient);
router.get("/:patientId/health/:healthId", controller.getOneHealthDataForOnePatient);
router.put("/:patientId/health/:healthId", controller.updateHealthDataForOnePatient);
router.delete("/:patientId/health/:healthId", controller.deleteHealthDataForOnePatient);
router.get("/:patientId/last/health/", controller.getLastHealthDataForOnePatient);


module.exports = router;