const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: ""
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process Add Classification
 * ************************** */
invCont.addNewClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "Classification added successfully.");
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Error adding classification.");
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        errors: [{ msg: "Error adding classification." }],
        classification_name
      });
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.");
    console.error("Error adding classification:", error);
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      errors: [{ msg: "An unexpected error occurred." }],
      classification_name
    });
  }
};

/* ***************************
 * Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();

    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
      classifications,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process Add Inventory
 * ************************** */
invCont.addNewVehicle = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  try {
    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });

    if (result) {
      req.flash("notice", "Vehicle added successfully.");
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Error adding vehicle.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        errors: [{ msg: "Error adding vehicle." }],
        ...req.body,
        classifications: await invModel.getClassifications()
      });
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.");
    console.error("Error adding vehicle:", error);
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      errors: [{ msg: "An unexpected error occurred." }],
      ...req.body,
      classifications: await invModel.getClassifications()
    });
  }
};

module.exports = invCont;