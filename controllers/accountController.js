const utilities = require('../utilities/');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: '',
    message: req.query.message || null
  })
}

module.exports = { buildLogin }