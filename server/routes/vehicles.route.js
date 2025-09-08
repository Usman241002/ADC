// routes/vehicle.ts
import express from "express";
import {
  vehicleLookup,
  getVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  updateMaintenanceStatus,
  getNotifications,
} from "../controllers/vehicles.controller.js";

export const vehiclesRouter = express.Router();

// GET /api/vehicles
vehiclesRouter.get("/", getVehicles);

// POST /api/vehicles
vehiclesRouter.post("/", addVehicle);

// POST /api/vehicles/lookup
vehiclesRouter.post("/lookup", vehicleLookup);

// PUT /api/vehicles/maintenance/:id
vehiclesRouter.put("/maintenance/:id", updateMaintenanceStatus);

// GET /api/vehicles/notifications
vehiclesRouter.get("/notifications", getNotifications);

// GET /api/vehicles/:id
vehiclesRouter.get("/:id", getVehicleById);

// PUT /api/vehicles/:id
vehiclesRouter.put("/:id", updateVehicle);
