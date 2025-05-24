const utilities = require("../utilities/");

const errorCont = {};

/* ***************************
 * Trigger a 500 error
 * ************************** */
errorCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error to trigger the 500 error handler
  throw new Error("Intentional 500 error triggered from the error controller");
};

module.exports = errorCont;
