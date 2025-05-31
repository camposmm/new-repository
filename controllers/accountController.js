// controllers/accountController.js
const utilities = require("../utilities");

/* ***************************
 *  Build login view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

module.exports = { buildLogin };