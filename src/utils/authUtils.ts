import bcrypt from "bcryptjs";
import crypto from "crypto";

import { BadRequestError, TooManyRequestsError } from "./errors.js";

// Function to validate a password
const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
        password.length < minLength ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecialChar
    ) {
        throw new BadRequestError(
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        );
    }
};

// Function to hash a password
const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Function to compare a plain password with a hashed password
// returns true if the passwords match, false otherwise
const comparePasswords = async (
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Function to generate a 6-digit OTP
const generateOTP = (): number => {
    return crypto.randomInt(100000, 999999);
};

// Function to generate a string token
const generateStringToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

// Function to set Token expiration (otp, resetToken)
const generateTokenExpiry = (minutes = 0, days = 0): number => {
    if (days !== 0) {
        return Date.now() + days * 24 * 60 * 60 * 1000;
    }

    if (minutes !== 0) {
        return Date.now() + minutes * 60 * 1000;
    }
};

// Function to check token cooldown
// lastActionTime: the last time the token was sent
// cooldownPeriod: the time in minutes to wait before sending another token, default is 2 minutes
const checkTokenCooldown = (lastActionTime: number, cooldownPeriod = 2) => {
    const now = Date.now();
    const cooldownPeriodMs = cooldownPeriod * 60 * 1000; // Convert cooldownPeriod to milliseconds
    if (lastActionTime && now - lastActionTime < cooldownPeriodMs) {
        const waitTime = Math.ceil(
            (cooldownPeriodMs - (now - lastActionTime)) / 1000,
        );
        throw new TooManyRequestsError(
            `Please wait ${waitTime} seconds before requesting another token.`,
        );
    }
};

export default {
    validatePassword,
    hashPassword,
    comparePasswords,
    generateOTP,
    generateStringToken,
    generateTokenExpiry,
    checkTokenCooldown,
};
