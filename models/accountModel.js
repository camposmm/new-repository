const pool = require("../database/");

async function getAccountByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_email = $1",
    [email]
  );
  return result.rows[0];
}

async function registerAccount(firstName, lastName, email, password) {
  const result = await pool.query(
    "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstName, lastName, email, password]
  );
  return result.rows[0];
}

module.exports = {
  getAccountByEmail,
  registerAccount
};