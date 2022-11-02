import feedParser, { Episode } from "@podverse/podcast-feed-parser";
import { format, parse, differenceInYears } from "date-fns";
import { it } from "date-fns/locale/index.js";
import slugify from "slugify";
import MarkdownIt from "markdown-it"

const mainTitle = "Gitbar - Il podcast dei developer italiani"
const mainUrl = "https://www.gitbar.it";

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
export const buildEpisodeUrl = (episode: Episode) => mainUrl+"/episodes/" + getSlug(episode);
export const buildSpeakerUrl = (speaker) => mainUrl+"/speakers/" + speaker.nickName;
export const buildHomepageUrl = () => mainUrl;

export const buildStandardMetaObjects = ((metas:Record<string,string>)=> {

    const extendedSeo = {
        link: [
            metas.url? {
                rel: "canonical",
                href: metas.url
            } : null
        ].filter(link=>link !== null),
        meta:[
            {
                name: "author",
                content: "Brainrepo"
            },
            {
                name: "og:type",
                content: "website"
            },
            {
                name: "theme-color",
                content: "#F1C410"
            }
    ]};

    for (const name in metas) {
        const content = metas[name];
        extendedSeo.meta.push({name, content});
        switch(name) {
            case "description" :
                if(!metas.hasOwnProperty("twitter:description")) {
                    extendedSeo.meta.push({
                        name: "twitter:description",
                        content
                    });
                }
                break;
            case "title" :
                if(!metas.hasOwnProperty("twitter:title")) {
                    extendedSeo.meta.push({
                        name: "twitter:title",
                        content
                    });
                }
                break;
            case "url" :
                if(!metas.hasOwnProperty("og:url")) {
                    extendedSeo.meta.push({
                        name: "og:url",
                        content
                    });
                }
               break;
            case "image" :
                if(!metas.hasOwnProperty("og:image")) {
                    extendedSeo.meta.push({
                        name: "og:image",
                        content
                    });
                }
                if(!metas.hasOwnProperty("twitter:image")) {
                    extendedSeo.meta.push({
                        name: "twitter:image",
                        content
                    });
                }
                break;
        }
    }
    return extendedSeo;
})

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

export const getCoHosts = () => {

  const coH = {
    "coHosts": [
      {
        "name": "mattia tommasone",
        "nickName": "raibaz",
        "about": "Software developer focused on business logic, web applications and 3d graphics, but with a broad spectrum of tiny projects realized for myself and friends up to now",
        "imageURL": "/raibaz.png"
      },
      {
        "name": "alessio biancalana",
        "nickName": "dottor blaster",
        "about": "Software developer focused on business logic, web applications and 3d graphics, but with a broad spectrum of tiny projects realized for myself and friends up to now",
        "imageURL": "/dottor-blaster.png"
      },
      {
        "name": "leo rossi",
        "nickName": "leo",
        "about": "Software developer focused on business logic, web applications and 3d graphics, but with a broad spectrum of tiny projects realized for myself and friends up to now",
        "imageURL": "/leo.png"
      },
      {
        "name": "luca",
        "nickName": "chumkiu",
        "about": "Ama definirsi Programmatore, e lo fa dal 2003: reinventa la ruota, assapora la vaniglia ed usa jQuery per riconoscenza.<br>Attualmente impegnato come CTO in una misteriosa startup.<br>Lo appassionano tante cose: dalla comunicazione all'usabilità, passando per la DX, l'Agile e la gestione di prodotto.<br>Appassionato papà, scopre coi suoi figli come fare le cose che avrebbe dovuto imparare da piccolo (come per esempio risolvere il cubo di Rubik).<br>Nel copioso tempo libero, suona la chitarra acustica in fingerpicking, fa ottime pizze napoletane.<br>Il suo prossimo obbiettivo è quello di non farsi più umiliare a scacchi su chess(.)com",
        "imageURL": "/chumkiu.png"
      },
      {
        "name": "carmine",
        "nickName": "guabanal",
        "about": "Software developer focused on business logic, web applications and 3d graphics, but with a broad spectrum of tiny projects realized for myself and friends up to now",
        "imageURL": "/guabanal.png"
      },
      {
        "name": "Andrea Giannantonio",
        "nickName": "JellyBellyDev",
        "about": "Abruzzese DOC ma romano d’adozione, grande appassionato di tecnologia, musica rap, serie tv e buon cibo. Si laurea in Tecnologie Informatiche alla Sapienza di Roma e dal 2008 macina codice in php e js con tanto focus sull'automazione. La sua fame di sapere lo porta ad esplorare sempre nuove tecnologie e metodologie. Negli ultimi anni ha sposato a pieno il tema della developer experience ed è un attivo sostenitore di diverse community e del mondo open source.",
        "imageURL": "/JellyBellyDev.png"
      }
  ]}

  return coH.coHosts;

};
