const utilities = require("../utilities/index");
const accountModel = require("../models/accountModel");
const bcrypt = require("bcrypt");

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  });
}

async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult && regResult.account_id) {
      req.flash("notice", "Registration successful! Please log in.");
      res.redirect("/account/login");
    } else {
      req.flash("notice", "Something went wrong.");
      res.status(501).render("account/register", {
        title: "Registration",
        errors: [{ msg: "Registration failed." }],
        account_firstname,
        account_lastname,
        account_email
      });
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.");
    res.status(501).render("account/register", {
      title: "Registration",
      errors: [{ msg: error.message }],
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  });
}

module.exports = {
  buildRegister,
  registerAccount,
  buildLogin
};