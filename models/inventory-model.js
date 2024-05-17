const pool = require("../database/")

/**********************************
 * Get all classification data
 * ***************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("Getclassificationsbyid error " + error)
  }
}

async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory where inv_id = $1`, [vehicle_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("GetVehicleByiD ERROR " + error)
  }
}

async function registerClassification(classification_name) {
  try {
    return await pool.query(`INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function registerInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    let sql = `INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
    const inventoryResult = await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    return inventoryResult
  } catch (error) {
    return error.message
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, registerClassification, registerInventory }