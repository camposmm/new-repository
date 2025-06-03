const { body, validationResult } = require("express-validator");

const validate = {};

// Classification Rules
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must be at least 3 characters and cannot contain spaces or special characters.")
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    });
    return;
  }

  next();
};

// Inventory Rules
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Vehicle make is required and must be at least 2 characters."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Vehicle model is required and must be at least 2 characters."),

    body("inv_year")
      .trim()
      .escape()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please enter a valid year between 1900 and 2099."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("A description of at least 10 characters is required."),

    body("inv_image")
      .trim()
      .escape()
      .isURL()
      .withMessage("Valid image URL is required."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .isURL()
      .withMessage("Valid thumbnail URL is required."),

    body("inv_price")
      .trim()
      .escape()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .escape()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative integer."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: errors.array(),
      ...req.body,
      classifications: await inventoryModel.getClassifications()
    });
    return;
  }

  next();
};

module.exports = validate;