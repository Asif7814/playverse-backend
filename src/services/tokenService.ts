import jwt from "jsonwebtoken";

// Generate JWT token
const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};

export default { generateAccessToken, generateRefreshToken, verifyToken };
