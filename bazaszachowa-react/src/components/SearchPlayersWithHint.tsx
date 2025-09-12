import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";

import { API } from "../settings";

const replaceNationalCharacters = (text: string) => {
  return text
    .replaceAll("ą", "a")
    .replaceAll("Ą", "A")
    .replaceAll("ć", "c")
    .replaceAll("Ć", "C")
    .replaceAll("ę", "e")
    .replaceAll("Ę", "E")
    .replaceAll("ł", "l")
    .replaceAll("Ł", "L")
    .replaceAll("ń", "n")
    .replaceAll("Ń", "N")
    .replaceAll("ó", "o")
    .replaceAll("Ó", "O")
    .replaceAll("ś", "s")
    .replaceAll("Ś", "S")
    .replaceAll("ź", "z")
    .replaceAll("Ź", "Z")
    .replaceAll("ż", "z")
    .replaceAll("Ż", "Z");
};

type SearchPlayersWithHintsProperties = {
  readonly callback: (x: string) => void;
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

    fetchData();
  }, [text]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      callback(replaceNationalCharacters(event.target.value));
      setText(replaceNationalCharacters(event.target.value));
    },
    [callback],
  );

  return (
    <>
      <TextField
        fullWidth
        id={id}
        label={label}
        onChange={handleChange}
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
