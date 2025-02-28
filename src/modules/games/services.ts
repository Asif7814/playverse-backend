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
    console.log(data);

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
        body: `fields name, cover.url, game_type.type, summary, platforms.name, platforms.alternative_name, platforms.abbreviation, genres.name,  
        release_dates.human, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, videos.name, videos.video_id, screenshots.url;
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
                summary,
                platforms,
                genres,
                release_dates,
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

                const releaseDate = release_dates
                    ? release_dates[0].human
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
                    description: summary,
                    platforms: updatedPlatforms,
                    genres: updatedGenres,
                    releaseDate: new Date(releaseDate),
                    developers,
                    publishers,
                    trailers,
                    screenshotsURL,
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
    searchGames,
    getGameByID,
};
