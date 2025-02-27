import { Router } from "express";
import gameController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const gameRouter = Router();

// C - Create
gameRouter.post("/", gameController.createGames);

// R - Read all
gameRouter.get("/", gameController.getAllGames);

// R - Read one
gameRouter.get("/:id", gameController.getGameByID);

// U - Update (partial)
gameRouter.patch("/:id", gameController.updateGame);

// D - Delete
gameRouter.delete("/:id", gameController.deleteGame);

export default gameRouter;
