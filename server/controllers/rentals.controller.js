import * as RentalsModel from "../models/rentals.model.js";

export async function getRentals(req, res) {
  try {
    const rentals = await RentalsModel.getAllRentals();
    res.status(200).json(rentals);
  } catch (err) {
    console.error("Error fetching rentals:", err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
}

export async function addRental(req, res) {
  try {
    const rentalData = req.body;
    const newRental = RentalsModel.createRental(rentalData);
    res.status(200).json(newRental);
  } catch (err) {
    console.error("Error adding rental:", err);
    res.status(500).json({ error: "Failed to add rental" });
  }
}

export async function getAvailableVehicles(req, res) {
  try {
    const availableVehicles = await RentalsModel.getAllAvailableVehicles();
    res.status(200).json(availableVehicles);
  } catch (err) {
    r("Error fetching available vehicles:", err);
    res.status(500).json({ error: "Failed to fetch available vehicles" });
  }
}
