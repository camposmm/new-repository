const { check, validationResult } = require('express-validator');
const utilities = require('./index');
const invModel = require('../models/inventory-model');

/* ***************************
 * Inventory Validation Rules
 * ************************** */
const inventoryRules = () => {
  return [
    check('inv_make')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a make.'),
    check('inv_model')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a model.'),
    check('inv_year')
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be 4 digits.'),
    check('inv_description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a description.'),
    check('inv_image')
      .trim()
      .isURL()
      .withMessage('Please provide a valid image URL.'),
    check('inv_thumbnail')
      .trim()
      .isURL()
      .withMessage('Please provide a valid thumbnail URL.'),
    check('inv_price')
      .trim()
      .isNumeric()
      .withMessage('Please provide a valid price.'),
    check('inv_miles')
      .trim()
      .isNumeric()
      .withMessage('Please provide valid mileage.'),
    check('inv_color')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a color.'),
    check('classification_id')
      .trim()
      .isNumeric()
      .withMessage('Please select a classification.')
  ];
};

/* ***************************
 * Check Inventory Data
 * ************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    
    return res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      errors: errors.array(),
      classifications,
      ...req.body
    });
  }
  next();
};

module.exports = { inventoryRules, checkInventoryData };