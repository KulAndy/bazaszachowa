import "./PreparationPlayer.css";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ChessEditor, { GameData } from "../ChessEditor";
import LinkGamesTable from "../components/LinkGamesTable";
import PositionMoves, { StatsItem } from "../components/PositionsMoves";
import TrendFunctionExplanation from "../components/TrendFunctionExplanation";
import { useI18n } from "../i18n/I18nContext";
import { API, NOMENU_URLS } from "../settings";

import ChessProcessor from "./../ChessProcessor";

const processor = new ChessProcessor();

const debounce = <T extends unknown[]>(
  callback: (...arguments_: T) => void,
  delay: number,
): ((...arguments_: T) => void) => {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...arguments_: T): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...arguments_);
    }, delay);
  };
};

const PreparationPlayer = ({
  color,
  player,
}: {
  color: string;
  player: string;
}) => {
  const { t } = useI18n();
  const [games, setGames] = useState<GameData[]>([]);
  const [tree, setTree] = useState<StatsItem[]>([]);
  const [fen, setFen] = useState<string | undefined>();

  const [doMove, setDoMove] = useState(() => () => {});
  const [gamesFilter, setGamesFilter] = useState<number[]>([]);
  const [notationLayout, setNotationLayout] = useState(
    window.innerHeight > window.innerWidth ||
      Math.max(window.innerWidth, window.innerHeight) <= 768
      ? "bottom"
      : "right",
  );

  const [boardSize, setBoardSize] = useState(() =>
    Math.min(
      350,
      window.innerWidth * 0.9,
      window.innerHeight -
        10 *
          Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          ),
    ),
  );

  const loadGames = useCallback(
    async (currentPlayer: string, currentColor: string) => {
      const response = await fetch(
        `${API.BASE_URL}${API.games.filter}${encodeURIComponent(
          currentPlayer,
        )}/${currentColor}`,
      );
      const data = (await response.json()) as GameData[];
      processor.clear();

      processor.getTree(data);

      const fens = processor.searchFEN(fen);

      setGames(data);
      setTree(fens.moves);
      setGamesFilter(fens.indexes);
    },
    [fen],
  );

  useEffect(() => {
    if (games.length > 0 && !processor.isCompleted) {
      processor.completeTree();
    }
  }, [games, loadGames]);

  useEffect(() => {
    loadGames(player, color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, color]);

  useEffect(() => {
    if (!fen || games.length === 0) {
      return;
    }

    const fetchedFens = processor.searchFEN(fen);
    setTree(fetchedFens.moves);
    setGamesFilter(fetchedFens.indexes);
  }, [fen, games.length]);

  useEffect(() => {
    const handleResize = () => {
      setBoardSize((previousSize) =>
        Math.min(
          Math.max(previousSize, 100),
          window.innerWidth * 0.9,
          window.innerHeight -
            10 *
              Number.parseFloat(
                getComputedStyle(document.documentElement).fontSize,
              ),
        ),
      );

      setNotationLayout(
        window.innerHeight > window.innerWidth ||
          Math.max(window.innerWidth, window.innerHeight) <= 768
          ? "bottom"
          : "right",
      );
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      let id = "";
      if (event.ctrlKey) {
        switch (event.code) {
          case "ArrowDown": {
            id = "#first_link";
            break;
          }
          case "ArrowLeft": {
            id = "#previous_link";
            break;
          }
          case "ArrowRight": {
            id = "#next_link";
            break;
          }
          case "ArrowUp": {
            id = "#last_link";
            break;
          }
          default: {
            return;
          }
        }
      }
      const element: HTMLButtonElement | null = document.querySelector(id);
      element?.click();
    };

    const resizeListener = debounce(handleResize, 200);
    const keyListener = debounce(handleKeyPress, 200);

    window.addEventListener("resize", resizeListener);
    globalThis.addEventListener("keydown", keyListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
      globalThis.removeEventListener("keydown", keyListener);
    };
  }, []);

  return (
    <div id="preparation">
      <h1>
        <Link to={NOMENU_URLS.profile + encodeURIComponent(player)}>
          {player}
        </Link>{" "}
        - {t("preparation.against")} {t(color)}
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: notationLayout === "bottom" ? "column-reverse" : "row",
        }}
      >
        <ChessEditor
          boardSize={boardSize}
          notationLayout={notationLayout}
          profileUrl={NOMENU_URLS.profile}
          setDoMove={setDoMove}
          setFen={setFen}
          showPlayers={false}
          zoomIn={() => {
            setBoardSize((previousSize) =>
              Math.min(
                previousSize + 25,
                Math.min(window.innerWidth, window.innerHeight),
              ),
            );
          }}
          zoomOut={() => {
            setBoardSize((previousSize) => Math.max(previousSize - 25, 100));
          }}
        />
        <div>
          <div
            style={{
              alignItems: notationLayout === "bottom" ? "center" : "flex-start",
              display: "flex",
              flexDirection:
                notationLayout === "bottom" ? "column-reverse" : "column",
              justifyContent: "flex-start",
              maxHeight: boardSize,
              overflow: "auto",
            }}
          >
            {games.length === 0 ? (
              <div>
                <div className="loading">
                  <div className="spin"></div>
                  <p>{t("player.loading_stats")} </p>
                </div>
              </div>
            ) : (
              <>
                <PositionMoves
                  doMove={doMove}
                  stats={tree}
                  style={{
                    maxHeight: boardSize / 2,
                    overflow: "auto",
                  }}
                />
                <LinkGamesTable
                  games={games.filter((game) => gamesFilter.includes(game.id))}
                  noEmpty={true}
                  style={{
                    maxHeight: boardSize / 2,
                    overflow: "auto",
                  }}
                />
              </>
            )}
          </div>
          <TrendFunctionExplanation />
        </div>
      </div>
    </div>
  );
};

export default PreparationPlayer;
