const { body, validationResult } = require("express-validator");

const validate = {};

// Rule: Classification name must be at least 3 characters
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters.")
  ];
};

// Middleware to check classification data
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name
    });
    return;
  }

  next();
};

module.exports = validate;