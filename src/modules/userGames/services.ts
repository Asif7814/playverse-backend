import UserGame, { IUserGame } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const createUserGame = async (newUserGame: IUserGame): Promise<IUserGame> => {
    // Check if the game already exists in the user's library
    const foundUserGame = await UserGame.findOne({
        "game.gameId": newUserGame.game.gameId,
    });

    if (foundUserGame) {
        throw new BadRequestError("Game already exists in library");
    }

    // Create the new user game
    const createdUserGame = await UserGame.create(newUserGame);

    if (!createdUserGame) {
        throw new BadRequestError("Game not added to library");
    }

    return createdUserGame;
};

const getAllUserGames = async (): Promise<IUserGame[]> => await UserGame.find();

const getUserGameByID = async (id: string): Promise<IUserGame> => {
    const selectedUserGame = await UserGame.findById(id);

    if (!selectedUserGame) {
        throw new NotFoundError("Game not found in library");
    }

    return selectedUserGame;
};

const updateUserGame = async (
    id: string,
    updatedValue: Partial<IUserGame>,
): Promise<IUserGame> => {
    const newUserGame = await UserGame.findByIdAndUpdate(id, updatedValue, {
        new: true,
    });

    if (!newUserGame) {
        throw new NotFoundError("Game not found in library");
    }

    return newUserGame;
};

const deleteUserGame = async (id: string): Promise<IUserGame> => {
    const deletedUserGame = await UserGame.findByIdAndDelete(id);

    if (!deletedUserGame) {
        throw new NotFoundError("Game not found in library");
    }

    return deletedUserGame;
};

export default {
    createUserGame,
    getAllUserGames,
    getUserGameByID,
    updateUserGame,
    deleteUserGame,
};
