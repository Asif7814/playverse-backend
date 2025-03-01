import { BadRequestError, NotFoundError } from "../../utils/errors.js";

const BASE_URL = process.env.IGDB_BASE_URL;
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

const getAllGames = async ({
    sortBy,
    order,
    startDate,
    endDate,
    genres,
    platforms,
    limit,
}) => {
    // Initialize body with fields to fetch
    let body = `fields name, cover.url, game_type.type, genres.name, platforms.name, platforms.abbreviation, first_release_date;`;

    // Initialize where clause
    let whereClause = "";

    // Filter by Release Window
    if (startDate && endDate) {
        const startTimeStamp = Math.floor(new Date(startDate).getTime() / 1000);
        const endTimeStamp = Math.floor(new Date(endDate).getTime() / 1000);

        whereClause += `(first_release_date >= ${startTimeStamp} & first_release_date <= ${endTimeStamp})`;
    }

    // Filter by Genres
    if (genres) {
        const genreArray = genres.split(",").map((g) => `"${g.trim()}"`);
        const genreFilter = genreArray
            .map((g) => `genres.name = ${g}`)
            .join(" | ");
        whereClause += whereClause ? ` & (${genreFilter})` : `(${genreFilter})`;
    }

    // Filter by Platforms
    if (platforms) {
        const platformArray = platforms.split(",").map((p) => `"${p.trim()}"`);
        const platformFilter = platformArray
            .map(
                (p) =>
                    `(platforms.name = ${p} | platforms.abbreviation = ${p})`,
            )
            .join(" | ");
        whereClause += whereClause
            ? ` & (${platformFilter})`
            : `(${platformFilter})`;
    }

    // Append the combined where clause
    if (whereClause) {
        body += ` where ${whereClause};`;
    }

    // Sorting
    if (sortBy) {
        body += ` sort ${sortBy} ${order || "desc"};`;
    }

    // Limit the number of results
    body += ` limit ${limit || 10};`;

    // Fetch data from IGDB
    const res = await fetch(`${BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body,
    });

    if (!res.ok) throw new BadRequestError("Failed to fetch data from IGDB");

    const data = await res.json();

    const games = await data
        .filter((game) => game.game_type.type !== "Pack")
        .map(
            ({
                id,
                name,
                cover,
                game_type,
                genres,
                platforms,
                first_release_date,
            }) => ({
                id,
                name,
                coverImage: cover ? `https:${cover.url}` : null,
                gameType: game_type ? game_type.type : null,
                genres: genres ? genres.map((g) => g.name) : null,
                platforms: platforms
                    ? platforms.map((p) => p.abbreviation)
                    : null,
                releaseDates: first_release_date
                    ? new Date(first_release_date * 1000)
                    : null,
            }),
        );

    return games;
};

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
        coverImage: cover ? `https:${cover.url}` : null,
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
        body: `fields name, cover.url, game_type.type, storyline, platforms.name, platforms.alternative_name, platforms.abbreviation, genres.name, first_release_date, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, videos.name, videos.video_id, screenshots.url;
                where id = ${id};`,
    });

    if (!res.ok) throw new BadRequestError("Failed to fetch data from IGDB");

    const data = await res.json();

    const game = await Promise.all(
        data.map(
            async ({
                id,
                name,
                cover,
                game_type,
                storyline,
                platforms,
                genres,
                first_release_date,
                involved_companies,
                videos,
                screenshots,
            }) => {
                const coverImage = cover ? `https:${cover.url}` : null;

                const gameType = game_type ? game_type.type : null;

                const updatedPlatforms = platforms
                    ? platforms.map(({ name, abbreviation }) => {
                          let platformName = abbreviation;

                          if (name.includes("Xbox")) {
                              platformName = name;
                          }

                          return platformName;
                      })
                    : null;

                const updatedGenres = genres
                    ? genres.map(({ name }) => name)
                    : null;

                const releaseDate = first_release_date
                    ? new Date(first_release_date * 1000)
                    : null;

                const developers = involved_companies
                    ? involved_companies
                          .filter(({ developer }) => developer)
                          .map(({ id, company }) => ({
                              id,
                              name: company.name,
                          }))
                    : null;

                const publishers = involved_companies
                    ? involved_companies
                          .filter(({ publisher }) => publisher)
                          .map(({ id, company }) => ({
                              id,
                              name: company.name,
                          }))
                    : null;

                const trailers = videos
                    ? videos
                          .filter(({ name }) => name.includes("Trailer"))
                          .map(({ id, video_id }) => ({
                              id,
                              video: `https://www.youtube.com/embed/${video_id}`,
                          }))
                    : null;

                const screenshotsURL = screenshots
                    ? screenshots.map(({ url }) => `https:${url}`)
                    : null;

                const timeToBeatRes = await fetch(
                    `${BASE_URL}/game_time_to_beats`,
                    {
                        method: "POST",
                        headers: {
                            "Client-ID": CLIENT_ID,
                            Authorization: `Bearer ${ACCESS_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                        body: `fields hastily, normally, completely;
                            where game_id = ${id};`,
                    },
                );

                const timeToBeatData = await timeToBeatRes.json();

                const timeToBeatHastily = timeToBeatData[0]?.hastily
                    ? Math.round(timeToBeatData[0].hastily / 60 / 60) // converting seconds to hours
                    : null;

                const timeToBeatNormally = timeToBeatData[0]?.normally
                    ? Math.round(timeToBeatData[0].normally / 60 / 60) // converting seconds to hours
                    : null;

                const timeToBeatCompletely = timeToBeatData[0]?.completely
                    ? Math.round(timeToBeatData[0].completely / 60 / 60) // converting seconds to hours
                    : null;

                return {
                    id,
                    name,
                    coverImage,
                    gameType,
                    description: storyline,
                    platforms: updatedPlatforms,
                    genres: updatedGenres,
                    releaseDate,
                    developers,
                    publishers,
                    trailers,
                    screenshots: screenshotsURL,
                    estimatedTimeToBeat: {
                        story: timeToBeatHastily,
                        storyAndExtras: timeToBeatNormally,
                        completionist: timeToBeatCompletely,
                    },
                };
            },
        ),
    );

    return game;
};

export default {
    getAllGames,
    searchGames,
    getGameByID,
};
