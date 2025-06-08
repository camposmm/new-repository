const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { checkJWTToken, checkAccountType } = require("../utilities/auth-middleware");
const regValidate = require("../utilities/account-validation");

// GET /account/register - Display registration form
router.get("/register", accountController.buildRegister);

// POST /account/register - Process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// GET /account/login - Display login form
router.get("/login", accountController.buildLogin);

// POST /account/login - Process login
router.post("/login", accountController.accountLogin);

// GET /account - Display account management (requires login)
router.get("/", checkJWTToken, accountController.buildManagement);

// GET /account/update/:accountId - Display account update form (requires login)
router.get("/update/:accountId", checkJWTToken, accountController.buildUpdateView);

// POST /account/update - Process account update (requires login)
router.post(
  "/update", 
  checkJWTToken,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  accountController.updateAccount
);

// POST /account/update-password - Process password update (requires login)
router.post(
  "/update-password",
  checkJWTToken,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  accountController.updatePassword
);

// GET /account/logout - Process logout
router.get("/logout", accountController.logout);

module.exports = router;