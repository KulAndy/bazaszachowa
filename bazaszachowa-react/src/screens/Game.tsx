import "../styles/Game.scss";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import ChessEditor, { type GameData } from "../ChessEditor";
import Content from "../components/Content";
import StockfishAnalysis from "../components/StockfishAnalysis";
import { useI18n } from "../i18n/I18nContext";
import { API, NOMENU_URLS } from "../settings";

interface LocationState {
  base?: string;
  gameid?: number;
  list?: number[];
}

const Game = () => {
  const { t } = useI18n();
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();
  const parameters = useParams();

  const base = state?.base || parameters.base || "all";
  const gameid = Number(state?.gameid || parameters.gameid || 0);
  const list = state?.list || [];

  const [data, setData] = useState<GameData | null>(null);

  const [fen, setFen] = useState<string | undefined>();
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
  const [notationLayout, setNotationLayout] = useState(
    window.innerHeight > window.innerWidth ||
      Math.max(window.innerWidth, window.innerHeight) <= 768
      ? "bottom"
      : "right",
  );

  const updateWindowSize = () => {
    setNotationLayout(
      window.innerHeight > window.innerWidth ||
        Math.max(window.innerWidth, window.innerHeight) <= 768
        ? "bottom"
        : "right",
    );
  };

  useEffect(() => {
    fetch(`${API.BASE_URL + API.game + base}/${gameid}`)
      .then((response) => response.json())
      .then((response: GameData[]) => {
        if (response.length > 0) {
          setData(response[0]);
        }
      });
  }, [base, gameid]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let index = -1;
      if (event.ctrlKey && list.length > 0) {
        switch (event.code) {
          case "ArrowDown": {
            index = 0;
            break;
          }
          case "ArrowLeft": {
            index = list.indexOf(gameid) - 1;
            break;
          }
          case "ArrowRight": {
            index = list.indexOf(gameid) + 1;
            if (index >= list.length) {
              index = -1;
            }
            break;
          }
          case "ArrowUp": {
            index = list.length - 1;
            break;
          }
          default: {
            break;
          }
        }
      }
      if (index > -1) {
        navigate(`${NOMENU_URLS.game}${base}/${list[index]}`, {
          state: {
            base,
            gameid: list[index],
            list,
          },
        });
      }
    };

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

    globalThis.addEventListener("keydown", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, gameid, list]);

  const firstGame = list.indexOf(gameid) <= 0;
  const lastGame = list.indexOf(gameid) >= list.length - 1;

  const goFirst = useCallback(
    (event: React.MouseEvent) => {
      if (firstGame) {
        event.preventDefault();
      }
    },
    [firstGame],
  );

  const goPrevious = useCallback(
    (event: React.MouseEvent) => {
      if (firstGame) {
        event.preventDefault();
      }
    },
    [firstGame],
  );

  const goNext = useCallback(
    (event: React.MouseEvent) => {
      if (lastGame) {
        event.preventDefault();
      }
    },
    [lastGame],
  );

  const goLast = useCallback(
    (event: React.MouseEvent) => {
      if (lastGame) {
        event.preventDefault();
      }
    },
    [lastGame],
  );

  const handleZoomIn = useCallback(() => {
    setBoardSize((previousSize) =>
      Math.min(
        previousSize + 25,
        window.innerWidth * 0.9,
        window.innerHeight -
          10 *
            Number.parseFloat(
              getComputedStyle(document.documentElement).fontSize,
            ),
      ),
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    setBoardSize((previousSize) => Math.max(previousSize - 25, 100));
  }, []);

  return (
    <div id="game">
      <Content>
        <div>
          <button className="error">
            <Link to={`${NOMENU_URLS.bug + base}/${gameid}`}>
              {t("report_bug")}
            </Link>
          </button>
        </div>
        <div id="button-container">
          <Link
            id="first-link"
            onClick={goFirst}
            state={
              {
                base,
                gameid: list[0],
                list,
              } as const
            }
            to={`${NOMENU_URLS.game}${base}/${list[0]}`}
          >
            <button disabled={firstGame} id="first" title="Ctrl + ↑  ">
              {t("first_game")}
            </button>
          </Link>
          <Link
            id="previous-link"
            onClick={goPrevious}
            state={
              {
                base,
                gameid: list[list.indexOf(gameid) - 1],
                list,
              } as const
            }
            to={`${NOMENU_URLS.game}${base}/${list[list.indexOf(gameid) - 1]}`}
          >
            <button disabled={firstGame} id="previous" title="Ctrl + ←">
              {t("prev_game")}
            </button>
          </Link>
          <Link
            id="next-link"
            onClick={goNext}
            state={
              {
                base,
                gameid: list[list.indexOf(gameid) + 1],
                list,
              } as const
            }
            to={`${NOMENU_URLS.game}${base}/${list[list.indexOf(gameid) + 1]}`}
          >
            <button disabled={lastGame} id="next" title="Ctrl + →">
              {t("next_game")}
            </button>
          </Link>
          <Link
            id="last-link"
            onClick={goLast}
            state={
              {
                base,
                gameid: list.at(-1),
                list,
              } as const
            }
            to={`${NOMENU_URLS.game}${base}/${list.at(-1) || 0}`}
          >
            <button disabled={lastGame} id="last" title="Ctrl + ↓">
              {t("last_game")}
            </button>
          </Link>
        </div>
        <div id="board-analysis">
          <ChessEditor
            boardSize={boardSize}
            data={data}
            notationLayout={notationLayout}
            notationSwitch={true}
            profileUrl={NOMENU_URLS.profile}
            // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
            setDoMove={() => {}}
            setFen={setFen}
            setNotationLayout={setNotationLayout}
            zoomIn={handleZoomIn}
            zoomOut={handleZoomOut}
          />
          {fen ? (
            <StockfishAnalysis fen={fen} visible={notationLayout === "none"} />
          ) : null}
        </div>
      </Content>
    </div>
  );
};

export default Game;
