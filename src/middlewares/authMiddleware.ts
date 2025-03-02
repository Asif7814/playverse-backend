import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

interface JwtPayload {
    userId: string;
}

const protect = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
) => {
    let token: string | undefined;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
            ) as JwtPayload;

            // Attach user data to request
            req.user = { id: decoded.userId };
            next();
        } catch (error) {
            throw new UnauthorizedError("Not authorized, token failed");
        }
    } else {
        throw new BadRequestError("No token provided");
    }
};

export default protect;
