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

    let newRentalStatus = rental.status;
    let newVehicleStatus = null;

    // Determine the correct rental status based on dates
    if (end < today) {
      // Rental has ended
      newRentalStatus = "Completed";
      newVehicleStatus = "Available";
    } else if (start <= today && today <= end) {
      // Rental is currently active (today is within rental period)
      newRentalStatus = "Active";
      newVehicleStatus = "Reserved";
    } else if (start > today) {
      // Rental hasn't started yet
      newRentalStatus = "Inactive";
      newVehicleStatus = "Available";
    }

    // Only update if status actually changed
    if (newRentalStatus !== rental.status) {
      await sql`
        UPDATE rentals
        SET status = ${newRentalStatus}
        WHERE rental_id = ${rental_id}
      `;

      if (newVehicleStatus) {
        await sql`
          UPDATE vehicles
          SET status = ${newVehicleStatus}
          WHERE id = ${rental.vehicle_id}
        `;
      }
    }

    return {
      success: true,
      rental_id,
      old_status: rental.status,
      new_status: newRentalStatus,
    };
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

    // 3. Get existing payments to determine what to keep/regenerate
    const existingPayments = await sql`
      SELECT week_no, status, start_date, end_date, amount_due
      FROM payments
      WHERE rental_id = ${rental_id}
      ORDER BY week_no
    `;

    // 4. Get vehicle info for calculations
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

    // 5. Handle deposit (week 0) - only if it doesn't exist or is pending
    const depositPayment = existingPayments.find((p) => p.week_no === 0);

    if (!depositPayment) {
      // No deposit exists, create one
      const startDateObj = new Date(start_date);
      const depositDueDate = new Date(startDateObj);
      depositDueDate.setDate(startDateObj.getDate() + 3);

      await sql`
        INSERT INTO payments (
          rental_id, week_no, start_date, end_date,
          due_date, amount_due, status
        ) VALUES (${rental_id}, 0, ${start_date}, ${start_date}, ${depositDueDate.toISOString().split("T")[0]}, ${depositAmount}, 'Pending')
      `;
    } else if (depositPayment.status === "Pending") {
      // Update existing pending deposit if amount changed
      const startDateObj = new Date(start_date);
      const depositDueDate = new Date(startDateObj);
      depositDueDate.setDate(startDateObj.getDate() + 3);

      await sql`
        UPDATE payments
        SET start_date = ${start_date},
            end_date = ${start_date},
            due_date = ${depositDueDate.toISOString().split("T")[0]},
            amount_due = ${depositAmount}
        WHERE rental_id = ${rental_id} AND week_no = 0
      `;
    }
    // If deposit is paid, leave it alone

    // 6. Delete only pending weekly payments (week_no > 0)
    await sql`
      DELETE FROM payments
      WHERE rental_id = ${rental_id}
        AND week_no > 0
        AND status = 'Pending'
    `;

    // 7. Find the highest paid week number to determine where to start regenerating
    const paidPayments = existingPayments.filter(
      (p) => p.status === "Paid" && p.week_no > 0,
    );
    const lastPaidWeek =
      paidPayments.length > 0
        ? Math.max(...paidPayments.map((p) => p.week_no))
        : 0;

    // 8. Generate weekly payments starting from the week after the last paid week
    const startWeekNo = lastPaidWeek + 1;

    // Calculate the start date for new payments
    let paymentStartDate;
    if (lastPaidWeek === 0) {
      // No paid weekly payments, start from rental start date
      paymentStartDate = start_date;
    } else {
      // Find the end date of the last paid payment and start the day after
      const lastPaidPayment = paidPayments.find(
        (p) => p.week_no === lastPaidWeek,
      );
      if (lastPaidPayment) {
        const lastPaidEndDate = new Date(lastPaidPayment.end_date);
        lastPaidEndDate.setDate(lastPaidEndDate.getDate() + 1);
        paymentStartDate = lastPaidEndDate.toISOString().split("T")[0];
      } else {
        paymentStartDate = start_date;
      }
    }

    // Only generate payments if there's time remaining in the rental
    const paymentStart = new Date(paymentStartDate);
    const rentalEnd = new Date(end_date);

    if (paymentStart <= rentalEnd) {
      await generateWeeklyPayments(
        rental_id,
        paymentStartDate,
        end_date,
        dailyRate,
        startWeekNo,
      );
    }

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

export async function updateAllRentals() {
  try {
    const updatableRentals = await sql`SELECT rental_id
          FROM rentals
          WHERE status IN ('Active', 'Inactive')`;

    for (const rental of updatableRentals) {
      const result = await updateRentalStatus(rental.rental_id);
    }
  } catch (error) {
    console.error("Error updating all rentals:", error);
    throw error;
  }
}
