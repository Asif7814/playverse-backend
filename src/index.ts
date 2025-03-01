// Import statements
import express, { Request, Response } from "express";
import cors from "cors";
import sanitizeMongo from "express-mongo-sanitize";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import sanitizeBody from "./middlewares/sanitizeBody.js";

import authProfileRouter from "./modules/profiles/auth/routes.js";
import profileRouter from "./modules/profiles/routes.js";
import gameRouter from "./modules/games/routes.js";
import userGameRouter from "./modules/userGames/routes.js";

import errorHandler from "./utils/errors.js";

const app = express();

connectDB();

// MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(sanitizeMongo());
app.use(sanitizeBody);

// BASIC ROUTE
app.get("/", (_req: Request, res: Response) => {
    res.send("Server running 🚀🚀🚀");
});

// ROUTES
app.use("/auth/profiles", authProfileRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/games", gameRouter);
app.use("/api/userGames", userGameRouter);

app.use(errorHandler);

// Server setup
const PORT: number = parseInt(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
