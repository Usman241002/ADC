import express from "express";
const router = express.Router();

import { checkUser } from "../controllers/users.controller.js";

export const usersRouter = router;

//POST /api/users
usersRouter.post("/", checkUser);
