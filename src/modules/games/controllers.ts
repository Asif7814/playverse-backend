import { Request } from "express";

import gameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";

// @desc    Get all games by various filters
// @route   GET /api/games
// @access  Private
const getAllGames: Controller = async (req, res, next) => {
    try {
        const { sortBy, order, startDate, endDate, genres, platforms, limit } =
            req.query;

        const queries = {
            sortBy: null,
            order: null,
            startDate: null,
            endDate: null,
            genres: null,
            platforms: null,
            limit: null,
        };

        queries.sortBy = sortBy as string;
        queries.order = order as string;
        queries.startDate = startDate as string;
        queries.endDate = endDate as string;
        queries.genres = genres as string[];
        queries.platforms = platforms as string[];
        queries.limit = limit as string;

        const games = await gameService.getAllGames(queries);

        res.status(200).json({
            data: games,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Search for games by their title
// @route   GET /api/games/search
// @access  Private
const searchGames: Controller = async (req, res, next) => {
    try {
        const { title } = req.query as { title: string };
        const games = await gameService.searchGames(title);

        res.status(200).json({
            data: games,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual game's details by the game id
// @route   GET /api/games/:id
// @access  Private
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

export default {
    getAllGames,
    searchGames,
    getGameByID,
};
