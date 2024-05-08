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

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById }