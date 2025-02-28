import { model, Schema } from "mongoose";
import { IGame } from "./types/game.types.js";
import { Platform, Genre } from "./enums/game.enums.js";

const gameSchema = new Schema<IGame>(
    {
        // --- MAIN FIELDS ---
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
        developer: {
            type: String,
            required: true,
        },
        publisher: {
            type: String,
            required: true,
        },
        series: {
            type: String,
            required: true,
        },
        editions: {
            type: [String],
        },
        ageRating: {
            type: String,
            required: true,
            enum: ["E", "E10+", "T", "M", "A", "RP"],
        },

        // --- MEDIA FIELDS ---
        coverImage: {
            type: String,
            required: true,
        },
        trailer: {
            type: String,
            required: true,
        },
        screenshots: {
            type: [String],
            required: true,
        },

        // --- ADDITIONAL FIELDS ---
        estimatedTimeForStory: {
            type: Number,
            required: true,
        },
        estimatedTimeForStoryAndExtra: {
            type: Number,
            required: true,
        },
        estimatedTimeForCompletionist: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

export default model<IGame>("game", gameSchema);
