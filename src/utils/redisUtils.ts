import { redis } from "../config/redis.js";

// OTP
const setOTP = async (
    userId: string,
    otp: number,
    ttlSeconds: number = 300, // 5 minutes
) => {
    await redis.setex(`otp:${otp}`, ttlSeconds, userId);
};

const getOTP = async (otp: number): Promise<string | null> => {
    return await redis.get(`otp:${otp}`);
};

const clearOTP = async (otp: number) => {
    await redis.del(`otp:${otp}`);
};

// New Email
const setNewEmail = async (
    userId: string,
    newEmail: string,
    ttlSeconds: number = 300, // 5 minutes
) => {
    await redis.setex(`newEmail:${userId}`, ttlSeconds, newEmail);
};

const getNewEmail = async (userId: string): Promise<string | null> => {
    return await redis.get(`newEmail:${userId}`);
};

const clearNewEmail = async (userId: string) => {
    await redis.del(`newEmail:${userId}`);
};

// Refresh Token
const setRefreshToken = async (
    userId: string,
    refreshToken: string,
    ttlSeconds: number = 30 * 24 * 60 * 60, // 30 days
) => {
    await redis.setex(`refreshToken:${refreshToken}`, ttlSeconds, userId);
};

const getRefreshToken = async (
    refreshToken: string,
): Promise<string | null> => {
    return await redis.get(`refreshToken:${refreshToken}`);
};

const clearRefreshToken = async (refreshToken: string) => {
    await redis.del(`refreshToken:${refreshToken}`);
};

// Reset Token
const setResetToken = async (
    userId: string,
    resetToken: string,
    ttlSeconds: number = 15 * 60, // 15 minutes
) => {
    await redis.setex(`resetToken:${resetToken}`, ttlSeconds, userId);
};

const getResetToken = async (resetToken: string): Promise<string | null> => {
    return await redis.get(`resetToken:${resetToken}`);
};

const clearResetToken = async (resetToken: string) => {
    await redis.del(`resetToken:${resetToken}`);
};

export default {
    setOTP,
    getOTP,
    clearOTP,
    setNewEmail,
    getNewEmail,
    clearNewEmail,
    setRefreshToken,
    getRefreshToken,
    clearRefreshToken,
    setResetToken,
    getResetToken,
    clearResetToken,
};
