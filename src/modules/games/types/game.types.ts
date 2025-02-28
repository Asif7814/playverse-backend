import { Platform, Genre } from "../enums/game.enums.js";

export interface IGame extends Document {
    title: string;
    description: string;
    platforms: Platform[];
    genres: Genre[];
    releaseDate: Date;
    coverImage: string;
    developer: string;
    publisher: string;
}

export interface IGameFilters {
    title?: string;
    platform?: string;
    genre?: string;
    startDate?: Date;
    endDate?: Date;
    developer?: string;
    publisher?: string;
}
