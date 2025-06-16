const invModel = require('../models/inventory-model');
const pool = require('../database/');

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let navList = "<ul><li><a href='/' title='Home page'>Home</a></li>";
  try {
    const data = await invModel.getClassifications();
    data.forEach((row) => {
      navList += `<li><a href="/inv/type/${row.classification_id}" title="See our ${row.classification_name} inventory">${row.classification_name}</a></li>`;
    });
  } catch (error) {
    navList += "<li>Error loading navigation</li>";
  }
  navList += "</ul>";
  return navList;
};

/* **************************************
 * Build classification dropdown list
 * ************************************ */
Util.buildClassificationList = async function (selectedId = null) {
  const data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.forEach((row) => {
    let selected = selectedId == row.classification_id ? " selected" : "";
    classificationList += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Build inventory grid
 * ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += '<li>';
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
    grid += `<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />`;
    grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
    grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
    grid += '</a>';
    grid += '</li>';
  });
  grid += '</ul>';
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;