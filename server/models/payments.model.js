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
