const express = require("express");
const controller = require("../controllers/doctors.controllers.js");

const router = express.Router();

router.post("/", controller.addDoctor);
router.get("/", controller.getDoctors);
router.get("/:doctorId/patients", controller.getAllPatientsForOneDoctor);

module.exports = router;

