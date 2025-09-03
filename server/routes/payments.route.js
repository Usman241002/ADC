import express from "express";
const router = express.Router();

import { getPayments } from "../controllers/payments.controller.js";

export const paymentsRouter = router;

//GET /api/payments
paymentsRouter.get("/", getPayments);

/*
//POST /api/payments
paymentsRouter.post("/", addPayment);
*/
