// controllers/invController.js

const invModel = require("../models/inventory-model");
const classificationModel = require("../models/classificationModel"); // Required here
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Vehicle";
  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  });
};

/* ***************************
 * Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  const grid = await utilities.buildInventoryDetailHTML(data[0]);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_make} ${data[0].inv_model}`;
  res.render("inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  });
};

/* ***************************
 * Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classifications = await classificationModel.getClassifications();

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classifications
  });
};

/* ***************************
 * Handle Add Inventory Submission
 * ************************** */
async function buildManagement(req, res) {
  let nav = await utilities.getNav();
  const flashMessages = req.flash();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    flashMessages
  });
}

async function buildAddClassification(req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: ""
  });
}

async function addNewClassification(req, res) {
  const { classification_name } = req.body;

  try {
    const result = await inventoryModel.addClassification(classification_name);
    if (result.rowCount > 0) {
      req.flash("notice", "Classification added successfully.");
      res.redirect("/inventory/management");
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
}

async function buildAddInventory(req, res) {
  let nav = await utilities.getNav();
  const classifications = await inventoryModel.getClassifications();

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
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
}

async function addNewVehicle(req, res) {
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
    const result = await inventoryModel.addVehicle({
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

    if (result.inv_id) {
      req.flash("notice", "Vehicle added successfully.");
      res.redirect("/inventory/management");
    } else {
      req.flash("notice", "Error adding vehicle.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        errors: [{ msg: "Error adding vehicle." }],
        ...req.body,
        classifications: await inventoryModel.getClassifications()
      });
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.");
    console.error("Error adding vehicle:", error);
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      errors: [{ msg: "An unexpected error occurred." }],
      ...req.body,
      classifications: await inventoryModel.getClassifications()
    });
  }
}

module.exports = {
  buildManagement,
  buildAddClassification,
  addNewClassification,
  buildAddInventory,
  addNewVehicle
};

module.exports = invCont;