import "./Player.css";
import React, { useState, useEffect } from "react";
import Content from "../components/Content";
import { useParams, Link } from "react-router-dom";
import settings from "../settings";
import CrPlayersList from "../components/CrPlayerList";
import FidePlayersList from "../components/FidePlayerList";
import OpeningsStats from "../components/OpeningStats";
import { API, URLS } from "../settings";
import GamesTable from "../components/GamesTable";

const Player = () => {
  const { name, color, opening } = useParams();
  const [loadingExtremes, setLoadingExtremes] = useState(true);
  const [maxElo, setMaxElo] = useState(null);
  const [minYear, setMinYear] = useState(null);
  const [maxYear, setMaxYear] = useState(null);
  const [loadingCr, setLoadingCr] = useState(true);
  const [crPlayers, setCrPlayers] = useState([]);
  const [loadingFide, setLoadingFide] = useState(true);
  const [fidePlayers, setFidePlayers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({ whites: [], blacks: [] });

  const [loadingGames, setLoadingGames] = useState(true);
  const [games, setGames] = useState(null);

  const loadExtremes = () => {
    fetch(
      settings.API.BASE_URL + settings.API.extremes + encodeURIComponent(name)
    )
      .then((response) => response.json())
      .then((data) => {
        setLoadingExtremes(false);
        setMaxElo(data[0].maxElo || null);
        setMinYear(data[0].minYear || null);
        setMaxYear(data[0].maxYear || null);
      })
      .catch((err) => {
        setLoadingExtremes(false);
      });
  };

  const loadCr = () => {
    fetch(settings.API.BASE_URL + settings.API.cr + encodeURIComponent(name))
      .then((response) => response.json())
      .then((data) => {
        setLoadingCr(false);
        setCrPlayers(data);
      })
      .catch((err) => {
        setLoadingCr(false);
      });
  };

  const loadFide = () => {
    fetch(settings.API.BASE_URL + settings.API.fide + encodeURIComponent(name))
      .then((response) => response.json())
      .then((data) => {
        setLoadingFide(false);
        setFidePlayers(data);
      })
      .catch((err) => {
        setLoadingFide(false);
      });
  };

  const loadStats = () => {
    fetch(
      settings.API.BASE_URL + settings.API.openings + encodeURIComponent(name)
    )
      .then((response) => response.json())
      .then((data) => {
        setLoadingStats(false);
        setStats(data);
      })
      .catch((error) => {
        console.error(error);
        setLoadingStats(false);
      });
  };

  const loadGames = () => {
    setLoadingGames(true);
    let url;
    if (color !== undefined && opening !== undefined) {
      url =
        settings.API.BASE_URL +
        settings.API.games.filter +
        encodeURIComponent(name) +
        "/" +
        color +
        "/" +
        opening;
    } else if (color !== undefined) {
      url =
        settings.API.BASE_URL +
        settings.API.games.filter +
        encodeURIComponent(name) +
        "/" +
        color;
    } else {
      url =
        settings.API.BASE_URL +
        settings.API.games.normal +
        "?white=" +
        encodeURIComponent(name) +
        "&black=" +
        "&ignore=true" +
        "&minYear=" +
        "&maxYear=" +
        "&event=" +
        "&minEco=1" +
        "&maxEco=500" +
        "&base=all" +
        "&searching=fulltext";
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (color === undefined) {
          setGames(data.rows);
        } else {
          setGames(data);
        }
      })
      .finally(() => {
        setLoadingGames(false);
      });
  };

  useEffect(() => {
    loadExtremes();
    loadCr();
    loadFide();
    loadStats();
    loadGames();
  }, [name]);

  useEffect(() => {
    loadGames();
  }, [color, opening]);

  return (
    <div id="player">
      <Content>
        <h1>{name}</h1>
        {loadExtremes}
        {!loadingExtremes && (
          <div id="info">
            {maxElo != null && <p>najwyższy osiągnięty ranking {maxElo}</p>}
            {minYear != null && maxYear != null && (
              <p>
                Gry z lat {minYear} - {maxYear}
              </p>
            )}
          </div>
        )}
        {(crPlayers.length > 1 || fidePlayers.length > 1) && (
          <h3 id="ambigousAlert">
            <span className="error">
              UWAGA: Znaleziono więcej niż jednego zawodnika o tym nazwisku
            </span>
            <br />
            najbardziej prawdopodobne:
          </h3>
        )}
        <div id="data-container">
          {loadingCr ? (
            <div>
              <div className="loading">
                <div className="spin"></div>
                <p>Przeszukiwanie CR-u ... </p>
              </div>
            </div>
          ) : (
            <CrPlayersList players={crPlayers} />
          )}
          {loadingFide ? (
            <div>
              <div className="loading">
                <div className="spin"></div>
                <p>Przeszukiwanie Fide ... </p>
              </div>
            </div>
          ) : (
            <FidePlayersList players={fidePlayers} />
          )}
        </div>
        <div style={{ width: "fit-content", margin: "auto" }}>
          <table>
            <tr>
              <th colSpan={2}>przygotowanie</th>
            </tr>
            <tr>
              <td>
                <Link
                  to={
                    URLS.preparation.url + encodeURIComponent(name) + "/white"
                  }
                >
                  białe
                </Link>
              </td>
              <td>
                <Link
                  to={
                    URLS.preparation.url + encodeURIComponent(name) + "/black"
                  }
                >
                  czarne
                </Link>
              </td>
            </tr>
          </table>
        </div>
        <details>
          <summary>
            profil na yottabase
            <a
              href={`https://www.yottachess.com/player/${encodeURIComponent(
                name
              )}`}
            >
              link
            </a>
          </summary>
          <iframe
            loading="lazy"
            src={`https://www.yottachess.com/player/${encodeURIComponent(
              name
            )}`}
            referrerPolicy="origin-when-cross-origin"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        </details>
        <table style={{ border: 0, margin: "auto" }}>
          <tr id="container" style={{ display: "flex" }}>
            <td id="stats" style={{ border: 0 }}>
              {loadingStats ? (
                <div>
                  <div className="loading">
                    <div className="spin"></div>
                    <p>Ładowanie statystyk ... </p>
                  </div>
                </div>
              ) : (
                <OpeningsStats stats={stats} name={name} />
              )}
            </td>
            <td style={{ border: 0 }}>
              <img
                id="graph"
                onError={(e) => {
                  e.target.closest("td").remove();
                }}
                src={
                  API.BASE_URL + API.graph + "svg/" + encodeURIComponent(name)
                }
              />
            </td>
          </tr>
        </table>
        {loadingGames ? (
          <div>
            <div className="loading">
              <div className="spin"></div>
              <p>Ładowanie gier ... </p>
            </div>
          </div>
        ) : (
          <GamesTable games={games} />
        )}
      </Content>
    </div>
  );
};

export default Player;
