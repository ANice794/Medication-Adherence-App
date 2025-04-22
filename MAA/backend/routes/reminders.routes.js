const express = require("express");
const controller = require("../controllers/reminders.controllers.js");

const router = express.Router();

router.post("/", controller.addReminder);
router.get("/", controller.getAllReminders);
router.get("/:reminderId", controller.getOneReminder);
router.put("/:reminderId", controller.updateReminder);
router.delete("/:reminderId", controller.deleteReminder);



module.exports = router;