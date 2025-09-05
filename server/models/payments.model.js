import { pool } from "../db/db.js";

export async function getDuePayments() {
  try {
    const query =
      "SELECT p.payment_id, c.first_name, c.last_name, v.vrm, v.make, v.model,  p.start_date,	p.end_date, p.week_no,	p.due_date, p.amount_due, p.status FROM payments p JOIN rentals r ON p.rental_id = r.rental_id JOIN clients c ON r.client_id = c.id JOIN vehicles v ON r.vehicle_id = v.id WHERE ((p.status = 'Pending' OR p.status = 'Overdue') AND p.due_date <= CURRENT_DATE) OR (p.week_no = 0) OR (p.status = 'Paid' AND date_trunc('week', p.due_date) = date_trunc('week', CURRENT_DATE))";
    const results = await pool.query(query);
    return results.rows;
  } catch (err) {
    console.error("Error fetching due payments:", err);
    throw new Error("Failed to fetch due payments");
  }
}

export async function getPaymentById(payment_id) {
  const query =
    "SELECT p.payment_id, p.rental_id, p.week_no, p.start_date, p.end_date, p.payment_method, p.due_date, p.amount_due, p.amount_paid, p.payment_date, p.is_surcharge, p.original_payment_id, p.status, c.first_name, c.last_name, c.phone_number, v.vrm, v.make, v.model FROM payments p JOIN rentals r ON p.rental_id = r.rental_id JOIN clients c ON r.client_id = c.id JOIN vehicles v ON r.vehicle_id = v.id WHERE payment_id = $1";
  try {
    const values = [payment_id];
    const results = await pool.query(query, values);
    return results.rows[0];
  } catch (err) {
    console.error("Error fetching payment by ID:", err);
    throw new Error("Failed to fetch payment by ID");
  }
}

export async function updatePaymentById(payment_id, paymentData) {
  const { method, amount, status, date } = paymentData;
  const query = `
    UPDATE payments
    SET payment_method = $1,
        amount_paid = $2,
        status = $3,
        payment_date = $4
    WHERE payment_id = $5
    RETURNING *;
  `;

  try {
    const values = [method, amount, status, date, payment_id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error(`Payment with ID ${payment_id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating payment by ID:", err);
    throw new Error("Failed to update payment by ID");
  }
}
