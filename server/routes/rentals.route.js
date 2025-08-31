import express from "express";
const router = express.Router();

import {
  getRentals,
  addRental,
  getAvailableVehicles,
} from "../controllers/rentals.controller.js";

export const rentalsRouter = router;

//GET /api/rentals
rentalsRouter.get("/", getRentals);

//POST /api/rentals
rentalsRouter.post("/", addRental);

//GET /api/rentals/availableVehicles
rentalsRouter.get("/availableVehicles", getAvailableVehicles);
