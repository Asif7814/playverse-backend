import { model, Schema, Document } from "mongoose";
import { IGame } from "./types/game.types.js";
import { Platform, Genre } from "./enums/game.enums.js";

const gameSchema = new Schema<IGame>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        platforms: {
            type: [String],
            required: true,
            enum: Object.values(Platform),
        },
        genres: {
            type: [String],
            required: true,
            enum: Object.values(Genre),
        },
        releaseDate: {
            type: Date,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        developer: {
            type: String,
            required: true,
        },
        publisher: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default model<IGame>("game", gameSchema);
