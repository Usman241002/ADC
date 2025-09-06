import sql from "../db/db.js";

export async function getAllRentals() {
  try {
    const results = await sql`
      SELECT
        r.rental_id,
        r.status AS rental_status,
        r.start_date,
        r.end_date,
        v.vrm as vehicle_vrm,
        v.make AS vehicle_make,
        v.model AS vehicle_model,
        v.company,
        c.first_name AS customer_first_name,
        c.last_name AS customer_last_name,
        v.weekly_rent
      FROM rentals r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN clients c ON r.client_id = c.id
      WHERE r.status = 'Active' OR r.status = 'Inactive'
      ORDER BY r.end_date
    `;
    return results; // Remove .rows - postgres library returns array directly
  } catch (error) {
    console.error("Error fetching rentals:", error);
    throw error;
  }
}

export async function createRental(rentalData) {
  try {
    const { vehicle_id, client_id, start_date, end_date } = rentalData;

    // Insert rental and get the ID
    const rentalResult = await sql`
      INSERT INTO rentals(vehicle_id, client_id, start_date, end_date)
      VALUES (${vehicle_id}, ${client_id}, ${start_date}, ${end_date})
      RETURNING rental_id
    `;
    const rental_id = rentalResult[0].rental_id;

    // Get vehicle info for deposit and weekly rent
    const vehicleResult = await sql`
      SELECT v.weekly_rent, t.deposit_amount
      FROM vehicles v
      JOIN type_lookup t ON v.type = t.type_name
      WHERE v.id = ${vehicle_id}
    `;

    if (vehicleResult.length === 0) {
      throw new Error(`Vehicle with ID ${vehicle_id} not found`);
    }

    const vehicleDeposit = parseFloat(vehicleResult[0].deposit_amount);
    const weeklyRent = parseFloat(vehicleResult[0].weekly_rent);
    const dailyRate = weeklyRent / 7;

    // Insert deposit payment
    const startDate = new Date(start_date);
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + 3);

    await sql`
      INSERT INTO payments (rental_id, week_no, start_date, end_date, due_date, amount_due, status)
      VALUES (${rental_id}, 0, ${start_date}, ${start_date}, ${dueDate.toISOString().split("T")[0]}, ${vehicleDeposit}, 'Pending')
    `;

    // Generate weekly payments
    await generateWeeklyPayments(rental_id, start_date, end_date, dailyRate);

    // Update rental status
    await updateRentalStatus(rental_id);

    return { rental_id: rental_id, success: true };
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
}

export async function updateRentalStatus(rental_id) {
  try {
    const results = await sql`
      SELECT rental_id, vehicle_id, start_date, end_date, status
      FROM rentals
      WHERE rental_id = ${rental_id}
    `;

    if (results.length === 0) {
      throw new Error(`Rental with ID ${rental_id} not found`);
    }

    const rental = results[0];
    const today = new Date();
    const start = new Date(rental.start_date);
    const end = new Date(rental.end_date);

    // Normalize dates to compare only dates, not times
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // If rental ended but still Active → mark Completed
    if (end < today && rental.status === "Active") {
      await sql`
        UPDATE rentals
        SET status = 'Completed'
        WHERE rental_id = ${rental_id}
      `;
      await sql`
        UPDATE vehicles
        SET status = 'Available'
        WHERE id = ${rental.vehicle_id}
      `;
    }
    // If rental should be Active today but is still Inactive → mark Active
    else if (start <= today && end >= today && rental.status === "Inactive") {
      await sql`
        UPDATE rentals
        SET status = 'Active'
        WHERE rental_id = ${rental_id}
      `;
      await sql`
        UPDATE vehicles
        SET status = 'Reserved'
        WHERE id = ${rental.vehicle_id}
      `;
    }
    // If rental hasn't started yet → mark as Inactive
    else if (start > today && rental.status !== "Inactive") {
      await sql`
        UPDATE rentals
        SET status = 'Inactive'
        WHERE rental_id = ${rental_id}
      `;
      await sql`
        UPDATE vehicles
        SET status = 'Available'
        WHERE id = ${rental.vehicle_id}
      `;
    }

    return { success: true, rental_id };
  } catch (error) {
    console.error("Error updating rental status:", error);
    throw error;
  }
}

export async function getRentalById(rental_id) {
  try {
    const result = await sql`
      SELECT vehicle_id, client_id, start_date, end_date
      FROM rentals
      WHERE rental_id = ${rental_id}
    `;

    if (result.length === 0) {
      console.log("Rental not found");
      return null;
    }

    console.log("Rental found");
    return result[0];
  } catch (error) {
    console.error("Error getting rental:", error);
    throw error;
  }
}

export async function updateRentalById(rental_id, data) {
  try {
    // 1. Get existing rental
    const rentalResult = await sql`
      SELECT * FROM rentals WHERE rental_id = ${rental_id}
    `;

    if (rentalResult.length === 0) {
      return null;
    }

    const existingRental = rentalResult[0];

    // 2. Update rental fields
    const { vehicle_id, client_id, start_date, end_date } = data;
    const updatedRentalResult = await sql`
      UPDATE rentals
      SET vehicle_id = ${vehicle_id},
          client_id = ${client_id},
          start_date = ${start_date},
          end_date = ${end_date}
      WHERE rental_id = ${rental_id}
      RETURNING *
    `;
    const updatedRental = updatedRentalResult[0];

    // 3. Delete ALL existing pending payments for this rental (including deposit)
    await sql`
      DELETE FROM payments
      WHERE rental_id = ${rental_id}
        AND status = 'Pending'
    `;

    // 4. Get vehicle info for deposit and weekly payments
    const vehicleResult = await sql`
      SELECT v.weekly_rent, t.deposit_amount
      FROM vehicles v
      JOIN type_lookup t ON v.type = t.type_name
      WHERE v.id = ${vehicle_id}
    `;

    if (vehicleResult.length === 0) {
      throw new Error("Vehicle not found for recalculation");
    }

    const weeklyRent = parseFloat(vehicleResult[0].weekly_rent);
    const dailyRate = weeklyRent / 7;
    const depositAmount = parseFloat(vehicleResult[0].deposit_amount);

    // 5. Insert deposit as week 0
    const startDateObj = new Date(start_date);
    const depositDueDate = new Date(startDateObj);
    depositDueDate.setDate(startDateObj.getDate() + 3);

    await sql`
      INSERT INTO payments (
        rental_id, week_no, start_date, end_date,
        due_date, amount_due, status
      ) VALUES (${rental_id}, 0, ${start_date}, ${start_date}, ${depositDueDate.toISOString().split("T")[0]}, ${depositAmount}, 'Pending')
    `;

    // 6. Generate weekly payments starting from start_date, week 1
    await generateWeeklyPayments(rental_id, start_date, end_date, dailyRate, 1);

    await updateRentalStatus(rental_id);
    return updatedRental;
  } catch (error) {
    console.error("Error updating rental:", error);
    throw error;
  }
}

// Weekly payments generator (starts at given week number, e.g., 1)
async function generateWeeklyPayments(
  rental_id,
  startDate,
  endDate,
  dailyRate,
  startWeekNo = 1,
) {
  try {
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

      const proratedAmount = parseFloat((dailyRate * daysInWeek).toFixed(2));

      await sql`
        INSERT INTO payments (
          rental_id, week_no, start_date, end_date,
          due_date, amount_due, status
        ) VALUES (
          ${rental_id},
          ${weekCounter},
          ${currentWeekStart.toISOString().split("T")[0]},
          ${actualWeekEnd.toISOString().split("T")[0]},
          ${currentWeekStart.toISOString().split("T")[0]},
          ${proratedAmount},
          'Pending'
        )
      `;

      // Move to next week
      currentWeekStart = new Date(actualWeekEnd);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
      weekCounter++;
    }
  } catch (error) {
    console.error("Error generating weekly payments:", error);
    throw error;
  }
}

export async function getAllAvailableVehicles() {
  try {
    const results = await sql`
      SELECT
        v.id,
        v.vrm,
        v.make,
        v.model,
        v.mileage,
        v.company,
        v.weekly_rent,
        v.status,
        v.type,
        t.deposit_amount
      FROM vehicles v
      JOIN type_lookup t ON v.type = t.type_name
      WHERE v.status = 'Available'
      ORDER BY v.weekly_rent DESC
    `;

    return results;
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    throw error;
  }
}
