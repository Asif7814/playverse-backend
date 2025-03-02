import User, { IUser } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const getAllUsers = async (): Promise<IUser[]> => await User.find();

const getUserByID = async (id: string): Promise<IUser> => {
    const selectedUser = await User.findById(id);

    if (!selectedUser) {
        throw new NotFoundError("User not found");
    }

    return selectedUser;
};

const updateUser = async (
    id: string,
    updatedValue: Partial<IUser>,
): Promise<IUser> => {
    const newUser = await User.findByIdAndUpdate(id, updatedValue, {
        new: true,
    });

    if (!newUser) {
        throw new NotFoundError("User not found");
    }

    return newUser;
};

export default {
    getAllUsers,
    getUserByID,
    updateUser,
};
