import React, { useState, useEffect, HTMLProps } from "react";
import { API } from "../settings";

const replaceNationalCharacters = (text: string) => {
  let toReplace = text;
  toReplace = toReplace.replace(/ą/g, "a");
  toReplace = toReplace.replace(/Ą/g, "A");
  toReplace = toReplace.replace(/ć/g, "c");
  toReplace = toReplace.replace(/Ć/g, "C");
  toReplace = toReplace.replace(/ę/g, "e");
  toReplace = toReplace.replace(/Ę/g, "E");
  toReplace = toReplace.replace(/ł/g, "l");
  toReplace = toReplace.replace(/Ł/g, "L");
  toReplace = toReplace.replace(/ń/g, "n");
  toReplace = toReplace.replace(/Ń/g, "n");
  toReplace = toReplace.replace(/ó/g, "o");
  toReplace = toReplace.replace(/Ó/g, "o");
  toReplace = toReplace.replace(/ś/g, "s");
  toReplace = toReplace.replace(/Ś/g, "s");
  toReplace = toReplace.replace(/ź/g, "z");
  toReplace = toReplace.replace(/Ź/g, "Z");
  toReplace = toReplace.replace(/ż/g, "z");
  toReplace = toReplace.replace(/Ż/g, "Z");
  return toReplace;
};

interface SearchPlayersWithHintsProps extends HTMLProps<HTMLInputElement> {
  id?: string;
  list?: string;
  f: Function;
}

const SearchPlayersWithHints: React.FC<SearchPlayersWithHintsProps> = ({
  id = "input",
  list,
  f = () => {},
  ...props
}) => {
  const [text, setText] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (text.trim().length >= 4) {
        const response = await fetch(
          API.BASE_URL + API.players + encodeURIComponent(text.trim())
        );

        const jsonData = await response.json();
        setPlayers(jsonData);
      } else {
        setPlayers([]);
      }
    };

    fetchData();
  }, [text]);
  return (
    <>
      <input
        placeholder="Nowak, Jan"
        value={text}
        list={list || id + "_datalist"}
        {...props}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          f(replaceNationalCharacters(e.target.value));
          setText(replaceNationalCharacters(e.target.value));
        }}
      />
      {players.length > 0 && (
        <datalist id={list || id + "_datalist"}>
          {players.map((item) => (
            <option value={item} />
          ))}
        </datalist>
      )}
    </>
  );
};

export default SearchPlayersWithHints;
