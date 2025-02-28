import Game from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { IGame, IGameFilters } from "./types/game.types.js";

const createGames = async (newGames: IGame[]): Promise<IGame[]> => {
    const addedGames: IGame[] = [];

    for (const game of newGames) {
        const createdGame = await Game.create(game);

        if (!createdGame) {
            throw new BadRequestError("Game not created");
        }

        addedGames.push(createdGame);
    }

    return addedGames;
};

const getAllGames = async (filters: IGameFilters): Promise<IGame[]> => {
    const query: any = {};

    // Title (Partial and Case-Insensitive)
    if (filters.title) query.title = { $regex: filters.title, $options: "i" };

    // Platforms and Genres
    if (filters.platform) {
        query.platforms = { $in: [filters.platform] };
    }

    if (filters.genre) {
        query.genres = { $in: [filters.genre] };
    }

    // Release Date (Custom Date Range)
    if (filters.startDate || filters.endDate) {
        query.releaseDate = {};

        // If startDate is provided, use it as the lower bound
        if (filters.startDate) {
            query.releaseDate.$gte = new Date(filters.startDate);
        }

        // If endDate is provided, use it as the upper bound
        if (filters.endDate) {
            query.releaseDate.$lt = new Date(filters.endDate);
        }
    }

    // Age Rating
    if (filters.ageRating) query.ageRating = filters.ageRating;

    // Developer and Publisher
    if (filters.developer) query.developer = filters.developer;
    if (filters.publisher) query.publisher = filters.publisher;

    const foundGames = await Game.find(query);
    return foundGames;
};

const getGameByID = async (id: string): Promise<IGame> => {
    const selectedGame = await Game.findById(id);

    if (!selectedGame) {
        throw new NotFoundError("Game not found");
    }

    return selectedGame;
};

const updateGame = async (
    id: string,
    updatedValue: Partial<IGame>,
): Promise<IGame> => {
    const newGame = await Game.findByIdAndUpdate(id, updatedValue, {
        new: true,
    });

    if (!newGame) {
        throw new NotFoundError("Game not found");
    }

    return newGame;
};

const deleteGame = async (id: string): Promise<IGame> => {
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
        throw new NotFoundError("Game not found");
    }

    return deletedGame;
};

export default {
    createGames,
    getAllGames,
    getGameByID,
    updateGame,
    deleteGame,
};
