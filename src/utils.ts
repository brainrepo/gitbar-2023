import feedParser, { Episode } from "@podverse/podcast-feed-parser";
import { format, parse, differenceInYears } from "date-fns";
import { it } from "date-fns/locale/index.js";
import slugify from "slugify";
import MarkdownIt from "markdown-it"

const mainTitle = "Gitbar - Il podcast dei developer italiani"

export const getSpreakerId = (episode: Episode) =>
  episode.guid.replace("https://api.spreaker.com/episode/", "");

export const getSeason = (episode: Episode) =>
  differenceInYears(new Date(episode.pubDate), new Date("2020-01-01")) + 1;

export const getSlug = (episode: Episode) =>
  `${slugify(episode.title, {
    remove: /[*+~.()'"!\?,:@]/g,
    lower: true, // convert to lower case, defaults to `false`
    strict: false,
  })}`;

export const getLegacySlug = (episode: Episode) =>
  `${slugify(
    episode.link.replace("https://www.spreaker.com/user/brainrepo/", ""),
    {
      remove: /[*+~.()'"!\?,:@]/g,
      lower: true, // convert to lower case, defaults to `false`
      strict: false,
    }
  )}`;

export const prepareTitle = (title: string) => {
  const [epNum, ...rest] = title.split(" - ");
  return [epNum.substring(3), rest.join("")];
};

export const sortEpisodes = (episodes: Episode[]) => {
  return episodes.sort((a, b) => {
    const aDate = new Date(a.pubDate);
    const bDate = new Date(b.pubDate);

    return aDate > bDate ? -1 : 1;
  });
};

export const formatDuration = (duration: number): string => {
  return new Intl.DateTimeFormat("it-it", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  }).format(new Date(Math.round(duration) * 1000));
};

export const getPodcastFeed = async (url: string) => {
  const feed = await feedParser.getPodcastFromURL(
    { url },
    {
      required: {
        episodes: ["guid"],
      },
    }
  );

  return { ...feed, episodes: sortEpisodes(feed.episodes) /*.slice(0, 10)*/ };
};

export const formatDate = (pubDate: string): string =>
  format(new Date(pubDate), "EEEE, do MMMM yyyy 'ore' k:kk", {
    locale: it,
  });

export const buildTitle = (...pageTitles:string[]) => [...pageTitles, mainTitle].filter(item=>item!=="").join(" | ");
export const optimizeMetadescription = (description: string) => {
    if(description.split("##").length > 1) {
        return description.split("##")[0].replace(/<.*?\/>/g, "")
    }
    return description.split(".")[0].replace(/<.*?\/>/g, "")
};


const markdownInstance =  MarkdownIt({
    html:true,
    breaks:true
})
export const markdown = (mdText:string)=> {
    mdText = mdText.replace(/<br \/>/g, "\n");
    return markdownInstance.render(mdText)
        .replace(/<h2>/g, "<h2 class=\"text-slate-800 text-3xl leading-loose\">")
        .replace(/<p>/g, "<p class=\"text-slate-800 leading-relaxed\">");
}
