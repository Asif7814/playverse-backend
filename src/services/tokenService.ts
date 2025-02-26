import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

// Generate JWT token
const generateToken = (id: string): string => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default {
    generateToken,
};
