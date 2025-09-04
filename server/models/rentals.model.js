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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { vehicle_id, client_id, start_date, end_date } = rentalData;

    const rentalQuery = `
          INSERT INTO rentals(vehicle_id, client_id, start_date, end_date)
          VALUES ($1, $2, $3, $4)
          RETURNING rental_id
        `;
    const rentalValues = [vehicle_id, client_id, start_date, end_date];
    const rentalResult = await client.query(rentalQuery, rentalValues);
    const rental_id = rentalResult.rows[0].rental_id;

    const vehicleQuery =
      "SELECT v.weekly_rent, t.deposit_amount FROM vehicles v JOIN type_lookup t ON v.type = t.type_name WHERE v.id = $1";
    const vehicleResult = await client.query(vehicleQuery, [vehicle_id]);
    const vehicleDeposit = parseFloat(vehicleResult.rows[0].deposit_amount);
    const weeklyRent = parseFloat(vehicleResult.rows[0].weekly_rent);
    const dailyRate = weeklyRent / 7;

    const depositQuery =
      "INSERT INTO payments (rental_id, week_no, start_date, end_date, due_date, amount_due, status) VALUES ($1, $2, $3, $4, $5, $6, $7)";

    const startDate = new Date(start_date);
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + 3);

    const depositValues = [
      rental_id,
      0,
      start_date,
      start_date,
      dueDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      vehicleDeposit,
      "Pending",
    ];

    await client.query(depositQuery, depositValues);

    await generateWeeklyPayments(
      client,
      rental_id,
      start_date,
      end_date,
      dailyRate,
    );

    await client.query("COMMIT");
    return { rental_id: rental_id, success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating rental:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getRentalById(rental_id) {
  try {
    const query = `SELECT vehicle_id, client_id, start_date, end_date FROM rentals WHERE rental_id = $1`;
    const result = await pool.query(query, [rental_id]);

    if (result.rows.length === 0) {
      return null;
      console.log("Rental not found");
    }
    console.log("found");
    return result.rows[0];
  } catch (error) {
    console.error("Error getting rental:", error);
    throw error;
  }
}

export async function updateRentalById(rental_id, data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get existing rental
    const rentalQuery = `SELECT * FROM rentals WHERE rental_id = $1`;
    const rentalResult = await client.query(rentalQuery, [rental_id]);
    if (rentalResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const existingRental = rentalResult.rows[0];

    // 2. Update rental fields
    const { vehicle_id, client_id, start_date, end_date } = data;
    const updateQuery = `
      UPDATE rentals
      SET vehicle_id = $1,
          client_id = $2,
          start_date = $3,
          end_date = $4
      WHERE rental_id = $5
      RETURNING *;
    `;
    const updatedRentalResult = await client.query(updateQuery, [
      vehicle_id,
      client_id,
      start_date,
      end_date,
      rental_id,
    ]);
    const updatedRental = updatedRentalResult.rows[0];

    // 3. Delete future pending payments
    const today = new Date().toISOString().split("T")[0];
    await client.query(
      `DELETE FROM payments
       WHERE rental_id = $1
         AND due_date >= $2
         AND status = 'Pending'`,
      [rental_id, today],
    );

    // 4. Get vehicle info for deposit and weekly payments
    const vehicleQuery = `
      SELECT v.weekly_rent, t.deposit_amount
      FROM vehicles v
      JOIN type_lookup t ON v.type = t.type_name
      WHERE v.id = $1
    `;
    const vehicleResult = await client.query(vehicleQuery, [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
      throw new Error("Vehicle not found for recalculation");
    }
    const weeklyRent = parseFloat(vehicleResult.rows[0].weekly_rent);
    const dailyRate = weeklyRent / 7;
    const depositAmount = parseFloat(vehicleResult.rows[0].deposit_amount);

    // 5. Insert deposit as week 0
    const depositQuery = `
      INSERT INTO payments (
        rental_id, week_no, start_date, end_date,
        due_date, amount_due, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await client.query(depositQuery, [
      rental_id,
      0,
      start_date,
      start_date,
      start_date, // due on start date
      depositAmount,
      "Pending",
    ]);

    // 6. Generate weekly payments starting from start_date, week 1
    await generateWeeklyPayments(
      client,
      rental_id,
      start_date,
      end_date,
      dailyRate,
      1,
    );

    await client.query("COMMIT");
    return updatedRental;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating rental:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Weekly payments generator (starts at given week number, e.g., 1)
async function generateWeeklyPayments(
  client,
  rental_id,
  startDate,
  endDate,
  dailyRate,
  startWeekNo = 1,
) {
  const rentalStartDate = new Date(startDate);
  const rentalEndDate = new Date(endDate);

  let currentWeekStart = new Date(rentalStartDate);
  let weekCounter = startWeekNo;

  while (currentWeekStart <= rentalEndDate) {
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    const actualWeekEnd =
      currentWeekEnd > rentalEndDate ? rentalEndDate : currentWeekEnd;

    const daysInWeek =
      Math.round((actualWeekEnd - currentWeekStart) / (1000 * 60 * 60 * 24)) +
      1;

    const proratedAmount = (dailyRate * daysInWeek).toFixed(2);

    await client.query(
      `
        INSERT INTO payments (
          rental_id, week_no, start_date, end_date,
          due_date, amount_due, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        rental_id,
        weekCounter,
        currentWeekStart.toISOString().split("T")[0],
        actualWeekEnd.toISOString().split("T")[0],
        currentWeekStart.toISOString().split("T")[0],
        proratedAmount,
        "Pending",
      ],
    );

    // Move to next week
    currentWeekStart = new Date(actualWeekEnd);
    currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    weekCounter++;
  }
}

export async function getAllAvailableVehicles() {
  try {
    const query =
      "SELECT v.id, v.vrm, v.make, v.model, v.mileage, v.company, v.weekly_rent, v.status, v.type, t.deposit_amount FROM vehicles v JOIN type_lookup t ON v.type = t.type_name WHERE v.status = 'Available' ORDER BY v.weekly_rent DESC";

    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    throw error;
  }
}
