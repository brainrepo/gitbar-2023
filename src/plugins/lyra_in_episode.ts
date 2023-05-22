import { getSlug, prepareTitle } from "./../utils";
import { getPodcastFeed } from "../utils";
import fs from "fs/promises";
import { AstroConfig } from "astro";
import { create, insertMultiple, save } from "@orama/orama";
import { stemmer } from "@orama/stemmers/italian";

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
  const segments = episodes.map(async (episode) => {
    const episodeNumber = prepareTitle(episode.title)[0];
    try {
      if (Number(episodeNumber) > 130) {
        const json = await import(`../transcriptions/${episodeNumber}.json`);

        const segments = json.segments.map((s) => ({
          title: episode.title,
          path: getSlug(episode),
          from: s.start,
          text: s.text,
          mp3url: episode.enclosure.url,
        }));

        return segments;
      }
    } catch (e) {
      console.log(`Transcription ${episodeNumber} not found`);
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

  await insertMultiple(db, episodes, 500);

  return db;
}

const writeDbToFile = async (env: string, db): Promise<void> => {
  const filename = getDbFilename(env);

  const data = JSON.stringify(await save(db));

  await fs.writeFile(filename, data, {
    encoding: "utf8",
  });
};

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
