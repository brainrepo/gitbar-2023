import { Episode } from "@podverse/podcast-feed-parser";
import { getSlug, prepareTitle } from "./../utils";
import { getPodcastFeed } from "../utils";
import fs from "fs/promises";
import { AstroConfig } from "astro";
import { create, insertBatch } from "@lyrasearch/lyra";

let cfFolder: AstroConfig;

type DbEpisode = {
  title: string;
  text: string;
  from: number;
  path: string;
  mp3url: string;
};

async function initDB(env: string): Promise<void> {
  const episodes = await getSegments(
    "https://www.spreaker.com/show/4173756/episodes/feed"
  );
  const db = await populateDb(episodes);
  await writeDbToFile(env, db);
}

async function getSegments(episodesUrl: string): Promise<DbEpisode[]> {
  const { episodes } = await getPodcastFeed(episodesUrl);

  //create lines to inser
  const segments = episodes.map(async (e) => {
    console.log("-----", e.title);

    try {
      if (Number(prepareTitle(e.title)[0]) > 130) {
        const json = await import(
          `../transcriptions/${prepareTitle(e.title)[0]}.json`
        );

        const segments = json.segments.map((s) => ({
          title: e.title,
          path: getSlug(e),
          from: s.start,
          text: s.text,
          mp3url: e.enclosure.url,
        }));

        return segments;
      }
    } catch (e) {
      console.log("error", e);
    }
    return [];
  });

  const data = await Promise.all(segments);
  return data.flat();
}

async function populateDb(episodes: DbEpisode[]) {
  const db = await create({
    schema: {
      title: "string",
      text: "string",
      from: "number",
      path: "string",
      mp3url: "string",
    },
  });

  await insertBatch(db, episodes, { batchSize: 500, language: "italian" });

  return db;
}

const writeDbToFile = (env: string, db): Promise<any> =>
  fs.writeFile(getDbFilename(env), JSON.stringify(db));

const getDbFilename = (env: string): string =>
  env === "dev"
    ? `${cfFolder.outDir.pathname}/../in_episode.db.json`
    : `${cfFolder.outDir.pathname}/in_episode.db.json`;

export default () => ({
  name: "GITBAR-ASTRO-LYRA-IN-EPISODE",
  hooks: {
    "astro:config:done": ({ config: cfg }) => {
      cfFolder = cfg;
    },
    "astro:server:start": async () => {
      await initDB("dev");
    },
    "astro:build:done": async () => {
      await initDB("prod");
    },
  },
});
