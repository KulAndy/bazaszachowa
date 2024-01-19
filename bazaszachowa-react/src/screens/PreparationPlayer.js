import "./PreparationPlayer.css";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import ChessEditor from "../ChessEditor";
import ChessProcessor from "./../ChessProcessor";
import { NOMENU_URLS, API } from "../settings";
import PositionMoves from "../components/PositionsMoves";
import LinkGamesTable from "../components/LinkGamesTable";

const processor = new ChessProcessor();

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const PreparationPlayer = ({ player, color }) => {
  const [games, setGames] = useState([]);
  const [tree, setTree] = useState([]);
  const [fen, setFen] = useState();
  const [doMove, setDoMove] = useState(() => {});
  const [gamesFilter, setGamesFilter] = useState([]);
  const [notationLayout, setNotationLayout] = useState(
    window.innerHeight > window.innerWidth ? "bottom" : "right"
  );

  const [boardSize, setBoardSize] = useState(
    Math.min(
      350,
      window.innerWidth * 0.9,
      window.innerHeight -
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    )
  );

  const updateWindowSize = () => {
    Math.min(
      400,
      window.innerWidth * 0.9,
      window.innerHeight -
        10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
    setNotationLayout(
      window.innerHeight > window.innerWidth ? "bottom" : "right"
    );
  };

  const loadGames = useCallback(
    async (player, color) => {
      try {
        const response = await fetch(
          `${API.BASE_URL}${API.games.filter}${encodeURIComponent(
            player
          )}/${color}`
        );
        const data = await response.json();

        console.time();
        await processor.getTree(data);
        console.timeEnd();

        const fens = processor.searchFEN(fen);

        setGames(data);
        setTree(fens.moves);
        setGamesFilter(fens.indexes);
      } catch (error) {
        console.error("Error loading games:", error);
      }
    },
    [fen]
  );

  useEffect(() => {
    if (games.length > 0 || !processor.isCompleted) {
      processor.completeTree();
    }
  }, [games, loadGames]);

  useEffect(() => {
    loadGames(player, color);
  }, [player, color]);

  useEffect(() => {
    const fetchData = async () => {
      if (!fen || games.length === 0) return;

      const fetchedFens = processor.searchFEN(fen);
      setTree(fetchedFens.moves);
      setGamesFilter(fetchedFens.indexes);
    };

    fetchData();
  }, [fen, games.length]);

  useEffect(() => {
    const handleResize = () => {
      updateWindowSize();
    };

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

    window.addEventListener("resize", debounce(handleResize, 200));
    window.addEventListener("keydown", debounce(handleKeyPress, 200));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div id="preparation">
      <h1>
        <Link to={NOMENU_URLS.profile + encodeURIComponent(player)}>
          {player}
        </Link>{" "}
        - przygotowanie na {color === "black" ? "czarne" : "białe"}
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: notationLayout === "bottom" ? "column-reverse" : "row",
        }}
      >
        <ChessEditor
          showPlayers={false}
          setFen={setFen}
          setDoMove={setDoMove}
          boardSize={boardSize}
          notationLayout={notationLayout}
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
        />
        <div
          style={{
            display: "flex",
            flexDirection:
              notationLayout === "bottom" ? "column-reverse" : "column",
            justifyContent: "flex-start",
            alignItems: notationLayout === "bottom" ? "center" : "flex-start",
            maxHeight: boardSize,
            overflow: "auto",
          }}
        >
          {games.length === 0 ? (
            <div>
              <div className="loading">
                <div className="spin"></div>
                <p>Ładowanie statystyk </p>
              </div>
            </div>
          ) : (
            <>
              <PositionMoves
                stats={tree}
                doMove={doMove}
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
      </div>
    </div>
  );
};

export default PreparationPlayer;
