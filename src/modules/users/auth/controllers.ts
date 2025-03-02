import authService from "./services.js";
import { Controller } from "../../../types/controllers.js";

// @desc    Create user and send verification email
// @route   POST /auth/users/register
// @access  PUBLIC
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

// @desc    Verify user using OTP, activate account with verified status, and send
//          access token and refresh token
// @route   POST /auth/users/verify
// @access  PUBLIC
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

// @desc    Login user and send access token and refresh token
// @route   POST /auth/users/login
// @access  PUBLIC
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

// @desc    Logout user by clearing refresh token from redis
// @route   POST /auth/users/logout
// @access  PRIVATE
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

// @desc    Refresh user access token using refresh token and set new refresh token
// @route   POST /auth/users/refresh-token
// @access  PRIVATE
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

// @desc    Send password reset instructions to user email
// @route   POST /auth/users/forgot-password
// @access  PUBLIC
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

// @desc    Verify an OTP and send back a reset token
// @route   POST /auth/users/verify-otp
// @access  PUBLIC
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

// @desc    Reset user password using OTP
// @route   POST /auth/users/reset-password
// @access  PUBLIC
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

// @desc    Update user password
// @route   POST /auth/users/update-password
// @access  PRIVATE
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

// @desc    Request email update
// @route   POST /auth/users/update-email
// @access  PRIVATE
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

// @desc    Verify using OTP and replace email
// @route   POST /auth/users/replace-email
// @access  PRIVATE
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

// @desc    Request account deactivation
// @route   POST /auth/users/request-account-deactivation
// @access  PRIVATE
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

// @desc    Deactivate account using OTP
// @route   POST /auth/users/deactivate-account
// @access  PRIVATE
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

// @desc    Request account reactivation
// @route   POST /auth/users/request-account-reactivation
// @access  PUBLIC
const requestAccountReactivation: Controller = async (req, res, next) => {
    try {
        const { email } = req.body;

        const { user, otp } =
            await authService.requestAccountReactivation(email);

        console.log("User requested account reactivation", user);
        console.log("OTP sent", otp);

        res.status(200).json({
            message: "Account reactivation requested successfully.",
            data: { user, otp },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reactivate account using OTP
// @route   POST /auth/users/reactivate-account
// @access  PUBLIC
const reactivateAccount: Controller = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const user = await authService.reactivateAccount(otp);

        console.log("User reactivated account", user);

        res.status(200).json({
            message: "Account reactivated successfully.",
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
    requestAccountReactivation,
    reactivateAccount,
};
