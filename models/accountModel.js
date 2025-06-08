const pool = require("../database/");

/**
 * Get account by email
 * @param {string} email - Account email
 * @returns {Object} Account data
 */
async function getAccountByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_email = $1",
    [email]
  );
  return result.rows[0];
}

/**
 * Get account by ID
 * @param {number} account_id - Account ID
 * @returns {Object} Account data
 */
async function getAccountById(account_id) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_id = $1",
    [account_id]
  );
  return result.rows[0];
}

/**
 * Register new account
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} email - Email address
 * @param {string} password - Hashed password
 * @returns {Object} New account data
 */
async function registerAccount(firstName, lastName, email, password) {
  const result = await pool.query(
    "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstName, lastName, email, password]
  );
  return result.rows[0];
}

/**
 * Update account information
 * @param {number} account_id - Account ID
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} email - Email address
 * @returns {Object} Updated account data
 */
async function updateAccount(account_id, firstName, lastName, email) {
  try {
    // Check if email is already in use by another account
    const emailCheck = await pool.query(
      "SELECT * FROM account WHERE account_email = $1 AND account_id != $2",
      [email, account_id]
    );

    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use by another account.");
    }

    const result = await pool.query(
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
      [firstName, lastName, email, account_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Update account password
 * @param {number} account_id - Account ID
 * @param {string} password - New hashed password
 * @returns {Object} Updated account data
 */
async function updatePassword(account_id, password) {
  const result = await pool.query(
    "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *",
    [password, account_id]
  );
  return result.rows[0];
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  updateAccount,
  updatePassword
};