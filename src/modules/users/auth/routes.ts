import { Router } from "express";

import authUserController from "./controllers.js";

const authUserRouter = Router();

authUserRouter.post("/register", authUserController.registerUser);

authUserRouter.post("/verify", authUserController.verifyUser);

export default authUserRouter;
