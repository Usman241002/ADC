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

export async function getVehicleById(req, res) {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
}

export async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ error: "Vehicle ID is required" });
    }
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Update data is required" });
    }

    const updatedVehicle = await VehicleModel.updateVehicleById(id, data);
    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(updatedVehicle);
  } catch (err) {
    console.error("Error updating vehicle:", err);
    res.status(500).json({ error: "Failed to update vehicle" });
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

export async function updateMaintenanceStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedVehicle = VehicleModel.updateMaintenanceById(id, status);
    await updatedVehicle;
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error("Error updating maintenance status:", error);
  }
}

export async function getNotifications(req, res) {
  try {
    const notifications = await VehicleModel.getVehicleNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
}
