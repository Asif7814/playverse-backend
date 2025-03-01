import { model, Schema, Document } from "mongoose";

interface IGame extends Document {
    gameId: number;
    name: string;
    coverImage: string;
    gameType: string;
    description: string;
    platforms: string[];
    genres: string[];
    releaseDate: Date;
    developers: { id: number; name: string }[];
    publishers: { id: number; name: string }[];
    trailers: { id: number; video: string }[];
    screenshots: { id: number; url: string }[];
    estimatedTimeToBeat: {
        story: number;
        storyAndExtras: number;
        completionist: number;
    };
}

const gameSchema = new Schema<IGame>(
    {
        gameId: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        gameType: {
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
        developers: {
            type: [
                {
                    id: Number,
                    name: String,
                },
            ],
            required: true,
        },
        publishers: {
            type: [
                {
                    id: Number,
                    name: String,
                },
            ],
            required: true,
        },
        trailers: {
            type: [
                {
                    id: Number,
                    video: String,
                },
            ],
            required: true,
        },
        screenshots: {
            type: [
                {
                    id: Number,
                    url: String,
                },
            ],
            required: true,
        },
        estimatedTimeToBeat: {
            story: {
                type: Number,
                required: true,
            },
            storyAndExtras: {
                type: Number,
                required: true,
            },
            completionist: {
                type: Number,
                required: true,
            },
        },
    },
    {
        _id: false,
        timestamps: false,
        versionKey: false,
    },
);

export interface IUserGame extends Document {
    game: IGame;
    status: string;
    platform: string;
    storefront?: string;
    hoursPlayed?: number;
    dateCompleted?: Date;
    collections?: string[];
    rating?: number;
    review?: string;
}

const userGameSchema = new Schema<IUserGame>(
    {
        game: {
            type: gameSchema,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: [
                "backlog",
                "playing",
                "completed",
                "on-hold",
                "dropped",
                "replaying",
            ],
        },
        platform: {
            type: String,
            required: true,
        },
        storefront: {
            type: String,
            required: false,
            enum: [
                "physical",
                "playstation-store",
                "ea-app",
                "epic-games",
                "gog",
                "nintendo-eshop",
                "rockstar-games",
                "steam",
                "uplay",
                "xbox-store",
                "other",
            ],
        },
        hoursPlayed: {
            type: Number,
            required: false,
        },
        dateCompleted: {
            type: Date,
            required: false,
        },
        collections: {
            type: [String],
            required: false,
        },
        rating: {
            type: Number,
            required: false,
        },
        review: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default model<IUserGame>("userGame", userGameSchema);
