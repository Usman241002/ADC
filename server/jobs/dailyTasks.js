import cron from "node-cron";
import { updateAllRentals } from "../models/rentals.model.js";
import { applySurcharges } from "../models/payments.model.js";
import { getVehicleNotifications } from "../models/vehicle.model.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily job at midnight...");
  try {
    await updateAllRentals();
    await applySurcharges();
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
