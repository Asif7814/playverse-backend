import { Router } from "express";

import authUserController from "./controllers.js";

const authUserRouter = Router();

authUserRouter.post("/register", authUserController.registerUser);

export default authUserRouter;
