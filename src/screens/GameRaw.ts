import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import type { GameData } from "../ChessEditor";
import { game2pgn } from "../components/GamesTable";
import { API } from "../settings";

interface LocationState {
  base?: string;
  gameid?: number;
  list?: number[];
}

const GameRaw = () => {
  const { state } = useLocation() as { state: LocationState };
  const parameters = useParams();

  const base = state?.base || parameters.base || "all";
  const gameid = Number(state?.gameid || parameters.gameid || 0);

  console.log(base, gameid);

  const [pgn, setPgn] = useState<string>("");

  useEffect(() => {
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.whiteSpace = "pre-wrap";
    document.body.style.fontFamily = "monospace";
    document.body.style.fontSize = "14px";
    document.body.style.background = "#000";
    document.body.style.color = "#fff";

    fetch(`${API.BASE_URL + API.game + base}/${gameid}`)
      .then((response) => response.json())
      .then(async (response: GameData[]) => {
        const data =
          response.length > 0
            ? response[0]
            : ({
                Black: "N, N",
                BlackElo: 0,
                Day: "??",
                ECO: "?",
                Event: "?",
                Month: "??",
                moves: [],
                Result: "*",
                Round: "?",
                Site: "?",
                White: "N, N",
                WhiteElo: 0,
                Year: "????",
              } as unknown as GameData);

        const pgnText = await game2pgn(data);
        setPgn(pgnText);
      });
  }, [base, gameid]);

  useEffect(() => {
    if (pgn) {
      document.body.textContent = pgn;
    }
  }, [pgn]);

  useEffect(() => {
    if (!pgn) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      const isSaveShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
      if (isSaveShortcut) {
        event.preventDefault();

        const blob = new Blob([pgn], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "game.pgn";
        a.click();

        URL.revokeObjectURL(url);
      }
    };

    globalThis.addEventListener("keydown", handleKeydown);
    // eslint-disable-next-line consistent-return
    return () => {
      globalThis.removeEventListener("keydown", handleKeydown);
    };
  }, [pgn]);

  return null;
};

export default GameRaw;
