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

export async function getRental(req, res) {
  try {
    const rental_id = req.params.rental_id;
    const rental = await RentalsModel.getRentalById(rental_id);
    res.status(200).json(rental);
  } catch (err) {
    console.error("Error fetching rental:", err);
    res.status(500).json({ error: "Failed to fetch rental" });
  }
}

export async function updateRental(req, res) {
  try {
    const rental_id = req.params.rental_id;
    const data = req.body;
    const updatedRental = await RentalsModel.updateRentalById(rental_id, data);
    res.status(200).json(updatedRental);
  } catch (err) {
    console.error("Error updating rental:", err);
    res.status(500).json({ error: "Failed to update rental" });
  }
}

export async function getAvailableVehicles(req, res) {
  try {
    const availableVehicles = await RentalsModel.getAllAvailableVehicles();
    res.status(200).json(availableVehicles);
  } catch (err) {
    ("Error fetching available vehicles:", err);
    res.status(500).json({ error: "Failed to fetch available vehicles" });
  }
}
