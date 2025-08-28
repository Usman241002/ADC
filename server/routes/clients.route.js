import express from "express";
const router = express.Router();

import { addClient } from "../controllers/clients.controller.js";

export const clientsRouter = router;

//GET /api/clients
//clientsRouter.get("/", getClients);

//POST /api/clients
clientsRouter.post("/", addClient);
