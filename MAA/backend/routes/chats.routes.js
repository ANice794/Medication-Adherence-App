const express = require("express");
const controller = require("../controllers/chats.controllers.js");

const router = express.Router();

router.post("/doctor/:doctorId/patient/:patientId", controller.createNewChat);
router.get("/:userId", controller.getAllChats);
router.get("/details/:chatId", controller.getChatById);
router.get("/:chatId/messages", controller.getAllMessages);
router.post("/:chatId/messages", controller.createNewMessage);
router.delete("/:chatId/messages/:messageId", controller.deleteMessage);
router.put("/:chatId/messages/:messageId/soft-delete", controller.softDeleteMessage);
router.put("/:chatId/messages/:messageId", controller.editMessage);
router.put("/:chatId/messages/:messageId/read", controller.markAsRead);
router.get("/messages/read/:userId", controller.getAllReadMessages);
router.get("/messages/unread/:userId", controller.getAllUnreadMessages);

module.exports = router;