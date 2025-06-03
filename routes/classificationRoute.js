const express = require("express");
const router = express.Router();
const classificationController = require("../controllers/classificationController");

router.get("/add-classification", classificationController.buildAddClassification);
router.post("/add-classification", classificationController.addNewClassification);

module.exports = router;