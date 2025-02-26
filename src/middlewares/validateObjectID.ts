import { isValidObjectId as validateObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors.js";

interface RequestWithId extends Request {
    params: {
        id: string;
    };
}

const isValidObjectId = (
    req: RequestWithId,
    _res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;

    // Validate the `id`
    if (!validateObjectId(id)) {
        throw new BadRequestError(`Malformed object id: ${id}`);
    }

    next();
};

export default isValidObjectId;
