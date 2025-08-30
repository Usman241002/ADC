import { pool } from "../db/db.js";

export async function getAllRentals() {
  try {
    const query =
      "SELECT id, vrm, make, model, mileage, company, weekly_rent, status FROM VEHICLES WHERE status = 'Available' ORDER BY weekly_rent DESC";

    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching rentals:", error);
    throw error;
  }
}
