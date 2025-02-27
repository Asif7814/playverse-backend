import Game, { IGame } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

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

const getAllGames = async (): Promise<IGame[]> => await Game.find();

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
