import { pool } from "../db/db.js";
import {} from "../utils.js";

export async function getAllVehicles() {
  const query =
    "SELECT * FROM vehicles JOIN council_plates on vehicles.id = council_plates.vehicle_id ORDER BY vehicles.id ASC";

  try {
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
}

export async function addVehicleDetails(vehicleData) {
  const {
    vrm,
    make,
    model,
    mileage,
    motExpiryDate,
    roadTaxExpiryDate,
    councilPlates,
    company,
    weeklyRent,
  } = vehicleData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicleQuery =
      "INSERT INTO vehicles (vrm, make, model, mileage, mot_expiry_date, road_tax_expiry_date, company, weekly_rent) VALUES ($1, $2, $3, $4, $5::DATE, $6::DATE, $7, $8) RETURNING id";

    const vehicleValues = [
      vrm,
      make,
      model,
      mileage,
      motExpiryDate,
      roadTaxExpiryDate,
      company,
      weeklyRent,
    ];

    const vehicleResult = await client.query(vehicleQuery, vehicleValues);

    const vehicleId = vehicleResult.rows[0].id;

    for (const plate of councilPlates) {
      const plateQuery = `
            INSERT INTO council_plates (vehicle_id, city, plate_number, renewal_date)
            VALUES ($1, $2, $3, $4::DATE)
          `;
      const plateValues = [
        vehicleId,
        plate.city,
        plate.plateNumber,
        plate.renewalDate,
      ];

      await client.query(plateQuery, plateValues);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Error adding vehicle with plates: " + err.message);
  }
}
