// routes/vehicle.ts
import express from "express";
import {
  vehicleLookup,
  getVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
} from "../controllers/vehicles.controller.js";

export const vehiclesRouter = express.Router();

//GET /api/vehicles
vehiclesRouter.get("/", getVehicles);

//POST /api/vehicles
vehiclesRouter.post("/", addVehicle);

//GET /api/vehicles/:id
vehiclesRouter.get("/:id", getVehicleById);

//PUT /api/vehicles/:id
vehiclesRouter.put("/:id", updateVehicle);

// POST /api/vehicles/lookup
vehiclesRouter.post("/lookup", vehicleLookup);
