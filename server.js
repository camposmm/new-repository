/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute');
// Add this near the top with your other requires
const utilities = require('./utilities/');

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
    next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Add this with your other routes
app.get("/cse-motors", function(req, res){
  res.render("cse-motors", {
    title: "CSE Motors",
    vehicle: {
      name: "DMC Delorean",
      features: ["3 Cup holders", "Superman doors", "Fuzzy dice"],
      upgrades: [
        ["Flux Capacitor", "Flame Breaks"],
        ["32bit", "Bumper Stickers", "Hup Caps"]
      ],
      reviews: [
        { text: "So fast it's almost like traveling in time.", rating: "4/5" },
        { text: "Coolest ride on the road.", rating: "4/5" },
        { text: "I'm feeling McFly!", rating: "5/5" },
        { text: "The most futuristic ride of our day.", rating: "4.5/5" },
        { text: "80's livin and I love it!", rating: "5/5" }
      ]
    }
  });
});