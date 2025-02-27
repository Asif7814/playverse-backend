import gameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Create a new game
// @route   POST /api/game
// @access  Private
const createGames: Controller = async (req, res, next) => {
    try {
        const newGame = await gameService.createGames(req.body);

        res.status(201).json({
            data: newGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all games
// @route   GET /api/games
// @access  Public
const getAllGames: Controller = async (_req, res, next) => {
    try {
        const games = await gameService.getAllGames();

        res.status(200).json({
            data: games,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual game by their id
// @route   GET /api/games/:id
// @access  Public
const getGameByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const game = await gameService.getGameByID(id);

        res.status(200).json({
            data: game,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual game
// @route   PATCH /api/games/:id
// @access  Private
const updateGame: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const updatedGame = await gameService.updateGame(id, req.body);

        res.status(200).json({
            data: updatedGame,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an individual game
// @route   DELETE /api/games/:id
// @access  Private
const deleteGame: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const deletedGame = await gameService.deleteGame(id);

        res.status(200).json({
            data: deletedGame,
        });
    } catch (err) {
        next(err);
    }
};

export default {
    createGames,
    getAllGames,
    getGameByID,
    updateGame,
    deleteGame,
};
