import jwt from "jsonwebtoken";

// Generate JWT token
export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};
