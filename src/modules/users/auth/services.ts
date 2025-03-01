import User, { IUser } from "../models.js";
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from "../../../utils/errors.js";
import authUtils from "../../../utils/authUtils.js";
import redisUtils from "../../../utils/redisUtils.js";

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

export default { registerUser };
