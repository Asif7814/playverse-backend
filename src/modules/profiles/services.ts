import Profile, { IProfile } from "./models.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const getAllProfiles = async (): Promise<IProfile[]> => await Profile.find();

const getProfileByID = async (id: string): Promise<IProfile> => {
    const selectedProfile = await Profile.findById(id);

    if (!selectedProfile) {
        throw new NotFoundError("Profile not found");
    }

    return selectedProfile;
};

const updateProfile = async (
    id: string,
    updatedValue: Partial<IProfile>,
): Promise<IProfile> => {
    const newProfile = await Profile.findByIdAndUpdate(id, updatedValue, {
        new: true,
    });

    if (!newProfile) {
        throw new NotFoundError("Profile not found");
    }

    return newProfile;
};

export default {
    getAllProfiles,
    getProfileByID,
    updateProfile,
};
