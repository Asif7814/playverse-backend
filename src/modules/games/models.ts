import { model, Schema, Document } from "mongoose";

export interface IGame extends Document {
    title: string;
    description: string;
    platforms: string[];
    genres: string[];
    releaseDate: Date;
    coverImage: string;
    developer: string;
    publisher: string;
}

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
        },
        genres: {
            type: [String],
            required: true,
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
