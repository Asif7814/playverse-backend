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

const getGameByID = async (id: string) => {};

export default {
    searchGames,
    getGameByID,
};
