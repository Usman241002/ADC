import sql from "../db/db.js";

export async function getAllVehicles() {
  try {
    const results = await sql`
      SELECT
          v.id,
          v.vrm,
          v.make,
          v.model,
          v.mileage,
          v.mot_expiry_date,
          v.road_tax_expiry_date,
          v.renewal_expiry_date,
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
      ORDER BY v.status ASC, v.id ASC
    `;
    return results;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
}

export async function getVehicleById(id) {
  try {
    const result = await sql`
      SELECT
        v.id,
        v.vrm,
        v.make,
        v.model,
        v.mileage,
        v.mot_expiry_date,
        v.road_tax_expiry_date,
        v.renewal_expiry_date,
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
      WHERE v.id = ${id}
      GROUP BY v.id
      ORDER BY v.id ASC
    `;
    return result[0];
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
}

export async function updateVehicleById(id, vehicleData) {
  const {
    vrm,
    make,
    model,
    mileage,
    mot_expiry_date,
    road_tax_expiry_date,
    renewal_expiry_date,
    council_plates,
    company,
    weekly_rent,
    vehicle_type,
  } = vehicleData;

  const uppercaseModel = model.toUpperCase();

  try {
    // Update the main vehicle row
    const vehicleResult = await sql`
      UPDATE vehicles
      SET
        vrm = ${vrm},
        make = ${make},
        model = ${uppercaseModel},
        mileage = ${mileage},
        mot_expiry_date = ${mot_expiry_date}::DATE,
        road_tax_expiry_date = ${road_tax_expiry_date}::DATE,
        renewal_expiry_date = ${renewal_expiry_date}::DATE,
        company = ${company},
        weekly_rent = ${weekly_rent},
        type = ${vehicle_type}
      WHERE id = ${id}
      RETURNING id
    `;

    if (vehicleResult.length === 0) {
      return null; // vehicle not found
    }

    // Replace council plates (delete old → insert new)
    await sql`
      DELETE FROM council_plates WHERE vehicle_id = ${id}
    `;

    // Insert new council plates
    for (const plate of council_plates) {
      await sql`
        INSERT INTO council_plates (vehicle_id, city, plate_number, renewal_date)
        VALUES (${id}, ${plate.city}, ${plate.plate_number.toUpperCase()}, ${plate.renewal_date}::DATE)
      `;
    }

    // Return the updated record
    return await getVehicleById(id);
  } catch (err) {
    console.error("Error updating vehicle:", err);
    throw new Error("Error updating vehicle: " + err.message);
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
    renewal_expiry_date,
    council_plates,
    company,
    weekly_rent,
    vehicle_type,
  } = vehicleData;

  const uppercaseModel = model.toUpperCase();

  try {
    // Insert the vehicle
    const vehicleResult = await sql`
      INSERT INTO vehicles (
        vrm,
        make,
        model,
        mileage,
        mot_expiry_date,
        road_tax_expiry_date,
        renewal_expiry_date,
        company,
        weekly_rent,
        type
      ) VALUES (
        ${vrm},
        ${make},
        ${uppercaseModel},
        ${mileage},
        ${mot_expiry_date}::DATE,
        ${road_tax_expiry_date}::DATE,
        ${renewal_expiry_date}::DATE,
        ${company},
        ${weekly_rent},
        ${vehicle_type}
      )
      RETURNING id
    `;

    const vehicleId = vehicleResult[0].id;

    // Insert council plates
    for (const plate of council_plates) {
      await sql`
        INSERT INTO council_plates (vehicle_id, city, plate_number, renewal_date)
        VALUES (${vehicleId}, ${plate.city}, ${plate.plate_number.toUpperCase()}, ${plate.renewal_date}::DATE)
      `;
    }

    return { id: vehicleId, success: true };
  } catch (err) {
    console.error("Error adding vehicle with plates:", err);
    throw new Error("Error adding vehicle with plates: " + err.message);
  }
}

export async function updateMaintenanceById(id, status) {
  try {
    const results =
      status == "Available"
        ? await sql`UPDATE vehicles SET status = 'Maintenance' WHERE id = ${id} AND status = ${status}`
        : await sql`UPDATE vehicles SET status = 'Available' WHERE id = ${id} AND status = ${status}`;

    return results;
  } catch (err) {
    console.error("Error updating vehicle status:", err);
    throw new Error("Error updating vehicle status: " + err.message);
  }
}

export async function deleteVehicleById(id) {
  try {
    const deletedVehicle = await sql`DELETE FROM vehicles WHERE id = ${id}`;
    return deletedVehicle;
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    throw new Error("Error deleting vehicle: " + err.message);
  }
}

export async function getVehicleNotifications() {
  const notifications = {};
  try {
    notifications.mot = await checkVehicleMOT();
    notifications.tax = await checkVehicleTax();
    notifications.renewal = await checkVehicleRenewal();
    notifications.plate = await checkVehiclePlates();
    console.log(notifications);
    return notifications;
  } catch (err) {
    console.error("Error getting vehicle notifications:", err);
    throw new Error("Error getting vehicle notifications: " + err.message);
  }
}

export async function checkVehicleMOT() {
  try {
    const results =
      await sql`SELECT id, vrm, mot_expiry_date from vehicles WHERE mot_expiry_date <= CURRENT_DATE + 31`;
    return results;
  } catch (err) {
    console.error("Error checking vehicle MOT:", err);
    throw new Error("Error checking vehicle MOT: " + err.message);
  }
}

export async function checkVehicleTax() {
  try {
    const results =
      await sql`SELECT id, vrm, road_tax_expiry_date from vehicles WHERE road_tax_expiry_date <= CURRENT_DATE + 31`;
    return results;
  } catch (err) {
    console.error("Error checking vehicle tax:", err);
    throw new Error("Error checking vehicle tax: " + err.message);
  }
}

export async function checkVehicleRenewal() {
  try {
    const results =
      await sql`SELECT id, vrm, renewal_expiry_date from vehicles WHERE renewal_expiry_date <= CURRENT_DATE + 31`;
    return results;
  } catch (err) {
    console.error("Error checking vehicle renewal:", err);
    throw new Error("Error checking vehicle renewal: " + err.message);
  }
}

export async function checkVehiclePlates() {
  try {
    const results =
      await sql`SELECT v.id, v.vrm, c.city, c.renewal_date FROM vehicles v JOIN council_plates c ON v.id = c.vehicle_id WHERE c.renewal_date <= CURRENT_DATE + 31`;
    return results;
  } catch (err) {
    console.error("Error checking vehicle plates:", err);
    throw new Error("Error checking vehicle plates: " + err.message);
  }
}
