/* ******************************************
 * Primary server configuration file
 * Sets up Express, middleware, routes, and error handling
 *******************************************/

// Core dependencies
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv").config()

// Database and utilities
const pool = require("./database/")
const connectPgSimple = require("connect-pg-simple")(session)
const utilities = require("./utilities/")

// Route controllers
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute')
const accountRoute = require('./routes/accountRoute')
const staticRoute = require('./routes/static')

/* ***********************
 * Middleware Setup
 *************************/

// Before other middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
// Parse request bodies
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Session configuration
app.use(session({
  store: new connectPgSimple({
    pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || "your-secret-key-here",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  name: 'sessionId'
}))

// Flash messages middleware
app.use(flash())

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

/* ***********************
 * View Engine Setup
 *************************/

// EJS templating
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Static files
app.use(express.static("public"))

/* ***********************
 * Route Handlers
 *************************/

// Static routes
app.use(staticRoute)

// Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Account routes
app.use("/account", accountRoute)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Error Handlers
 *************************/

// 500 Error Handler
app.use(async (err, req, res, next) => {
  console.error(`Server Error: ${err.message}`)
  const nav = await utilities.getNav()
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Sorry, we encountered an unexpected error.",
    nav
  })
})

// 404 Error Handler
app.use(async (req, res, next) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "The page you requested doesn't exist.",
    nav
  })
})

/* ***********************
 * Server Startup
 *************************/

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})