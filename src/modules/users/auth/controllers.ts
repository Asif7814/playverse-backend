import authService from "./services.js";
import { Controller } from "../../../types/controllers.js";

const registerUser: Controller = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const { newUser, otp } = await authService.registerUser(
            username,
            email,
            password,
        );

        console.log("New user registered:", newUser);
        console.log("OTP:", otp);

        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            data: { newUser, otp },
        });
    } catch (err) {
        next(err);
    }
};

const verifyUser: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const {
            user: verifiedUser,
            accessToken,
            refreshToken,
        } = await authService.verifyUser(otp);

        console.log("User verified:", verifiedUser);
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        res.status(200).json({
            message: "User verified successfully.",
            data: { user: verifiedUser, tokens: { accessToken, refreshToken } },
        });
    } catch (err) {
        next(err);
    }
};

const loginUser: Controller = async (req, res, next) => {
    try {
        const { email, password, potentialRefreshToken } = req.body;

        let loginData = { email, password, potentialRefreshToken: null };

        if (potentialRefreshToken) {
            loginData.potentialRefreshToken = potentialRefreshToken;
        }

        const { user, accessToken, refreshToken } =
            await authService.loginUser(loginData);

        console.log("User logged in:", user);
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        res.status(200).json({
            message: "User logged in successfully.",
            data: { user, tokens: { accessToken, refreshToken } },
        });
    } catch (err) {
        next(err);
    }
};

const logoutUser: Controller = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const user = await authService.logoutUser(refreshToken);

        console.log("User logged out:", user);

        res.status(200).json({
            message: "User logged out successfully.",
            data: { user },
        });
    } catch (err) {
        next(err);
    }
};

const refreshToken: Controller = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const { user, newAccessToken, newRefreshToken } =
            await authService.refreshToken(refreshToken);

        console.log("User token refreshed", { user });
        console.log("Access token", { accessToken: newAccessToken });
        console.log("Refresh token", { refreshToken: newRefreshToken });

        res.status(200).json({
            message: "Token refreshed successfully.",
            data: {
                user,
                tokens: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

const forgotPassword: Controller = async (req, res, next) => {
    try {
        const { email } = req.body;

        const { user, otp } = await authService.forgotPassword(email);

        console.log("User forgot password", { user });
        console.log("OTP sent", { otp });

        res.status(200).json({
            message: "Password reset instructions sent.",
            data: { user, otp },
        });
    } catch (error) {
        next(error);
    }
};

const verifyOTP: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const { user, resetToken } = await authService.verifyOTP(otp);

        console.log("OTP verified. User:", user);
        console.log("OTP verified. ResetToken:", resetToken);

        res.status(200).json({
            message: "OTP verified successfully.",
            data: { user, tokens: { resetToken } },
        });
    } catch (err) {
        next(err);
    }
};

const resetPassword: Controller = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        const user = await authService.resetPassword(resetToken, newPassword);

        console.log("User reset password:", user);

        res.status(200).json({
            message: "Password reset successfully.",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const updatePassword: Controller = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body;

        const user = await authService.updatePassword(
            id,
            oldPassword,
            newPassword,
        );

        console.log("User updated password", user);

        res.status(200).json({
            message: "Password updated successfully.",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const updateEmail: Controller = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { newEmail, password } = req.body;

        const { user, otp } = await authService.updateEmail(
            id,
            newEmail,
            password,
        );

        console.log("User requested email update", user);
        console.log("OTP sent", otp);

        res.status(200).json({
            message: "Email update requested successfully.",
            data: { user, otp },
        });
    } catch (err) {
        next(err);
    }
};

const replaceEmail: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const { user, previousEmail } = await authService.replaceEmail(otp);

        console.log("User replaced email", user.email);
        console.log("Previous email", previousEmail);

        res.status(200).json({
            message: "Email updated successfully.",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const requestAccountDeactivation: Controller = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { user, otp } = await authService.requestAccountDeactivation(id);

        console.log("User requested account deactivation", user);
        console.log("OTP sent", otp);

        res.status(200).json({
            message: "Account deactivation requested successfully.",
            data: { user, otp },
        });
    } catch (error) {
        next(error);
    }
};

const deactivateAccount: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const user = await authService.deactivateAccount(otp);

        console.log("User deactivated account", user);

        res.status(200).json({
            message: "Account deactivated successfully.",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    registerUser,
    verifyUser,
    loginUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    verifyOTP,
    resetPassword,
    updatePassword,
    updateEmail,
    replaceEmail,
    requestAccountDeactivation,
    deactivateAccount,
};
