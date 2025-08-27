import * as VehicleModel from "../models/vehicle.model.js";

export async function getVehicles(req, res) {
  try {
    const vehicles = await VehicleModel.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
}

export async function addVehicle(req, res) {
  try {
    const vehicleData = req.body;
    const newVehicle = VehicleModel.addVehicleDetails(vehicleData);
    res.status(200).json(newVehicle);
  } catch (err) {
    console.error("Error adding vehicle:", err);
    res.status(500).json({ error: "Failed to add vehicle" });
  }
}

export async function vehicleLookup(req, res) {
  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber) {
      return res.status(400).json({
        message: "Registration number is required",
      });
    }

    const cleanVRM = registrationNumber.replace(/\s/g, "").toUpperCase();
    if (cleanVRM.length < 2 || cleanVRM.length > 8) {
      return res.status(400).json({
        message: "Invalid registration number format",
      });
    }

    const response = await fetch(process.env.DVLA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.DVLA_API_KEY,
      },
      body: JSON.stringify({
        registrationNumber: cleanVRM,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }
      throw new Error(`DVLA API error: ${response.status}`);
    }

    const data = await response.json();

    // Return sanitized data
    res.json({
      success: true,
      data: {
        make: data.make,
        motExpiryDate: data.motExpiryDate,
        taxDueDate: data.taxDueDate,
      },
    });
  } catch (error) {
    console.error("DVLA API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
