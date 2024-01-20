import "./Game.css";
import React, { useState, useEffect } from "react";
import Content from "../components/Content";
import { useLocation, useParams, Link } from "react-router-dom";

import ChessEditor from "../ChessEditor";
import { NOMENU_URLS } from "../settings";
import StockfishAnalysis from "../components/StockfishAnalysis";

const Game = () => {
  const { state } = useLocation();
  const params = useParams();

  const base = state?.base || params.base || "all";
  const gameid = state?.gameid || params.gameid || 0;
  const list = state?.list || [];

  const [pgn, setPgn] = useState(null);

  const [fen, setFen] = useState();
  const [doMove, setDoMove] = useState(null);
  const [boardSize, setBoardSize] = useState(
    Math.min(
      350,
      window.innerWidth * 0.9,
      window.innerHeight -
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    )
  );
  const [notationLayout, setNotationLayout] = useState(
    window.innerHeight > window.innerWidth ||
      Math.max(window.innerWidth, window.innerHeight) <= 768
      ? "bottom"
      : "right"
  );

  const updateWindowSize = () => {
    Math.min(
      400,
      window.innerWidth * 0.9,
      window.innerHeight -
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
    setNotationLayout(
      window.innerHeight > window.innerWidth ||
        Math.max(window.innerWidth, window.innerHeight) <= 768
        ? "bottom"
        : "right"
    );
  };

  useEffect(() => {
    const handleResize = () => {
      updateWindowSize();
    };

    window.addEventListener("resize", handleResize);

    const handleKeyPress = (e) => {
      if (e.ctrlKey) {
        switch (e.code) {
          case "ArrowLeft":
            document.getElementById("previous_link").click();
            break;
          case "ArrowDown":
            document.getElementById("first_link").click();
            break;
          case "ArrowRight":
            document.getElementById("next_link").click();
            break;
          case "ArrowUp":
            document.getElementById("last_link").click();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    fetch(NOMENU_URLS.game_raw + base + "/" + gameid)
      .then((response) => response.text())
      .then((data) => {
        setPgn(data);
      });
  }, [state, base, gameid, list]);

  return (
    <div id="game">
      <Content>
        <div>
          <button className="error">
            <Link to={NOMENU_URLS.bug + base + "/" + gameid}>Zgłoś błąd</Link>
          </button>
        </div>
        <div id="buttonContainer">
          <button
            id="first"
            title="Ctrl + ↑  "
            disabled={list.indexOf(gameid) <= 0}
          >
            {list.indexOf(gameid) <= 0 ? (
              <>pierwsza partia</>
            ) : (
              <Link
                to={`${NOMENU_URLS.game}${base}/${list[0]}`}
                state={{
                  base,
                  gameid: list[0],
                  list,
                }}
                id="first_link"
              >
                pierwsza partia
              </Link>
            )}
          </button>
          <button
            id="previous"
            title="Ctrl + ←"
            disabled={list.indexOf(gameid) === 0}
          >
            {list.indexOf(gameid) <= 0 ? (
              <>poprzednia partia</>
            ) : (
              <Link
                to={`${NOMENU_URLS.game}${base}/${
                  list[list.indexOf(gameid) - 1]
                }`}
                state={{
                  base,
                  gameid: list[list.indexOf(gameid) - 1],
                  list,
                }}
                id="previous_link"
              >
                poprzednia partia
              </Link>
            )}
          </button>
          <button
            id="next"
            title="Ctrl + →"
            disabled={list.indexOf(gameid) === list.length - 1}
          >
            {list.indexOf(gameid) === list.length - 1 ? (
              <>następna partia</>
            ) : (
              <Link
                to={`${NOMENU_URLS.game}${base}/${
                  list[list.indexOf(gameid) + 1]
                }`}
                state={{
                  base,
                  gameid: list[list.indexOf(gameid) + 1],
                  list,
                }}
                id="next_link"
              >
                następna partia
              </Link>
            )}
          </button>
          <button
            id="last"
            title="Ctrl + ↓"
            disabled={list.indexOf(gameid) === list.length - 1}
          >
            {list.indexOf(gameid) === list.length - 1 ? (
              <>ostatnia partia</>
            ) : (
              <Link
                to={`${NOMENU_URLS.game}${base}/${list[list.length - 1]}`}
                state={{
                  base,
                  gameid: list[list.length - 1],
                  list,
                }}
                id="last_link"
              >
                ostatnia partia
              </Link>
            )}
          </button>
        </div>
        <div id="board_analysis">
          <ChessEditor
            setFen={setFen}
            setDoMove={setDoMove}
            pgn={pgn}
            boardSize={boardSize}
            notationLayout={notationLayout}
            setNotationLayout={setNotationLayout}
            profileUrl={NOMENU_URLS.profile}
            zoomOut={() => {
              setBoardSize((prevSize) => Math.max(prevSize - 25, 100));
            }}
            zoomIn={() => {
              setBoardSize((prevSize) =>
                Math.min(
                  prevSize + 25,
                  Math.min(window.innerWidth, window.innerHeight)
                )
              );
            }}
            notationSwitch={true}
          />
          <StockfishAnalysis fen={fen} visible={notationLayout === "none"} />
        </div>
      </Content>
    </div>
  );
};

export default Game;
