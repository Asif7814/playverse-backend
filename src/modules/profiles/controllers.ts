import profileService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Public
const getAllProfiles: Controller = async (_req, res, next) => {
    try {
        const profiles = await profileService.getAllProfiles();

        res.status(200).json({
            data: profiles,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual profile by their id
// @route   GET /api/profiles/:id
// @access  Public
const getProfileByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const profile = await profileService.getProfileByID(id);

        res.status(200).json({
            data: profile,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual profile
// @route   PATCH /api/profiles/:id
// @access  Private
const updateProfile: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const updatedProfile = await profileService.updateProfile(id, req.body);

        res.status(200).json({
            data: updatedProfile,
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getAllProfiles,
    getProfileByID,
    updateProfile,
};
