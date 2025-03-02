import { Router } from "express";

import authUserController from "./controllers.js";
import protect from "../../../middlewares/authMiddleware.js";

const authUserRouter = Router();

authUserRouter.post("/register", authUserController.registerUser);

authUserRouter.post("/verify", authUserController.verifyUser);

authUserRouter.post("/login", authUserController.loginUser);

authUserRouter.post("/logout", authUserController.logoutUser);

authUserRouter.post("/refresh-token", authUserController.refreshToken);

authUserRouter.post("/forgot-password", authUserController.forgotPassword);

authUserRouter.post("/verify-otp", authUserController.verifyOTP);

authUserRouter.post("/reset-password", authUserController.resetPassword);

authUserRouter.post(
    "/update-password",
    protect,
    authUserController.updatePassword,
);

authUserRouter.post("/update-email", protect, authUserController.updateEmail);

authUserRouter.post("/replace-email", protect, authUserController.replaceEmail);

authUserRouter.post(
    "/request-account-deactivation",
    protect,
    authUserController.requestAccountDeactivation,
);

authUserRouter.post(
    "/deactivate-account",
    protect,
    authUserController.deactivateAccount,
);

authUserRouter.post(
    "/request-account-reactivation",
    authUserController.requestAccountReactivation,
);

export default authUserRouter;
