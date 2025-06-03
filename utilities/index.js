const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let navList = "<ul>";

  try {
    const data = await invModel.getClassifications();

    // Always include the Home link
    navList += '<li><a href="/" title="Home page">Home</a></li>';

    if (!Array.isArray(data) || data.length === 0) {
      navList += "<li>No classifications found</li>";
    } else {
      data.forEach((row) => {
        navList += `<li><a href="/inv/type/${row.classification_id}" title="See our ${row.classification_name} inventory">${row.classification_name}</a></li>`;
      });
    }
  } catch (error) {
    console.error("Error fetching classification data for navigation:", error);
    navList += "<li>Error loading navigation</li>";
  }

  navList += "</ul>";

  return navList;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid;
  if(data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="" />`; // alt="" since text describes it
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2>${vehicle.inv_model}</h2>`; // No nested <a> here
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += '</div>';
      grid += '</a>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
function handleErrors(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`Error: ${error}`);
      req.flash("notice", "An error occurred. Please try again.");
      res.redirect("/");
    }
  };
}

async function getNav() {
  const data = await classificationModel.getClassifications();
  const nav = await utilities.getNav(data);
  return nav;
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInventoryDetailHTML = async function(vehicle) {
  let detailHTML = '';
  if (vehicle) {
    // Format price and mileage
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price);
    const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    detailHTML = `
      <div class="vehicle-detail-container"> 
        <div class="vehicle-image-container">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </div>
        <div class="vehicle-info-container">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
          <p class="detail-price"><strong>Price:</strong> ${formattedPrice}</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p class="detail-mileage"><strong>Mileage:</strong> ${formattedMileage}</p>
          <p><strong>Year:</strong> ${vehicle.inv_year}</p> 
        </div>
      </div>
    `;
  } else {
    detailHTML = '<p class="notice">Sorry, vehicle details could not be found.</p>';
  }
  return detailHTML;
}

module.exports = Util;