const express = require("express");
const router = express.Router();

// Import controller functions
const accountController = require("../controllers/accountController");

// Import validation middleware
const regValidate = require("../utilities/account-validation");

// Register routes
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// Login routes
router.get("/login", accountController.buildLogin);

module.exports = router;