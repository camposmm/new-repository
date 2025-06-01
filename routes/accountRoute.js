const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

/**
 * Route to build the login view
 */
router.get("/login", utilities.handleErrors(accountController.buildLogin));


router.get("/register", accountController.buildRegister);

module.exports = router;