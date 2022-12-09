import feedParser, { Episode } from "@podverse/podcast-feed-parser";
import { format, parse, differenceInYears } from "date-fns";
import { it } from "date-fns/locale/index.js";
import slugify from "slugify";
import MarkdownIt from "markdown-it";

const mainTitle = "Gitbar - Il podcast dei developer italiani";

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
  format(new Date(pubDate), "EEEE, do MMMM yyyy 'ore' k:mm", {
    locale: it,
  });

export const buildTitle = (...pageTitles: string[]) =>
  [...pageTitles, mainTitle].filter((item) => item !== "").join(" | ");
export const optimizeMetadescription = (description: string) => {
  if (description.split("##").length > 1) {
    return description.split("##")[0].replace(/<.*?\/>/g, "");
  }
  return description.split(".")[0].replace(/<.*?\/>/g, "");
};

export const getCoHosts = () => {
  return [
    {
      name: "Mauro Murru",
      nickName: "brainrepo",
      about: `Founder e Host di Gitbar, vive tra le baguette di Lione e le spiagge della Sardegna, oltre ad essere un giornalista iscritto all'albo è un senior software engineer a Nearform. Spende le sue giornate a cercare analogie e trovare collegamenti tra cose che non c'entrano niente tra loro.`,
      imageURL: "/mauro.png",
    },
    {
      name: "Luca Rainone",
      nickName: "chumkiu",
      about:
        "Ama definirsi Programmatore, e lo fa dal 2003: reinventa la ruota, assapora la vaniglia ed usa jQuery per riconoscenza.<br>Attualmente impegnato come CTO in una misteriosa startup.<br>Lo appassionano tante cose: dalla comunicazione all'usabilità, passando per la DX, l'Agile e la gestione di prodotto.<br>Appassionato papà, scopre coi suoi figli come fare le cose che avrebbe dovuto imparare da piccolo (come per esempio risolvere il cubo di Rubik).<br>Nel copioso tempo libero, suona la chitarra acustica in fingerpicking, fa ottime pizze napoletane.<br>Il suo prossimo obbiettivo è quello di non farsi più umiliare a scacchi su chess(.)com",
      imageURL: "/chumkiu.png",
    },
    {
      name: "Mattia Tommasone",
      nickName: "raibaz",
      about:
        "Vuoi sapere di più su di me? Tra qualche giorno troverai una mia bio. Promesso!",
      imageURL: "/raibaz.png",
    },
    {
      name: "Carmine Di Monaco",
      nickName: "guabanal",
      about:
        "Vuoi sapere di più su di me? Tra qualche giorno troverai una mia bio. Promesso!",
      imageURL: "/guabanal.png",
    },
    {
      name: "Alessio Biancalana",
      nickName: "dottorblaster",
      about:
        "Vuoi sapere di più su di me? Tra qualche giorno troverai una mia bio. Promesso!",
      imageURL: "/dottor-blaster.png",
    },
    {
      name: "Leonardo Rossi",
      nickName: "leorossi",
      about:
        "100% carne Fiorentina.<br/>Quando non scrivo codice ascolto podcast in bicicletta, oppure gioco a Padel. <br/>Sono un fan del git rebase.<br/>Preferisco il vino alla birra.",
      imageURL: "/leo.png",
    },

    {
      name: "Andrea Giannantonio",
      nickName: "jellybellydev",
      about:
        "Abruzzese DOC ma romano d’adozione, grande appassionato di tecnologia, musica rap, serie tv e buon cibo. Si laurea in Tecnologie Informatiche alla Sapienza di Roma e dal 2008 macina codice in php e js con tanto focus sull'automazione. La sua fame di sapere lo porta ad esplorare sempre nuove tecnologie e metodologie. Negli ultimi anni ha sposato a pieno il tema della developer experience ed è un attivo sostenitore di diverse community e del mondo open source.",
      imageURL: "/JellyBellyDev.png",
    },
  ];
};

export const getGuestName = (e : Episode) => {

  const split : string = e.title.split("con ")?.[1];

  return split?.match('[A-Z]{1}[a-z]* [A-Z]{1}[a-z]* \(.*\)')?.[0] ?
    split?.match('[A-Z]{1}[a-z]* [A-Z]{1}[a-z]* \(.*\)')?.[0] :
    split?.match('[A-Z]{1}[a-z]* [A-Z]{1}[a-z]*')?.[0];

};