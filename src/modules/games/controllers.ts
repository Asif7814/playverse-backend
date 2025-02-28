import { Request } from "express";

import gameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";

import { IGameFilters } from "./types/game.types.js";

// @desc    Add an array of new games to db
// @route   POST /api/games
// @access  Private (Admin Only)
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

// @desc    Search for all games, optionally pass in query params to filter
// @route   GET /api/games
// @access  Public
const getAllGames: Controller = async (req, res, next) => {
    try {
        const filters = req.query as IGameFilters;
        const games = await gameService.getAllGames(filters);

        res.status(200).json({
            data: games,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual game by its id
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
// @access  Private (Admin Only)
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

// @desc    Delete an individual game from the db
// @route   DELETE /api/games/:id
// @access  Private (Admin Only)
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
