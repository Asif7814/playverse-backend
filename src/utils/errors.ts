import { MongooseError } from "mongoose";
import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

export class TooManyRequestsError extends ApiError {
    constructor(message = "Too Many Requests") {
        super(message, 429);
    }
}

// Type-safe error handler
const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.log("error", error, error.name);

    if (error instanceof MongooseError && error.name === "ValidationError") {
        res.status(400).json({
            error: {
                message: error.message,
            },
        });
        return;
    }

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            error: {
                message: error.message,
            },
        });
        return;
    }

    res.status(500).json({
        error: {
            message: "Something went wrong",
        },
    });
};

export default errorHandler;
