import { pool } from "../db/db.js";

export async function getAllRentals() {
  try {
    const query =
      "SELECT r.rental_id, r.status AS rental_status, r.start_date, r.end_date, v.vrm as vehicle_vrm, v.make AS vehicle_make, v.model AS vehicle_model, v.company, c.first_name AS customer_first_name, c.last_name AS customer_last_name, v.weekly_rent FROM rentals r JOIN vehicles v ON r.vehicle_id = v.id JOIN clients c ON r.client_id = c.id WHERE r.status = 'Active' OR r.status = 'Inactive' ORDER BY r.end_date";
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching rentals:", error);
    throw error;
  }
}

export async function createRental(rentalData) {
  try {
    const { vehicle_id, client_id, start_date, end_date } = rentalData;

    const query =
      "INSERT INTO rentals(vehicle_id, client_id, start_date, end_date) VALUES ($1, $2, $3, $4)";

    const values = [vehicle_id, client_id, start_date, end_date];

    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
}

export async function getAllAvailableVehicles() {
  try {
    const query =
      "SELECT id, vrm, make, model, mileage, company, weekly_rent, status FROM VEHICLES WHERE status = 'Available' ORDER BY weekly_rent DESC";

    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    throw error;
  }
}
