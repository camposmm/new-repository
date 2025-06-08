const utilities = require("../utilities/")

/**
 * BaseController handles the main site routes and views
 */
const baseController = {}

/**
 * Build the home page view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
baseController.buildHome = async function(req, res){
  try {
    // Get navigation data
    const nav = await utilities.getNav()
    
    // Initialize messages from flash or empty array
    const flashMessages = req.flash() || []
    const messages = flashMessages.notice || []

    // Render the home view with all required data
    res.render("index", {
      title: "Home", 
      nav,
      messages // Pass messages to the view
    })
  } catch (error) {
    console.error("Error building home view:", error)
    // Render error view if something goes wrong
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Sorry, we encountered an error loading the home page.",
      nav: await utilities.getNav()
    })
  }
}

module.exports = baseController