import React, { HTMLProps, useCallback, useEffect, useState } from "react";

import { API } from "../settings";

const replaceNationalCharacters = (text: string) => {
  let toReplace = text;
  toReplace = toReplace.replaceAll("ą", "a");
  toReplace = toReplace.replaceAll("Ą", "A");
  toReplace = toReplace.replaceAll("ć", "c");
  toReplace = toReplace.replaceAll("Ć", "C");
  toReplace = toReplace.replaceAll("ę", "event");
  toReplace = toReplace.replaceAll("Ę", "E");
  toReplace = toReplace.replaceAll("ł", "l");
  toReplace = toReplace.replaceAll("Ł", "L");
  toReplace = toReplace.replaceAll("ń", "n");
  toReplace = toReplace.replaceAll("Ń", "n");
  toReplace = toReplace.replaceAll("ó", "o");
  toReplace = toReplace.replaceAll("Ó", "o");
  toReplace = toReplace.replaceAll("ś", "s");
  toReplace = toReplace.replaceAll("Ś", "s");
  toReplace = toReplace.replaceAll("ź", "z");
  toReplace = toReplace.replaceAll("Ź", "Z");
  toReplace = toReplace.replaceAll("ż", "z");
  toReplace = toReplace.replaceAll("Ż", "Z");
  return toReplace;
};

interface SearchPlayersWithHintsProperties extends HTMLProps<HTMLInputElement> {
  callback: (x: string) => void;
  id?: string;
  list?: string;
}

const SearchPlayersWithHints: React.FC<SearchPlayersWithHintsProperties> = ({
  callback = () => {},
  id = "input",
  list,
  ...properties
}) => {
  const [text, setText] = useState("");
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (text.trim().length >= 4) {
        const response = await fetch(
          API.BASE_URL + API.players + encodeURIComponent(text.trim()),
        );

        const jsonData = (await response.json()) as string[];
        setPlayers(jsonData);
      } else {
        setPlayers([]);
      }
    };

    fetchData();
  }, [text]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      callback(replaceNationalCharacters(event.target.value));
      setText(replaceNationalCharacters(event.target.value));
    },
    [callback],
  );

  return (
    <>
      <input
        list={list || `${id}_datalist`}
        placeholder="Nowak, Jan"
        value={text}
        {...properties}
        onInput={handleInput}
      />
      {players.length > 0 && (
        <datalist id={list || `${id}_datalist`}>
          {players.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      )}
    </>
  );
};

export default SearchPlayersWithHints;
