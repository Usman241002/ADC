import * as PaymentsModel from "../models/payments.model.js";

export async function getPayments(req, res) {
  try {
    const payments = await PaymentsModel.getDuePayments();
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch due payments" });
  }
}
