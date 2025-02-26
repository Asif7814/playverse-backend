import { Request, Response, NextFunction } from "express";

// General controller type for request handling
export type Controller = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export type ParamsWithId = {
    id: string;
};
