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

export default { registerUser, verifyUser };
