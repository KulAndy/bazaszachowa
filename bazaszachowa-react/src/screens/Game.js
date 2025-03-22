import "./Game.css";
import React, { useState, useEffect } from "react";
import Content from "../components/Content";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";

import ChessEditor from "../ChessEditor";
import { API, NOMENU_URLS } from "../settings";
import StockfishAnalysis from "../components/StockfishAnalysis";

const Game = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const base = state?.base || params.base || "all";
  const gameid = state?.gameid || params.gameid || 0;
  const list = state?.list || [];

  const [data, setData] = useState(null);

  const [fen, setFen] = useState();
  // eslint-disable-next-line
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
    fetch(API.BASE_URL + API.game + base + "/" + gameid)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setData(data[0]);
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, gameid]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      let index = -1;
      if (e.ctrlKey && list.length > 0) {
        switch (e.code) {
          case "ArrowLeft":
            index = list.indexOf(gameid) - 1;
            break;
          case "ArrowDown":
            index = 0;
            break;
          case "ArrowRight":
            index = list.indexOf(gameid) + 1;
            if (index >= list.length) {
              index = -1;
            }
            break;
          case "ArrowUp":
            index = list.length - 1;
            break;
          default:
            break;
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
      setBoardSize((prevSize) =>
        Math.min(
          Math.max(prevSize, 100),
          window.innerWidth * 0.9,
          window.innerHeight -
            10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
        )
      );
      setNotationLayout(
        window.innerHeight > window.innerWidth ||
          Math.max(window.innerWidth, window.innerHeight) <= 768
          ? "bottom"
          : "right"
      );
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, gameid, list]);

  const firstGame = list.indexOf(gameid) <= 0;
  const lastGame = list.indexOf(gameid) >= list.length - 1;

  return (
    <div id="game">
      <Content>
        <div>
          <button className="error">
            <Link to={NOMENU_URLS.bug + base + "/" + gameid}>Zgłoś błąd</Link>
          </button>
        </div>
        <div id="buttonContainer">
          <Link
            to={`${NOMENU_URLS.game}${base}/${list[0]}`}
            state={{
              base,
              gameid: list[0],
              list,
            }}
            id="first_link"
            onClick={(e) => {
              if (firstGame) {
                e.preventDefault();
              }
            }}
          >
            <button id="first" title="Ctrl + ↑  " disabled={firstGame}>
              pierwsza partia
            </button>
          </Link>
          <Link
            to={`${NOMENU_URLS.game}${base}/${list[list.indexOf(gameid) - 1]}`}
            state={{
              base,
              gameid: list[list.indexOf(gameid) - 1],
              list,
            }}
            id="previous_link"
            onClick={(e) => {
              if (firstGame) {
                e.preventDefault();
              }
            }}
          >
            <button id="previous" title="Ctrl + ←" disabled={firstGame}>
              poprzednia partia
            </button>
          </Link>
          <Link
            to={`${NOMENU_URLS.game}${base}/${list[list.indexOf(gameid) + 1]}`}
            state={{
              base,
              gameid: list[list.indexOf(gameid) + 1],
              list,
            }}
            id="next_link"
            onClick={(e) => {
              if (lastGame) {
                e.preventDefault();
              }
            }}
          >
            <button id="next" title="Ctrl + →" disabled={lastGame}>
              następna partia
            </button>
          </Link>
          <Link
            to={`${NOMENU_URLS.game}${base}/${list[list.length - 1]}`}
            state={{
              base,
              gameid: list[list.length - 1],
              list,
            }}
            id="last_link"
            onClick={(e) => {
              if (lastGame) {
                e.preventDefault();
              }
            }}
          >
            <button id="last" title="Ctrl + ↓" disabled={lastGame}>
              ostatnia partia
            </button>
          </Link>
        </div>
        <div id="board_analysis">
          <ChessEditor
            setFen={setFen}
            setDoMove={setDoMove}
            data={data}
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
                  window.innerWidth * 0.9,
                  window.innerHeight -
                    10 *
                      parseFloat(
                        getComputedStyle(document.documentElement).fontSize
                      )
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
