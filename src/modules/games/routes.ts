import { Router } from "express";
import gameController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const gameRouter = Router();

// R - Get all games by filters
gameRouter.get("/", gameController.getAllGames);

// R - Search for games by their title
gameRouter.get("/search", gameController.searchGames);

// R - Read one
gameRouter.get("/:id", gameController.getGameByID);

export default gameRouter;
