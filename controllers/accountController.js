// controllers/accountController.js
const utilities = require("../utilities");

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

// Export both functions
module.exports = { buildLogin, buildRegister };