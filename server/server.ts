import express from "express";
import cors from "cors";

import vehiclesRouter from "./routes/vehicles";
import usersRouter from "./routes/users";
import rentalsRouter from "./routes/rentals";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehiclesRouter);
app.use("/api/users", usersRouter);
app.use("/api/rentals", rentalsRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
