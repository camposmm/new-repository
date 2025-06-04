const pool = require("../database/");

/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const result = await pool.query(
      "SELECT * FROM classification ORDER BY classification_name"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching classifications:", error.message);
    return [];
  }
}

/* ***************************
 * Add new classification
 * ************************** */
async function addClassification(name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [name]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding classification:", error.message);
    return null;
  }
}

/* ***************************
 * Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
    return [];
  }
}

/* ***************************
 * Get inventory by inventory ID
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryByInventoryId error: " + error);
    return null;
  }
}

/* ***************************
 * Add new inventory item
 * ************************** */
async function addInventory(vehicleData) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = vehicleData;

    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING *;
    `;

    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error adding inventory:", error.message);
    return null;
  }
}

module.exports = {
  getClassifications,
  addClassification,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addInventory
};