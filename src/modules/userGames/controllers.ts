import UserGameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Create a new User Game
// @route   POST /api/UserGame
// @access  Private
const createUserGame: Controller = async (req, res, next) => {
    try {
        const newUserGame = await UserGameService.createUserGame(req.body);

        res.status(201).json({
            data: newUserGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all User Games
// @route   GET /api/UserGames
// @access  Public
const getAllUserGames: Controller = async (_req, res, next) => {
    try {
        const UserGames = await UserGameService.getAllUserGames();

        res.status(200).json({
            data: UserGames,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual User Game by their id
// @route   GET /api/UserGames/:id
// @access  Public
const getUserGameByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const UserGame = await UserGameService.getUserGameByID(id);

        res.status(200).json({
            data: UserGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual User Game
// @route   PATCH /api/UserGames/:id
// @access  Private
const updateUserGame: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const updatedUserGame = await UserGameService.updateUserGame(
            id,
            req.body,
        );

        res.status(200).json({
            data: updatedUserGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an individual User Game
// @route   DELETE /api/UserGames/:id
// @access  Private
const deleteUserGame: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const deletedUserGame = await UserGameService.deleteUserGame(id);

        res.status(200).json({
            data: deletedUserGame,
        });
    } catch (err) {
        next(err);
    }
};

export default {
    createUserGame,
    getAllUserGames,
    getUserGameByID,
    updateUserGame,
    deleteUserGame,
};
