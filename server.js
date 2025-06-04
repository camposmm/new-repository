/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const pool = require("./database/");
const connectPgSimple = require("connect-pg-simple")(session);
const flash = require("connect-flash");
const dotenv = require("dotenv").config();
const { validationResult } = require('express-validator');

// Import controllers
const baseController = require("./controllers/baseController");
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const staticRoute = require('./routes/static');

// Import utilities
const Util = require("./utilities/index");

/* ***********************
 * Middleware
 ************************/

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
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
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Make validationResult available to all routes
app.use((req, res, next) => {
  res.validationResult = validationResult;
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Serve static files
app.use(express.static("public"));

/* ***********************
* Routes
*************************/

// Static routes
app.use(staticRoute);

// Base route
app.get("/", baseController.buildHome);

// Account route
app.use("/account", accountRoute);

// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error occurred: ${err.message || err}`);
  const nav = await Util.getNav();
  const title = err.status === 404 ? "Page Not Found" : "Server Error";
  const statusCode = err.status || 500;
  const message = err.message || "An unexpected error occurred.";

  if (statusCode !== 500) {
    req.flash('notice', message);
  }

  res.status(statusCode).render("errors/error", {
    title,
    message,
    nav
  });
});

// 404 Handler
app.use(async (req, res, next) => {
  const nav = await Util.getNav();
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: 'Sorry, we appear to have lost that page.',
    nav
  });
});

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});