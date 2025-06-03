const pool = require("../database/");

async function getClassifications() {
  try {
    const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    return result.rows; // Ensure you return the rows
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error;
  }
}

module.exports = {
  getClassifications
};