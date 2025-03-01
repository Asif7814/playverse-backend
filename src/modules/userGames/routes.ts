import { Router } from "express";
import userGameController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const userGameRouter = Router();

// C - Create
userGameRouter.post("/", userGameController.createUserGame);

// R - Read all
userGameRouter.get("/", userGameController.getAllUserGames);

// R - Read all with search query
userGameRouter.get("/search", userGameController.searchUserGames);

// R - Read one
userGameRouter.get("/:id", userGameController.getUserGameByID);

// U - Update (partial)
userGameRouter.patch("/:id", userGameController.updateUserGame);

// D - Delete
userGameRouter.delete("/:id", userGameController.deleteUserGame);

export default userGameRouter;
