// SHAME CODE
// This code should be refined
import { getSlug } from "./../utils";
import { getPodcastFeed } from "../utils";
import fs from "fs/promises";
import { AstroConfig } from "astro";
import { create, insertBatch } from "@lyrasearch/lyra";
import TurndownService from "turndown";

let cfFolder: AstroConfig;

async function initDB(env: string) {
  const { episodes } = await getPodcastFeed(
    "https://www.spreaker.com/show/4173756/episodes/feed"
  );

  const db = create({
    schema: {
      title: "string",
      description: "string",
      path: "string",
    },
  });
  const turndownService = new TurndownService();

  await insertBatch(
    db,
    episodes.map((e) => ({
      title: e.title,
      description: turndownService
        .turndown(e.summary)
        .split("\\")
        .join("")
        .replace(/[${-~!"^\+_`\[\]#]/g, "")
        .split("---")[0],
      path: getSlug(e),
    })),
    { batchSize: 500, language: "italian" }
  );

  const dbFile =
    env === "dev"
      ? `${cfFolder.outDir.pathname}/../search.db.json`
      : `${cfFolder.outDir.pathname}/search.db.json`;
  await fs.writeFile(dbFile, JSON.stringify(db));
}

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
