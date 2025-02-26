import Temp, { ITemp } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const createTemp = async (newTemp: ITemp): Promise<ITemp> => {
    const createdTemp = await Temp.create(newTemp);

    if (!createdTemp) {
        throw new BadRequestError("Temp not created");
    }

    return createdTemp;
};

const getAllTemps = async (): Promise<ITemp[]> => await Temp.find();

const getTempByID = async (id: string): Promise<ITemp> => {
    const selectedTemp = await Temp.findById(id);

    if (!selectedTemp) {
        throw new NotFoundError("Temp not found");
    }

    return selectedTemp;
};

const replaceTemp = async (id: string, updatedTemp: ITemp): Promise<ITemp> => {
    const newTemp = await Temp.findByIdAndUpdate(id, updatedTemp, {
        new: true,
    });

    if (!newTemp) {
        throw new NotFoundError("Temp not found");
    }

    return newTemp;
};

const updateTemp = async (
    id: string,
    updatedValue: Partial<ITemp>,
): Promise<ITemp> => {
    const newTemp = await Temp.findByIdAndUpdate(id, updatedValue, {
        new: true,
    });

    if (!newTemp) {
        throw new NotFoundError("Temp not found");
    }

    return newTemp;
};

const deleteTemp = async (id: string): Promise<ITemp> => {
    const deletedTemp = await Temp.findByIdAndDelete(id);

    if (!deletedTemp) {
        throw new NotFoundError("Temp not found");
    }

    return deletedTemp;
};

export default {
    createTemp,
    getAllTemps,
    getTempByID,
    replaceTemp,
    updateTemp,
    deleteTemp,
};
