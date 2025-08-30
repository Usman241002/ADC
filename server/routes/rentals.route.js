import express from "express";
const router = express.Router();

import { getRentals } from "../controllers/rentals.controller.js";

export const rentalsRouter = router;

//GET /api/rentals
rentalsRouter.get("/", getRentals);
