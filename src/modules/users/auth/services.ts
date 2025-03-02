import User, { IUser } from "../models.js";
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from "../../../utils/errors.js";
import authUtils from "../../../utils/authUtils.js";
import redisUtils from "../../../utils/redisUtils.js";
import tokenService from "../../../services/tokenService.js";

const registerUser = async (
    username: string,
    email: string,
    password: string,
) => {
    // Check if required fields are provided
    if (!username || !email || !password) {
        throw new BadRequestError("Please provide all required fields");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new BadRequestError("A user with this email already exists");
    }

    // Validate password
    authUtils.validatePassword(password);

    // Hash password
    const hashedPassword = await authUtils.hashPassword(password);

    const newUser = await User.create({
        accountStatus: "pending",
        username,
        email,
        password: hashedPassword,
    });

    if (!newUser) {
        throw new BadRequestError("We could not register you at this time");
    }

    const otp = authUtils.generateOTP();
    await redisUtils.setOTP(newUser.id, otp);

    return { newUser, otp };
};

const verifyUser = async (otp: number) => {
    const userId = await redisUtils.getOTP(otp);
    if (!userId) throw new NotFoundError("OTP is invalid or has expired");

    const user = await User.findByIdAndUpdate(
        userId,
        { accountStatus: "active" },
        { new: true },
    );

    if (!user) throw new NotFoundError("User not found");

    // Generate access and refresh tokens
    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    // Save refresh token in Redis
    await redisUtils.setRefreshToken(user.id, refreshToken);

    // Clear OTP from Redis
    await redisUtils.clearOTP(otp);

    return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password, potentialRefreshToken }) => {
    // Ensure required fields are provided
    if (!email || !password) {
        throw new BadRequestError("Please provide all required fields");
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
        throw new NotFoundError("User with this email not found");
    }

    // Check if user's account is active
    if (user.accountStatus === "pending") {
        throw new BadRequestError("Please complete account verification");
    }

    if (user.accountStatus === "deactivated") {
        throw new BadRequestError(
            "Your account has been deactivated. Reactivate it to login",
        );
    }

    // Compare passwords to verify user
    const validPassword = await authUtils.comparePasswords(
        password,
        user.password,
    );

    if (!validPassword)
        throw new BadRequestError("Incorrect password. Please try again");

    // Generate access and refresh tokens
    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    // Clear old refresh token from Redis if it exists
    if (potentialRefreshToken) {
        await redisUtils.clearRefreshToken(potentialRefreshToken);
    }

    // Save refresh token in Redis
    await redisUtils.setRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
};

const logoutUser = async (refreshToken: string) => {
    // Get user ID from Redis
    const userId = await redisUtils.getRefreshToken(refreshToken);
    if (!userId) throw new UnauthorizedError("Invalid refresh token");

    // Find the user associated with the refresh token
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (user.accountStatus === "PENDING") {
        throw new BadRequestError("Please complete account verification");
    }

    // Delete refresh token from Redis
    redisUtils.clearRefreshToken(refreshToken);

    return user;
};

const refreshToken = async (refreshToken: string) => {
    // Get user ID from Redis
    const userId = await redisUtils.getRefreshToken(refreshToken);
    if (!userId) throw new UnauthorizedError("Invalid refresh token");

    // Find the user associated with the refresh token
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Check if user's account is active
    if (user.accountStatus === "PENDING") {
        throw new BadRequestError("Please complete account verification");
    }

    if (user.accountStatus === "DEACTIVATED") {
        throw new BadRequestError(
            "Your account has been deactivated. Reactivate it to refresh token",
        );
    }

    // Verify refresh token
    const decoded = tokenService.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    );

    // Clear old refresh token from Redis
    await redisUtils.clearRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = tokenService.generateAccessToken(decoded.userId);
    const newRefreshToken = tokenService.generateRefreshToken(decoded.userId);

    // Cache a new refresh token in Redis
    await redisUtils.setRefreshToken(user.id, newRefreshToken);

    return { user, newAccessToken, newRefreshToken };
};

const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("User with this email not found");
    }

    if (user.accountStatus !== "active") {
        throw new BadRequestError(
            "Cannot request password reset for inactive accounts",
        );
    }

    const otp = authUtils.generateOTP();
    await redisUtils.setOTP(user.id, otp);

    return { user, otp };
};

const verifyOTP = async (otp: number) => {
    // Find user ID by OTP in Redis
    const userId = await redisUtils.getOTP(otp);
    if (!userId) throw new NotFoundError("OTP is invalid or has expired");

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    // Ensure user account is active
    if (user.accountStatus !== "active")
        throw new BadRequestError("Cannot verify OTP for inactive accounts");

    const resetToken = tokenService.generateAccessToken(user.id); // lasts 15 minutes

    // Save reset token in Redis
    await redisUtils.setResetToken(user.id, resetToken);

    await redisUtils.clearOTP(otp);

    return { user, resetToken };
};

const resetPassword = async (resetToken: string, newPassword: string) => {
    if (!resetToken) throw new BadRequestError("Missing reset token");

    // Find user ID by Reset Token in Redis
    const userId = await redisUtils.getResetToken(resetToken);
    if (!userId)
        throw new NotFoundError("Reset Token is invalid or has expired");

    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Ensure user account is active
    if (user.accountStatus !== "active") {
        throw new BadRequestError(
            "Cannot reset password for inactive accounts",
        );
    }

    // Validate password
    authUtils.validatePassword(newPassword);

    // Hash password
    const hashedPassword = await authUtils.hashPassword(newPassword);

    // Set new password
    user.password = hashedPassword;
    await user.save();

    // Clear reset token from Redis
    await redisUtils.clearResetToken(resetToken);

    return user;
};

const updatePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string,
) => {
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Ensure user account is active
    if (user.accountStatus !== "active") {
        throw new BadRequestError(
            "Cannot update password for inactive accounts",
        );
    }

    // Compare passwords to verify user
    const validPassword = await authUtils.comparePasswords(
        oldPassword,
        user.password,
    );

    if (!validPassword) {
        throw new BadRequestError("Incorrect old password. Please try again");
    }

    // Validate password
    authUtils.validatePassword(newPassword);

    // Hash password
    const hashedPassword = await authUtils.hashPassword(newPassword);

    // Set new password
    user.password = hashedPassword;
    await user.save();

    return user;
};

const updateEmail = async (id: string, newEmail: string, password: string) => {
    // Check if email is already in use
    const potentialUser = await User.findOne({ email: newEmail });

    if (potentialUser) {
        throw new BadRequestError("A user with this email already exists");
    }

    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Ensure user account is active
    if (user.accountStatus !== "active") {
        throw new BadRequestError("Cannot update email for inactive accounts");
    }

    // Compare passwords to verify user
    const validPassword = await authUtils.comparePasswords(
        password,
        user.password,
    );

    if (!validPassword) {
        throw new BadRequestError("Incorrect password. Please try again");
    }

    // Keep track of old email
    await redisUtils.setNewEmail(user.id, newEmail);

    // Generate OTP for email verification
    const otp = authUtils.generateOTP();
    await redisUtils.setOTP(user.id, otp);

    return { user, otp };
};

const replaceEmail = async (otp: number) => {
    const userId = await redisUtils.getOTP(otp);
    if (!userId) throw new NotFoundError("OTP is invalid or has expired");

    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (user.accountStatus !== "active") {
        throw new BadRequestError("Cannot replace email for inactive accounts");
    }

    // Temporarily store previous email
    const previousEmail = user.email;

    // Find new email in Redis and update user's email
    const newEmail = await redisUtils.getNewEmail(user.id);
    user.email = newEmail;
    await user.save();

    await redisUtils.clearOTP(otp);
    await redisUtils.clearNewEmail(user.id);

    return { user, previousEmail };
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
};
