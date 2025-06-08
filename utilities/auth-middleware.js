const jwt = require('jsonwebtoken');
const utilities = require('./index');

/**
 * Middleware to verify JWT token from cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt;
  
  if (!token) {
    req.flash('notice', 'Please log in to access this page.');
    return res.redirect('/account/login');
  }

  try {
    // Verify token and attach account data to request
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.account = decoded;
    res.locals.account = decoded;
    next();
  } catch (error) {
    // Clear invalid token and redirect to login
    req.flash('notice', 'Session expired. Please log in again.');
    res.clearCookie('jwt');
    res.redirect('/account/login');
  }
}

/**
 * Middleware to check account type against required types
 * @param {Array} requiredTypes - Array of allowed account types (e.g., ['Employee', 'Admin'])
 */
function checkAccountType(requiredTypes) {
  return (req, res, next) => {
    if (!req.account) {
      req.flash('notice', 'Please log in to access this page.');
      return res.redirect('/account/login');
    }

    if (!requiredTypes.includes(req.account.account_type)) {
      req.flash('notice', 'You do not have permission to access this page.');
      return res.redirect('/account');
    }

    next();
  };
}

module.exports = { checkJWTToken, checkAccountType };