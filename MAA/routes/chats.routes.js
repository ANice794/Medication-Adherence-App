const express = require("express");
const controller = require("../controllers/chats.controllers.js");

const router = express.Router();

router.post("/doctor/:doctorId/patient/:patientId", controller.createNewChat);
router.get("/:userId", controller.getAllChats);
router.get("/messages/:chatId", controller.getAllMessages);

module.exports = router;