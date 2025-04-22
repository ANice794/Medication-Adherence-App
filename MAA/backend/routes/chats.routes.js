const express = require("express");
const controller = require("../controllers/chats.controllers.js");

const router = express.Router();

router.post("/doctor/:doctorId/patient/:patientId", controller.createNewChat);
router.get("/:userId", controller.getAllChats);
router.get("/:chatId/messages", controller.getAllMessages);
router.post("/:chatId/messages", controller.createNewMessage);
router.delete("/messages/:messageId", controller.deleteMessage);
router.put("/messages/delete/:messageId", controller.softDeleteMessage);
router.put("/messages/edit/:messageId", controller.editMessage);
router.put("/messages/read/:messageId", controller.markAsRead);
router.get("/messages/read/:userId", controller.getAllReadMessages);
router.get("/messages/unread/:userId", controller.getAllUnreadMessages);

module.exports = router;