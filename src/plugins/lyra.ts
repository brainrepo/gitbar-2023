import { Episode } from "@podverse/podcast-feed-parser";
import { getSlug } from "./../utils";
import { getPodcastFeed } from "../utils";
import fs from "fs/promises";
import { AstroConfig } from "astro";
import { create, insertBatch, Lyra } from "@lyrasearch/lyra";
import TurndownService from "turndown";

let cfFolder: AstroConfig;

type DbEpisode = {
  title: string,
  description: string,
  path: string
};

type Db = Lyra<{
  title: "string";
  description: "string";
  path: "string";
}>;

async function initDB(env: string): Promise<void> {
  const episodes = await getEpisodes(
    "https://www.spreaker.com/show/4173756/episodes/feed"
  );

  const db = await populateDb(episodes);

  await writeDbToFile(env, db);
}

async function getEpisodes(episodesUrl: string): Promise<DbEpisode[]> {
  const { episodes } = await getPodcastFeed(
    "https://www.spreaker.com/show/4173756/episodes/feed"
  );

  return cleanupEpisodes(episodes);
}

async function populateDb(episodes: DbEpisode[]): Promise<Db> {
  const db = create({
    schema: {
      title: "string",
      description: "string",
      path: "string",
    },
  });

  await insertBatch(
    db,
    episodes,
    { batchSize: 500, language: "italian" }
  );

  return db;
}

function cleanupEpisodes(episodes: Episode[]): DbEpisode[] {
  const turndownService = new TurndownService();
  return episodes.map((e) => ({
    title: e.title,
    description: turndownService
      .turndown(e.summary)
      .split("\\")
      .join("")
      .replace(/[${-~!"^\+_`\[\]#]/g, "")
      .split("---")[0],
    path: getSlug(e),
  }));
}

const writeDbToFile = (env: string, db: Db): Promise<any> =>
  fs.writeFile(
    getDbFilename(env),
    JSON.stringify(db)
  );

const getDbFilename = (env: string): string =>
  env === "dev"
    ? `${cfFolder.outDir.pathname}/../search.db.json`
    : `${cfFolder.outDir.pathname}/search.db.json`;

export default () => ({
  name: "GITBAR-ASTRO-LYRA",
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
