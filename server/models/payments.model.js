import sql from "../db/db.js";

export async function getDuePayments() {
  try {
    const results = await sql`
      SELECT
        p.payment_id,
        c.first_name,
        c.last_name,
        v.vrm,
        v.make,
        v.model,
        p.start_date,
        p.end_date,
        p.week_no,
        p.due_date,
        p.amount_due,
        p.status,
        p.is_surcharge
      FROM payments p
      JOIN rentals r ON p.rental_id = r.rental_id
      JOIN clients c ON r.client_id = c.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE ((p.status = 'Pending' OR p.status = 'Overdue') AND p.due_date <= CURRENT_DATE)
        OR (p.week_no = 0 AND (p.status = 'Pending' OR p.status = 'Overdue'))
        OR (p.status = 'Paid' AND date_trunc('week', p.due_date) = date_trunc('week', CURRENT_DATE))
    `;
    return results;
  } catch (err) {
    console.error("Error fetching due payments:", err);
    throw new Error("Failed to fetch due payments");
  }
}

export async function getPaymentById(payment_id) {
  try {
    const results = await sql`
      SELECT
        p.payment_id,
        p.rental_id,
        p.week_no,
        p.start_date,
        p.end_date,
        p.payment_method,
        p.due_date,
        p.amount_due,
        p.amount_paid,
        p.payment_date,
        p.is_surcharge,
        p.original_payment_id,
        p.status,
        c.first_name,
        c.last_name,
        c.phone_number,
        v.vrm,
        v.make,
        v.model
      FROM payments p
      JOIN rentals r ON p.rental_id = r.rental_id
      JOIN clients c ON r.client_id = c.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE payment_id = ${payment_id}
    `;
    return results[0];
  } catch (err) {
    console.error("Error fetching payment by ID:", err);
    throw new Error("Failed to fetch payment by ID");
  }
}

export async function updatePaymentById(payment_id, paymentData) {
  const { method, amount, status, date } = paymentData;
  try {
    const result = await sql`
      UPDATE payments
      SET payment_method = ${method},
          amount_paid = ${amount},
          status = ${status},
          payment_date = ${date}
      WHERE payment_id = ${payment_id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Payment with ID ${payment_id} not found`);
    }

    return result[0];
  } catch (err) {
    console.error("Error updating payment by ID:", err);
    throw new Error("Failed to update payment by ID");
  }
}

export async function applySurcharges() {
  try {
    const overduePayments = await sql`
      SELECT p.payment_id, p.amount_due, p.due_date, p.rental_id, p.status
      FROM payments p
      WHERE p.status = 'Pending'
      AND p.due_date <= (CURRENT_DATE - INTERVAL '2 days')
      AND p.is_surcharge = false
    `;

    for (const payment of overduePayments) {
      if (payment.status === "Pending") {
        await sql`
          UPDATE payments
          SET status = 'Overdue'
          WHERE payment_id = ${payment.payment_id}
        `;
        console.log(`Payment ${payment.payment_id} marked as Overdue`);
      }

      const weeksOverdueResult = await sql`
        SELECT FLOOR(EXTRACT(DAY FROM (CURRENT_DATE - ${payment.due_date})) / 7) + 1 AS weeks_overdue
      `;
      const weeksOverdue = weeksOverdueResult[0].weeks_overdue;

      const existingSurcharges = await sql`
        SELECT COUNT(*)::int AS count
        FROM payments
        WHERE original_payment_id = ${payment.payment_id}
        AND is_surcharge = true
      `;
      const surchargeCount = existingSurcharges[0].count;

      const surchargeAmount = 30.0;

      if (surchargeCount < weeksOverdue) {
        const toInsert = weeksOverdue - surchargeCount;

        for (let i = 0; i < toInsert; i++) {
          await sql`
            INSERT INTO payments (
              rental_id,
              week_no,
              start_date,
              end_date,
              payment_method,
              due_date,
              amount_due,
              amount_paid,
              payment_date,
              is_surcharge,
              original_payment_id,
              status
            )
            VALUES (
              ${payment.rental_id},
              0,
              CURRENT_DATE,
              CURRENT_DATE,
              'Bank Transfer',
              CURRENT_DATE,
              ${surchargeAmount},
              0,
              NULL,
              true,
              ${payment.payment_id},
              'Pending'
            )
          `;
        }
        console.log(
          `Added ${toInsert} surcharge(s) for payment ${payment.payment_id}`,
        );
      }
    }
  } catch (err) {
    console.error("Error applying surcharges:", err);
    throw new Error("Failed to apply surcharges");
  }
}
