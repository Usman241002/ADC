import * as RentalsModel from "../models/rentals.model.js";

export async function getRentals(req, res) {
  try {
    const rentals = await RentalsModel.getAllRentals();
    res.status(200).json(rentals);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
}
