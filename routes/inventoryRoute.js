const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");

// Import controllers
const invController = require("../controllers/invController");

// Import validation middleware
const invValidate = require("../utilities/inventory-validation");
const classValidate = require("../utilities/classification-validation");

/* ***************************
 * Inventory Routes
 ***************************/

// Base inventory route - shows management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// View inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// View inventory item detail
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

/* ***************************
 * Classification Management Routes
 ***************************/

// Show add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Process add classification form
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  utilities.handleErrors(classValidate.checkClassificationData),
  utilities.handleErrors(invController.addNewClassification)
);

/* ***************************
 * Inventory Management Routes
 ***************************/

// Show add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process add inventory form
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  utilities.handleErrors(invValidate.checkInventoryData),
  utilities.handleErrors(invController.addNewVehicle)
);

module.exports = router;