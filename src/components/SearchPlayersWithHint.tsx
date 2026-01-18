import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { deburr } from "es-toolkit";
import { useEffect, useState } from "react";

import { API } from "../settings";

type SearchPlayersWithHintsProperties = {
  readonly callback?: (x: string) => void;
  readonly id?: string;
  readonly label?: string;
  readonly list?: string;
} & TextFieldProps;

const SearchPlayersWithHints: React.FC<SearchPlayersWithHintsProperties> = ({
  callback,
  id = "input",
  label,
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

    void fetchData();
  }, [text]);

  return (
    <>
      <TextField
        fullWidth
        id={id}
        label={label}
        onChange={(event) => {
          if (callback !== undefined) {
            callback(deburr(event.target.value));
          }
          setText(deburr(event.target.value));
        }}
        placeholder="Nowak, Jan"
        slotProps={{ htmlInput: { list: list || `${id}_datalist` } } as const}
        value={text}
        variant="outlined"
        {...properties}
      />
      {players.length > 0 && (
        <datalist id={list || `${id}_datalist`}>
          {players.map((player) => (
            <option key={player} value={player} />
          ))}
        </datalist>
      )}
    </>
  );
};

export default SearchPlayersWithHints;
