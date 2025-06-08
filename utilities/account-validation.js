const { body, validationResult } = require("express-validator");
const utilities = require("./index");
const accountModel = require("../models/accountModel");

const validate = {};

/* ***************************
 * Validation Rules
 ***************************/

/**
 * Registration validation rules
 */
validate.registrationRules = () => {
  return [
    // First name validation
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Last name validation
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Email validation
    body("account_email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (value) => {
        const existingAccount = await accountModel.getAccountByEmail(value);
        if (existingAccount) {
          throw new Error("This email is already in use.");
        }
        return true;
      }),

    // Password validation
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/**
 * Account update validation rules
 */
validate.updateRules = () => {
  return [
    // First name validation
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Last name validation
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Email validation
    body("account_email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (value, { req }) => {
        const existingAccount = await accountModel.getAccountByEmail(value);
        if (existingAccount && existingAccount.account_id != req.body.account_id) {
          throw new Error("This email is already in use.");
        }
        return true;
      })
  ];
};

/**
 * Password update validation rules
 */
validate.passwordRules = () => {
  return [
    // Password validation
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* ***************************
 * Validation Check Middleware
 ***************************/

/**
 * Check registration data
 */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email
    });
    return;
  }

  next();
};

/**
 * Check account update data
 */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account: accountData
    });
    return;
  }

  next();
};

/**
 * Check password update data
 */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account: accountData
    });
    return;
  }

  next();
};

module.exports = validate;