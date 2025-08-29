import { pool } from "../db/db.js";

export async function createClient(clientData) {
  try {
    const {
      first_name,
      last_name,
      address,
      email_address,
      phone_number,
      date_of_birth,
      license_number,
      issuing_authority,
      license_expiry,
    } = clientData;

    const query =
      "INSERT INTO clients(first_name, last_name, street_name, city, postcode, email_address, phone_number, date_of_birth, license_number, issuing_authority, license_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    const { street_name, city, postcode } = address;

    const values = [
      first_name,
      last_name,
      street_name,
      city,
      postcode,
      email_address,
      phone_number,
      date_of_birth,
      license_number,
      issuing_authority,
      license_expiry,
    ];

    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

export async function getAllClients() {
  try {
    const query =
      "SELECT id, first_name, last_name FROM clients ORDER BY first_name, last_name ASC";
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
