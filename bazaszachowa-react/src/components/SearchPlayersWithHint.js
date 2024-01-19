import React, { useState, useEffect } from "react";
import { API } from "../settings";

const replaceNationalCharacters = (text) => {
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

const SearchPlayersWithHints = (props) => {
  const id = props.id || "input";
  props.list = props.list || id + "_datalist";
  const f = props.f ? props.f : () => {};
  const [text, setText] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (text.trim().length >= 4) {
          const response = await fetch(
            API.BASE_URL + API.players + encodeURIComponent(text.trim())
          );

          const jsonData = await response.json();
          setPlayers(jsonData);
        } else {
          setPlayers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [text]);
  return (
    <>
      <input
        {...props}
        onInput={(e) => {
          f(replaceNationalCharacters(e.target.value));
          setText(replaceNationalCharacters(e.target.value));
        }}
      />
      {players.length > 0 && (
        <datalist id={props.list}>
          {players.map((item) => (
            <option value={item} />
          ))}
        </datalist>
      )}
    </>
  );
};

export default SearchPlayersWithHints;
