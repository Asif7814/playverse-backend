import { Platform, Genre } from "../enums/game.enums.js";
import { Document } from "mongoose";

export interface IGame extends Document {
    title: string;
    description: string;
    platforms: Platform[];
    genres: Genre[];
    releaseDate: Date;
    developer: string;
    publisher: string;
    series: string;
    editions: string[];
    ageRating: string;

    coverImage: string;
    trailer: string;
    screenshots: string[];

    estimatedTimeForStory: number;
    estimatedTimeForStoryAndExtra: number;
    estimatedTimeForCompletionist: number;
}

export interface IGameFilters {
    title?: string;
    platform?: string;
    genre?: string;
    startDate?: Date;
    endDate?: Date;
    ageRating?: string;
    developer?: string;
    publisher?: string;
}
