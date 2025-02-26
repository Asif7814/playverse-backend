import tempService from "./services.js";
import { Controller, ParamsWithId } from "../../types/controllers.js";
import { Request } from "express";

// @desc    Create a new temp
// @route   POST /api/temp
// @access  Private
const createTemp: Controller = async (req, res, next) => {
    try {
        const newTemp = await tempService.createTemp(req.body);

        res.status(201).json({
            data: newTemp,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all temps
// @route   GET /api/temps
// @access  Public
const getAllTemps: Controller = async (_req, res, next) => {
    try {
        const temps = await tempService.getAllTemps();

        res.status(200).json({
            data: temps,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get an individual temp by their id
// @route   GET /api/temps/:id
// @access  Public
const getTempByID: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const temp = await tempService.getTempByID(id);

        res.status(200).json({
            data: temp,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Replace an individual temp
// @route   PUT /api/temps/:id
// @access  Private
const replaceTemp: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const replacedTemp = await tempService.replaceTemp(id, req.body);

        res.status(200).json({
            data: replacedTemp,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a part of an individual temp
// @route   PATCH /api/temps/:id
// @access  Private
const updateTemp: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const updatedTemp = await tempService.updateTemp(id, req.body);

        res.status(200).json({
            data: updatedTemp,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an individual temp
// @route   DELETE /api/temps/:id
// @access  Private
const deleteTemp: Controller = async (
    req: Request<ParamsWithId>,
    res,
    next,
) => {
    try {
        const { id } = req.params;
        const deletedTemp = await tempService.deleteTemp(id);

        res.status(200).json({
            data: deletedTemp,
        });
    } catch (err) {
        next(err);
    }
};

export default {
    createTemp,
    getAllTemps,
    getTempByID,
    replaceTemp,
    updateTemp,
    deleteTemp,
};
