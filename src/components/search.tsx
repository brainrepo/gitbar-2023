import { search, create, load, Lyra, Data } from "@lyrasearch/lyra";
import { useCallback, useEffect, useState } from "react";

const Search = () => {
  const [DB, setDB] = useState<
    Lyra<{
      title: "string";
      description: "string";
      path: "string";
    }>
  >(null);
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const _db = create({
      schema: { title: "string", description: "string", path: "string" },
      edge: true,
    });

    const getData = async () => {
      const resp = await fetch(`/search.db.json`);
      const data = (await resp.json()) as Data<{
        title: "string";
        description: "string";
        path: "string";
      }>;
      load(_db, data);
      setDB(_db);
    };

    getData();
  }, []);

  const find = useCallback(
    (term: string) => {
      setQuery(term);
      const res = search(DB, {
        term,
        properties: "*",
      })?.hits?.map((e) => e.document);
      setResults(res);
    },
    [DB, setResults]
  );

  return (
    <>
      <div className="bg-yellow-500  shadow-lg">
        <input
          className="bg-transparent w-full text-white p-6 text-2xl outline-yellow-300 outline-3 placeholder:text-yellow-300"
          placeholder="Cerca..."
          onChange={(e) => console.log(find(e.target.value))}
        />
      </div>
      {query.length > 0 &&
        (results.length ? (
          <div className="bg-slate-800  shadow-lg">
            <ul className="p-3">
              {results?.map((e) => (
                <li className="p-3 text-slate-50 hover:text-yellow-500">
                  <a href={`/episodes/${e.path}`}>{e.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-slate-800  shadow-lg text-slate-50">
            Nessun risultato trovato
          </div>
        ))}
    </>
  );
};
export default Search;
