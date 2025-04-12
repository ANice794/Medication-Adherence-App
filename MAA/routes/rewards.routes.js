const express = require("express");
const controller = require("../controllers/rewards.controllers.js");

const router = express.Router();


router.post("/", controller.addReward);
router.get("/", controller.getAllRewards);
router.get("/:rewardId", controller.getOneReward);
router.put("/:rewardId", controller.updateReward);
router.delete("/:rewardId", controller.deleteReward);

module.exports = router;