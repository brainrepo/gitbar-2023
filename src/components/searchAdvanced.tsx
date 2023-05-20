import { search, create, load } from "@orama/orama";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDuration } from "../utils/time";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Search = () => {
  const [DB, setDB] = useState(null);
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const _db = await create({
        schema: {
          title: "string",
          text: "string",
          from: "number",
          path: "string",
          mp3url: "string",
        },
      });
      setIsLoading(true);
      const resp = await fetch(`/in_episode.db.json`);
      setIsLoading(false);
      const data = await resp.json();
      load(_db, data);
      setDB(_db);
    };

    getData();
  }, []);

  const find = useCallback(
    async (term: string) => {
      setQuery(term);
      const res = (
        await search(DB, {
          term,
          properties: "*",
          limit: 100,
        })
      )?.hits?.map((e) => e.document);

      const groups = res.reduce((groups, item) => {
        const group = groups[item.title] || [];
        group.push(item);
        groups[item.title] = group;
        return groups;
      }, {});
      console.log(groups);
      setResults(groups);
    },
    [DB, setResults]
  );

  return (
    <>
      {!isLoading && (
        <div className="bg-yellow-500  shadow-lg">
          <input
            className="bg-transparent w-full text-white p-6 text-2xl outline-yellow-300 outline-3 placeholder:text-yellow-300"
            placeholder="Cerca..."
            onChange={(e) => console.log(find(e.target.value))}
          />
        </div>
      )}

      {!isLoading && query.length ? (
        <div className="sticky top-[70px]">
          <AudioPlayer
            ref={playerRef}
            autoPlay
            src="http://example.com/audio.mp3"
            onPlay={(e) => console.log("onPlay")}
            // other props here
          />
        </div>
      ) : null}

      {isLoading && (
        <div className="p-6 m-6 rounded text-slate-800 bg-slate-100 text-lg text-center animate-bounce">
          Caricamento dei dati di ricerca, il caricamento potrebbe metterci un
          po...
        </div>
      )}

      {query.length > 0 &&
        (results ? (
          <ul className="p-3 space-y-6 mb-[100px]">
            {Object.keys(results)?.map((g) => (
              <li className="shadow-lg rounded border border-gray-100 overflow-hidden">
                <div className=" font-bold text-lg text-white p-3 bg-yellow-500 rounded-t">
                  {g}
                </div>
                <ul>
                  {results[g].map((e) => (
                    <li className="p-3 " key={e.from + e.mp3url}>
                      <button
                        onClick={() => {
                          playerRef.current.audio.current.src = e.mp3url;
                          playerRef.current.audio.current.currentTime = e.from;
                        }}
                        className="space-y-2 w-full text-left"
                      >
                        <div className="rounded overflow-hidden">
                          <div className="text-sm font-bold bg-slate-800 rounded-tr text-slate-50 p-2 flex items-center ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                              />
                            </svg>

                            {formatDuration(e.from)}
                          </div>
                          <div
                            className="text-sm bg-slate-100 p-2 rounded-tr  flex-grow"
                            dangerouslySetInnerHTML={{
                              __html: `... ${e.text.replace(
                                new RegExp(query, "ig"),
                                `<span class="bg-yellow-100">${query}</span>`
                              )} ... `,
                            }}
                          ></div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-slate-800  shadow-lg text-slate-50">
            Nessun risultato trovato
          </div>
        ))}

      {!isLoading && !query.length ? (
        <div className="p-6 m-6 rounded text-slate-800 bg-slate-100 text-lg text-center lg:animate-bounce">
          Inizia a cercare, abbiamo indicizzato tutte le parole pronunciate
          all'interno delle nostre puntate. Attualmente solo le ultime puntate
          sono ricercabili, stiamo continuamente trascrivendo a ritroso fino ad
          arrivare alla puntata 1.
        </div>
      ) : null}
    </>
  );
};
export default Search;
