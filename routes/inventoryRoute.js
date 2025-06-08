const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");
const invController = require("../controllers/invController");
const { checkJWTToken, checkAccountType } = require("../utilities/auth-middleware");
const invValidate = require("../utilities/inventory-validation");
const classValidate = require("../utilities/classification-validation");

/* ***************************
 * Public Inventory Routes
 ***************************/

// View inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// View inventory item detail
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

/* ***************************
 * Protected Admin/Employee Routes
 * Require JWT and proper account type
 ***************************/

// Inventory management view
router.get("/management", 
  checkJWTToken, 
  checkAccountType(['Employee', 'Admin']), 
  utilities.handleErrors(invController.buildManagement)
);

// Add classification form
router.get("/add-classification", 
  checkJWTToken, 
  checkAccountType(['Employee', 'Admin']), 
  utilities.handleErrors(invController.buildAddClassification)
);

// Process add classification
router.post(
  "/add-classification",
  checkJWTToken,
  checkAccountType(['Employee', 'Admin']),
  classValidate.classificationRules(),
  utilities.handleErrors(classValidate.checkClassificationData),
  utilities.handleErrors(invController.addNewClassification)
);

// Add inventory form
router.get("/add-inventory", 
  checkJWTToken, 
  checkAccountType(['Employee', 'Admin']), 
  utilities.handleErrors(invController.buildAddInventory)
);

// Process add inventory
router.post(
  "/add-inventory",
  checkJWTToken,
  checkAccountType(['Employee', 'Admin']),
  invValidate.inventoryRules(),
  utilities.handleErrors(invValidate.checkInventoryData),
  utilities.handleErrors(invController.addNewVehicle)
);

module.exports = router;