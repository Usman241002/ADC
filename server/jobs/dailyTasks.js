import cron from "node-cron";
import { updateAllRentals } from "../models/rentals.model.js";
import { applySurcharges } from "../models/payments.model.js";
import { findDueInvoices } from "../utils/email.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily job at 7:00am...");
  try {
    await updateAllRentals();
    await applySurcharges();
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});

cron.schedule("0 7 * * *", async () => {
  console.log("Running daily job at 7:00am...");
  try {
    await findDueInvoices();
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
