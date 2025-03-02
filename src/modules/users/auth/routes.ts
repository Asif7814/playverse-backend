import { Router } from "express";

import authUserController from "./controllers.js";

const authUserRouter = Router();

authUserRouter.post("/register", authUserController.registerUser);

authUserRouter.post("/verify", authUserController.verifyUser);

authUserRouter.post("/login", authUserController.loginUser);

authUserRouter.post("/logout", authUserController.logoutUser);

export default authUserRouter;
