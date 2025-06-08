const utilities = require("../utilities/index");
const accountModel = require("../models/accountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Build registration view
 */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  });
}

/**
 * Process registration form
 */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash password before storing
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
      throw new Error("Registration failed");
    }
  } catch (error) {
    req.flash("notice", "An error occurred during registration.");
    res.status(501).render("account/register", {
      title: "Registration",
      errors: [{ msg: error.message }],
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

/**
 * Build login view
 */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  });
}

/**
 * Process login form
 */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  
  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      throw new Error("Account not found");
    }

    // Compare hashed password
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Remove password before creating token
      delete accountData.account_password;
      
      // Create JWT token
      const accessToken = jwt.sign(
        accountData, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '1h' }
      );
      
      // Set secure cookie
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return res.redirect("/account");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    req.flash("notice", "Invalid credentials. Please try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: null,
      account_email
    });
  }
}

/**
 * Build account management view
 */
async function buildManagement(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      account: res.locals.account
    });
  } catch (error) {
    req.flash("notice", "Error displaying account management view.");
    res.redirect("/");
  }
}

/**
 * Build account update view
 */
async function buildUpdateView(req, res) {
  try {
    const account_id = req.params.accountId;
    const accountData = await accountModel.getAccountById(account_id);
    const nav = await utilities.getNav();

    res.render("account/update", {
      title: "Update Account",
      nav,
      account: accountData,
      errors: null
    });
  } catch (error) {
    req.flash("notice", "Error displaying update view.");
    res.redirect("/account");
  }
}

/**
 * Process account update form
 */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update JWT token with new account data
      const accountData = await accountModel.getAccountById(account_id);
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      
      // Set updated cookie
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
      });
      
      req.flash("notice", "Account updated successfully.");
      res.redirect("/account");
    } else {
      throw new Error("Account update failed");
    }
  } catch (error) {
    req.flash("notice", error.message);
    res.redirect(`/account/update/${account_id}`);
  }
}

/**
 * Process password update form
 */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;
  
  try {
    // Hash new password
    const hashedPassword = bcrypt.hashSync(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      res.redirect("/account");
    } else {
      throw new Error("Password update failed");
    }
  } catch (error) {
    req.flash("notice", error.message);
    res.redirect(`/account/update/${account_id}`);
  }
}

/**
 * Process logout request
 */
async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildRegister,
  registerAccount,
  buildLogin,
  accountLogin,
  buildManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout
};