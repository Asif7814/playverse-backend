import { Router } from "express";
import userController from "./controllers.js";
// import { protect } from "../../middlewares/authMiddleware.js";

const userRouter = Router();

// R - Read all
userRouter.get("/", userController.getAllUsers);

// R - Read one
userRouter.get("/:id", userController.getUserByID);

// U - Update (partial)
userRouter.patch("/:id", userController.updateUser);

export default userRouter;
