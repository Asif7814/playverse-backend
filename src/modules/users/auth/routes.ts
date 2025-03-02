import { Router } from "express";

import authUserController from "./controllers.js";

const authUserRouter = Router();

authUserRouter.post("/register", authUserController.registerUser);

authUserRouter.post("/verify", authUserController.verifyUser);

authUserRouter.post("/login", authUserController.loginUser);

authUserRouter.post("/logout", authUserController.logoutUser);

authUserRouter.post("/refresh-token", authUserController.refreshToken);

authUserRouter.post("/forgot-password", authUserController.forgotPassword);

authUserRouter.post("/verify-otp", authUserController.verifyOTP);

authUserRouter.post("/reset-password", authUserController.resetPassword);

export default authUserRouter;
