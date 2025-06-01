// controllers/accountController.js
const utilities = require("../utilities");
const accountModel = require('../models/accountModel'); // Ensure this line is present

/* ***************************
 *  Build login view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = ""; // Initialize nav as empty string
  try {
    nav = await utilities.getNav(); // Try to get navigation data
  } catch (error) {
    console.error("Error fetching navigation:", error.message); // Log error if DB fails
    // Proceed without navigation data if DB connection fails
  }
  res.render("account/login", {
    title: "Login",
    nav, // Pass nav (either fetched data or empty string)
    errors: null,
    message: req.flash("notice"), // Pass flash messages
    messageType: req.flash("messageType") // Pass flash message type
  });
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  });
}
/* ****************************************
 * Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [] // Always pass an empty array for errors
  });
}

/* ****************************************
*  Process Registration
* *************************************** */

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult && regResult.rowCount && regResult.rowCount > 0) {
      req.flash("notice", `Congratulations, ${account_firstname}! Please log in.`);
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, registration failed.");
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: ["Registration failed. Please try again."] // Provide an error message
      });
    }
  } catch (error) {
    console.error("Error registering account:", error.message);
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: ["An unexpected error occurred. Please try again later."] // Handle errors gracefully
    });
  }
}

// Export this function too
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
};