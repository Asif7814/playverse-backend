import { Request } from "express";

import gameService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";

// @desc    Search for all games by their title
// @route   GET /api/games
// @access  Public
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

export default {
    searchGames,
    getGameByID,
};
