const { check, validationResult } = require('express-validator');
const utilities = require('./index');

/* ***************************
 * Classification Validation Rules
 * ************************** */
const classificationRules = () => {
  return [
    check('classification_name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a classification name.')
      .matches(/^[a-zA-Z]+$/)
      .withMessage('Classification name must contain only letters.')
  ];
};

/* ***************************
 * Check Classification Data
 * ************************** */
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    });
  }
  next();
};

module.exports = { classificationRules, checkClassificationData };