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

export async function getPayment(req, res) {
  try {
    const payment = await PaymentsModel.getPaymentById(req.params.payment_id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
}

export async function updatePayment(req, res) {
  try {
    const updatedPayment = await PaymentsModel.updatePaymentById(
      req.params.payment_id,
      req.body,
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ error: "Failed to update payment" });
  }
}
