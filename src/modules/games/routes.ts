import { Router } from "express";
import gameController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const gameRouter = Router();

// R - Read all
gameRouter.get("/", gameController.searchGames);

// R - Read one
gameRouter.get("/:id", gameController.getGameByID);

export default gameRouter;
