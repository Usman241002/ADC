// routes/vehicle.ts
import express from "express";
import {
  vehicleLookup,
  getVehicles,
  addVehicle,
} from "../controllers/vehicles.controller.js";

export const vehiclesRouter = express.Router();

//GET /api/vehicles
vehiclesRouter.get("/", getVehicles);

//POST /api/vehicles
vehiclesRouter.post("/", addVehicle);

// POST /api/vehicles/lookup
vehiclesRouter.post("/lookup", vehicleLookup);
