import userService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers: Controller = async (_req, res, next) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual user by their id
// @route   GET /api/users/:id
// @access  Public
const getUserByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserByID(id);

        res.status(200).json({
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual user
// @route   PATCH /api/users/:id
// @access  Private
const updateUser: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const updatedUser = await userService.updateUser(id, req.body);

        res.status(200).json({
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getAllUsers,
    getUserByID,
    updateUser,
};
