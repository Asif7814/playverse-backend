import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const BASE_URL = process.env.IGDB_BASE_URL;
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

const searchGames = async (searchQuery: String) => {
    const res = await fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: `search "${searchQuery}"; 
               fields name, cover.url, game_type.type;`,
    });

    if (!res.ok) throw new BadRequestError("Failed to fetch data from IGDB");

    const data = await res.json();

    // Filter out games that are of type "Pack"
    const filteredGames = await data.filter((game) =>
        game.game_type.type !== "Pack" ? game : null,
    );

    // If no games are found, throw an error
    if (filteredGames.length == 0)
        throw new NotFoundError("No games were found");

    // Replace the cover data with just the full cover image URL
    const games = await filteredGames.map(({ id, name, cover, game_type }) => ({
        id,
        type: game_type.type,
        name,
        coverImage: `https:${cover.url}`,
    }));

    return games;
};

const getGameByID = async (id: string) => {
    const res = await fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: `fields name, cover.url, game_type.type, summary, platforms.name, platforms.alternative_name, genres.name,  
        release_dates.human, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, videos.name, videos.video_id, screenshots.url;
                where id = ${id};`,
    });

    if (!res.ok) throw new BadRequestError("Failed to fetch data from IGDB");

    const data = await res.json();

    const game = data.map(
        ({
            id,
            name,
            cover,
            game_type,
            summary,
            platforms,
            genres,
            release_dates,
            involved_companies,
            videos,
            screenshots,
        }) => {
            const coverImage = `https:${cover.url}`;
            const gameType = game_type.type;
            const updatedPlatforms = platforms.map(
                ({ name, alternative_name }) => {
                    let platformName = name;

                    if (name.includes("PC")) {
                        platformName = "PC";
                    }

                    if (name.includes("PlayStation")) {
                        platformName = alternative_name;
                    }

                    return platformName;
                },
            );
            const updatedGenres = genres.map(({ name }) => name);
            const releaseDate = release_dates[0].human;

            const developers = involved_companies
                .filter(({ developer }) => developer)
                .map(({ id, company }) => ({ id, name: company.name }));

            const publishers = involved_companies
                .filter(({ publisher }) => publisher)
                .map(({ id, company }) => ({ id, name: company.name }));

            const trailers = videos
                .filter(({ name }) => name.includes("Trailer"))
                .map(({ id, video_id }) => ({
                    id,
                    video: `https://www.youtube.com/embed/${video_id}`,
                }));

            const screenshotsURL = screenshots.map(({ url }) => `https:${url}`);

            return {
                id,
                name,
                coverImage,
                gameType,
                description: summary,
                platforms: updatedPlatforms,
                genres: updatedGenres,
                releaseDate: new Date(releaseDate),
                developers,
                publishers,
                trailers,
                screenshotsURL,
            };
        },
    );

    return game;
};

export default {
    searchGames,
    getGameByID,
};
