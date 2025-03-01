import UserGame, { IUserGame } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const createUserGame = async (newUserGame: IUserGame): Promise<IUserGame> => {
    const createdUserGame = await UserGame.create(newUserGame);

    if (!createdUserGame) {
        throw new BadRequestError("UserGame not created");
    }

    return createdUserGame;
};

const getAllUserGames = async (): Promise<IUserGame[]> => await UserGame.find();

const getUserGameByID = async (id: string): Promise<IUserGame> => {
    const selectedUserGame = await UserGame.findById(id);

    if (!selectedUserGame) {
        throw new NotFoundError("UserGame not found");
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
        throw new NotFoundError("UserGame not found");
    }

    return newUserGame;
};

const deleteUserGame = async (id: string): Promise<IUserGame> => {
    const deletedUserGame = await UserGame.findByIdAndDelete(id);

    if (!deletedUserGame) {
        throw new NotFoundError("UserGame not found");
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
