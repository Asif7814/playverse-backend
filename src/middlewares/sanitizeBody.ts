import xss from "xss";
import { Request, Response, NextFunction } from "express";

interface SanitizedRequest extends Request {
    sanitizedBody?: Record<string, unknown>;
}

// Type guard to check if a value is an object with string keys
function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

const sanitize = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map((v) => sanitize(v));
    }

    if (isObject(value)) {
        return stripTags(value);
    }

    if (typeof value === "string") {
        return xss(value, {
            whiteList: {},
            stripIgnoreTag: true,
            stripIgnoreTagBody: ["script"],
        });
    }

    return value;
};

const stripTags = (
    payload: Record<string, unknown>,
): Record<string, unknown> => {
    const attributes = { ...payload };

    for (const key in attributes) {
        attributes[key] = sanitize(attributes[key]);
    }

    return attributes;
};

const sanitizeBody = (
    req: SanitizedRequest,
    _res: Response,
    next: NextFunction,
) => {
    const { id, _id, ...attributes } = req.body;

    req.sanitizedBody = stripTags(attributes);

    next();
};

export default sanitizeBody;
