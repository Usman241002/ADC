import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { vehiclesRouter } from "./routes/vehicles.route.js";
import { usersRouter } from "./routes/users.route.js";
import { rentalsRouter } from "./routes/rentals.route.js";
import { clientsRouter } from "./routes/clients.route.js";
import { paymentsRouter } from "./routes/payments.route.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/rentals", rentalsRouter);
app.use("/api/payments", paymentsRouter);

// Use environment variable for port with fallback
const PORT = 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
