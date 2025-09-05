import express from "express";
const router = express.Router();

import {
  getPayments,
  getPayment,
  updatePayment,
} from "../controllers/payments.controller.js";

export const paymentsRouter = router;

//GET /api/payments
paymentsRouter.get("/", getPayments);

//GET /api/payments/:payment_id
paymentsRouter.get("/:payment_id", getPayment);

//PUT /api.payments/:payment_id
paymentsRouter.put("/:payment_id", updatePayment);
