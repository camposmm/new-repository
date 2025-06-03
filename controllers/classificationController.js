const utilities = require('../utilities/index');
const classificationModel = require('../models/classificationModel');

async function buildAddClassification(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  });
}

async function addNewClassification(req, res) {
  const { classification_name } = req.body;

  try {
    const result = await classificationModel.addClassification(classification_name);
    if (result.rowCount > 0) {
      req.flash("notice", "Classification added successfully.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Error adding classification.");
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        errors: [{ msg: "Error adding classification." }],
        classification_name
      });
    }
  } catch (error) {
    req.flash("notice", "Error occurred while adding classification.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      errors: [{ msg: error.message }],
      classification_name
    });
  }
}

module.exports = {
  buildAddClassification,
  addNewClassification
};