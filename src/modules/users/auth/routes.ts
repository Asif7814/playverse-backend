import { Router } from "express";

import authUserController from "./controllers.js";
import protect from "../../../middlewares/authMiddleware.js";

const authUserRouter = Router();

// User Authentication - Register
authUserRouter.post("/register", authUserController.registerUser);

// User Authentication - Verify
authUserRouter.post("/verify", authUserController.verifyUser);

// User Authentication - Login
authUserRouter.post("/login", authUserController.loginUser);

// User Authentication - Logout
authUserRouter.post("/logout", authUserController.logoutUser);

// User Authentication - Refresh Token
authUserRouter.post("/refresh-token", authUserController.refreshToken);

// User Authentication - Forgot Password
authUserRouter.post("/forgot-password", authUserController.forgotPassword);

// User Authentication - Verify OTP
authUserRouter.post("/verify-otp", authUserController.verifyOTP);

// User Authentication - Reset Password
authUserRouter.post("/reset-password", authUserController.resetPassword);

// User Authentication - Update Password
authUserRouter.post(
    "/update-password",
    protect,
    authUserController.updatePassword,
);

// User Authentication - Update Email
authUserRouter.post("/update-email", protect, authUserController.updateEmail);

// User Authentication - Replace Email
authUserRouter.post("/replace-email", protect, authUserController.replaceEmail);

// User Authentication - Update Profile
authUserRouter.post(
    "/request-account-deactivation",
    protect,
    authUserController.requestAccountDeactivation,
);

// User Authentication - Deactivate Account
authUserRouter.post(
    "/deactivate-account",
    protect,
    authUserController.deactivateAccount,
);

// User Authentication - Request Account Reactivation
authUserRouter.post(
    "/request-account-reactivation",
    authUserController.requestAccountReactivation,
);

// User Authentication - Reactivate Account
authUserRouter.post(
    "/reactivate-account",
    authUserController.reactivateAccount,
);

export default authUserRouter;
