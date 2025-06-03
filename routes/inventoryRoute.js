// routes/inventoryRoute.js

const express = require("express");
const router = express.Router();

// Import controllers
const inventoryController = require("../controllers/invController");
const classificationController = require("../controllers/classificationController");

// Import utilities
const utilities = require("../utilities/index");

// Import validation middleware
const invValidate = require("../utilities/inventory-validation");
const classValidate = require("../utilities/classification-validation");

// Route: View vehicles by classification
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Route: View vehicle detail
router.get("/detail/:inventoryId", inventoryController.buildByInventoryId);

// Route: Add new classification
router.get("/add-classification", classificationController.buildAddClassification);
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(classificationController.addNewClassification)
);

// Route: Add new inventory item
router.get("/add-inventory", inventoryController.buildAddInventory);
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addNewInventory)
);
// Route: Add Inventory
router.get("/add-vehicle", inventoryController.buildAddInventory);
router.post(
  "/add-vehicle",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addNewVehicle)
);

module.exports = router;