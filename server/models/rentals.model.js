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
    const rentalId = rentalResult.rows[0].rental_id;

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
      rentalId,
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
      rentalId,
      start_date,
      end_date,
      dailyRate,
    );

    await client.query("COMMIT");
    return { rental_id: rentalId, success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating rental:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getRentalById(rentalId) {
  try {
    const query = `SELECT * FROM rentals WHERE rental_id = $1`;
    const result = await pool.query(rentalQuery, [rentalId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error getting rental:", error);
    throw error;
  }
}

export async function updateRentalById(rentalId, newEndDate) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get existing rental
    const rentalQuery = `SELECT * FROM rentals WHERE rental_id = $1`;
    const rentalResult = await client.query(rentalQuery, [rentalId]);

    if (rentalResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null; // rental not found
    }

    const existingRental = rentalResult.rows[0];

    // 2. Update only the end_date
    const updateQuery = `
      UPDATE rentals
      SET end_date = $1
      WHERE rental_id = $2
      RETURNING *;
    `;
    const updatedRentalResult = await client.query(updateQuery, [
      newEndDate,
      rentalId,
    ]);
    const updatedRental = updatedRentalResult.rows[0];

    // 3. Delete only future pending payments
    const today = new Date().toISOString().split("T")[0];

    await client.query(
      `DELETE FROM payments
       WHERE rental_id = $1
         AND due_date >= $2
         AND status = 'Pending'`,
      [rentalId, today],
    );

    // 4. Get the last existing week_no
    const lastWeekResult = await client.query(
      `SELECT COALESCE(MAX(week_no), 0) AS last_week_no
       FROM payments
       WHERE rental_id = $1`,
      [rentalId],
    );
    let lastWeekNo = parseInt(lastWeekResult.rows[0].last_week_no, 10) || 0;

    // 5. Get vehicle info for recalculation
    const vehicleQuery = `
      SELECT v.weekly_rent
      FROM vehicles v
      WHERE v.id = $1
    `;
    const vehicleResult = await client.query(vehicleQuery, [
      existingRental.vehicle_id,
    ]);

    if (vehicleResult.rows.length === 0) {
      throw new Error("Vehicle not found for recalculation");
    }

    const weeklyRent = parseFloat(vehicleResult.rows[0].weekly_rent);
    const dailyRate = weeklyRent / 7;

    // 6. Generate new future payments continuing from last week_no
    await generateWeeklyPayments(
      client,
      rentalId,
      today,
      newEndDate,
      dailyRate,
      lastWeekNo,
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

async function generateWeeklyPayments(
  client,
  rentalId,
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
      Math.floor((actualWeekEnd - currentWeekStart) / (1000 * 60 * 60 * 24)) +
      1;

    const proratedAmount = (dailyRate * daysInWeek).toFixed(2);

    const paymentQuery = `
      INSERT INTO payments (
        rental_id, week_no, start_date, end_date,
        due_date, amount_due, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const paymentValues = [
      rentalId,
      weekCounter,
      currentWeekStart.toISOString().split("T")[0],
      actualWeekEnd.toISOString().split("T")[0],
      currentWeekStart.toISOString().split("T")[0], // Due at start of week
      proratedAmount,
      "Pending",
    ];

    await client.query(paymentQuery, paymentValues);

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
