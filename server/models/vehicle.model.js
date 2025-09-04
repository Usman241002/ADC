import { pool } from "../db/db.js";

export async function getAllVehicles() {
  const query = `
    SELECT
        v.id,
        v.vrm,
        v.make,
        v.model,
        v.mileage,
        v.mot_expiry_date,
        v.road_tax_expiry_date,
        v.company,
        v.weekly_rent,
        v.status,
        v.type,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', cp.id,
                    'city', cp.city,
                    'plate_number', cp.plate_number,
                    'renewal_date', cp.renewal_date
                )
            ) FILTER (WHERE cp.id IS NOT NULL),
            '[]'::json
        ) as council_plates
    FROM vehicles v
    LEFT JOIN council_plates cp ON v.id = cp.vehicle_id
    GROUP BY v.id
    ORDER BY v.id ASC
  `;

  try {
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
}

export async function getVehicleById(id) {
  const query =
    "SELECT v.id, v.vrm, v.make, v.model, v.mileage, v.mot_expiry_date, v.road_tax_expiry_date, v.company, v.weekly_rent, v.status, v.type, COALESCE(JSON_AGG(JSON_BUILD_OBJECT( 'id', cp.id, 'city', cp.city, 'plate_number', cp.plate_number, 'renewal_date', cp.renewal_date)) FILTER (WHERE cp.id IS NOT NULL), '[]'::json) as council_plates FROM vehicles v LEFT JOIN council_plates cp ON v.id = cp.vehicle_id WHERE v.id = $1 GROUP BY v.id ORDER BY v.id ASC";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function updateVehicleById(id, vehicleData) {
  const {
    vrm,
    make,
    model,
    mileage,
    mot_expiry_date,
    road_tax_expiry_date,
    council_plates,
    company,
    weekly_rent,
    vehicle_type,
  } = vehicleData;

  const uppercaseModel = model.toUpperCase();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update the main vehicle row
    const updateQuery = `
        UPDATE vehicles
        SET
          vrm = $1,
          make = $2,
          model = $3,
          mileage = $4,
          mot_expiry_date = $5::DATE,
          road_tax_expiry_date = $6::DATE,
          company = $7,
          weekly_rent = $8,
          type = $9
        WHERE id = $10
        RETURNING id
      `;

    const updateValues = [
      vrm,
      make,
      uppercaseModel,
      mileage,
      mot_expiry_date,
      road_tax_expiry_date,
      company,
      weekly_rent,
      vehicle_type,
      id,
    ];

    const vehicleResult = await client.query(updateQuery, updateValues);
    if (vehicleResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null; // vehicle not found
    }

    // Replace council plates (delete old → insert new)
    await client.query("DELETE FROM council_plates WHERE vehicle_id = $1", [
      id,
    ]);

    for (const plate of council_plates) {
      const plateQuery = `
          INSERT INTO council_plates (vehicle_id, city, plate_number, renewal_date)
          VALUES ($1, $2, $3, $4::DATE)
        `;
      const plateValues = [
        id,
        plate.city,
        plate.plate_number.toUpperCase(),
        plate.renewal_date,
      ];
      await client.query(plateQuery, plateValues);
    }

    await client.query("COMMIT");

    // Return the updated record
    return await getVehicleById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating vehicle:", err);
    throw new Error("Error updating vehicle: " + err.message);
  } finally {
    client.release();
  }
}

export async function addVehicleDetails(vehicleData) {
  const {
    vrm,
    make,
    model,
    mileage,
    mot_expiry_date,
    road_tax_expiry_date,
    council_plates,
    company,
    weekly_rent,
    vehicle_type,
  } = vehicleData;

  const uppercaseModel = model.toUpperCase();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicleQuery =
      "INSERT INTO vehicles (vrm, make, model, mileage, mot_expiry_date, road_tax_expiry_date, company, weekly_rent, type) VALUES ($1, $2, $3, $4, $5::DATE, $6::DATE, $7, $8, $9) RETURNING id";

    const vehicleValues = [
      vrm,
      make,
      uppercaseModel,
      mileage,
      mot_expiry_date,
      road_tax_expiry_date,
      company,
      weekly_rent,
      vehicle_type,
    ];

    const vehicleResult = await client.query(vehicleQuery, vehicleValues);

    const vehicleId = vehicleResult.rows[0].id;

    for (const plate of council_plates) {
      const plateQuery = `
            INSERT INTO council_plates (vehicle_id, city, plate_number, renewal_date)
            VALUES ($1, $2, $3, $4::DATE)
          `;
      const plateValues = [
        vehicleId,
        plate.city,
        plate.plate_number.toUpperCase(),
        plate.renewal_date,
      ];

      await client.query(plateQuery, plateValues);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Error adding vehicle with plates: " + err.message);
  }
}
