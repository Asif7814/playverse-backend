import UserGameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Add a game to the user's library
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

// @desc    Get all games from the user's library
// @route   GET /api/UserGames
// @access  Public
const getAllUserGames: Controller = async (_req, res, next) => {
    try {
        const userGames = await UserGameService.getAllUserGames();

        res.status(200).json({
            data: userGames,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all games from the user's library that match the search query
// @route   GET /api/UserGames/search?query=searchQuery
// @access  Public
const searchUserGames: Controller = async (req, res, next) => {
    try {
        const { name } = req.query as { name: string };
        const userGames = await UserGameService.searchUserGames(name);

        res.status(200).json({
            data: userGames,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual game by its id from the user's library
// @route   GET /api/UserGames/:id
// @access  Public
const getUserGameByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const userGame = await UserGameService.getUserGameByID(id);

        res.status(200).json({
            data: userGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual game from the user's library
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

// @desc    Delete an individual game from the user's library
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
    searchUserGames,
    getUserGameByID,
    updateUserGame,
    deleteUserGame,
};
