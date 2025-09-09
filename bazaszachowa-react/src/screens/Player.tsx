import "../styles/Player.scss";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { GameData } from "../ChessEditor";
import { Stat } from "../components/ColorStats";
import Content from "../components/Content";
import { CrPlayerType } from "../components/CrPlayer";
import CrPlayersList from "../components/CrPlayerList";
import { FidePlayerType } from "../components/FidePlayer";
import FidePlayersList from "../components/FidePlayerList";
import GamesTable from "../components/GamesTable";
import OpeningsStats from "../components/OpeningStats";
import { useI18n } from "../i18n/I18nContext";
import { API, URLS } from "../settings";

const handleErrorImage = (event: React.SyntheticEvent) => {
  const target = event.target as HTMLElement;
  target.parentElement?.remove();
};

const Player = () => {
  const { t } = useI18n();
  const { color, name, opening } = useParams();
  const [loadingExtremes, setLoadingExtremes] = useState(true);
  const [maxElo, setMaxElo] = useState<null | number>(null);
  const [minYear, setMinYear] = useState<null | number>(null);
  const [maxYear, setMaxYear] = useState<null | number>(null);
  const [loadingCr, setLoadingCr] = useState(true);
  const [crPlayers, setCrPlayers] = useState<CrPlayerType[]>([]);
  const [loadingFide, setLoadingFide] = useState(true);
  const [fidePlayers, setFidePlayers] = useState<FidePlayerType[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<{ blacks: Stat[]; whites: Stat[] }>({
    blacks: [],
    whites: [],
  });

  const [loadingGames, setLoadingGames] = useState(true);
  const [games, setGames] = useState<GameData[] | null>(null);

  const loadExtremes = () => {
    fetch(API.BASE_URL + API.extremes + encodeURIComponent(name || ""))
      .then((response) => response.json())
      .then(
        (
          data: { maxElo: null | number; maxYear: number; minYear: number }[],
        ) => {
          setLoadingExtremes(false);
          setMaxElo(data[0].maxElo || null);
          setMinYear(data[0].minYear || null);
          setMaxYear(data[0].maxYear || null);
        },
      )
      .catch(() => {
        setLoadingExtremes(false);
      });
  };

  const loadCr = () => {
    fetch(API.BASE_URL + API.cr + encodeURIComponent(name || ""))
      .then((response) => response.json())
      .then((data: CrPlayerType[]) => {
        setLoadingCr(false);
        setCrPlayers(data);
      })
      .catch(() => {
        setLoadingCr(false);
      });
  };

  const loadFide = () => {
    fetch(API.BASE_URL + API.fide + encodeURIComponent(name || ""))
      .then((response) => response.json())
      .then((data: FidePlayerType[]) => {
        setLoadingFide(false);
        setFidePlayers(data);
      })
      .catch(() => {
        setLoadingFide(false);
      });
  };

  const loadStats = () => {
    fetch(API.BASE_URL + API.openings + encodeURIComponent(name || ""))
      .then((response) => response.json())
      .then((data: typeof stats) => {
        setLoadingStats(false);
        setStats(data);
      })
      .catch(() => {
        setLoadingStats(false);
      });
  };

  const loadGames = () => {
    setLoadingGames(true);
    let url;
    if (color && opening) {
      url = `${
        API.BASE_URL + API.games.filter + encodeURIComponent(name || "")
      }/${color}/${opening}`;
    } else if (color) {
      url = `${
        API.BASE_URL + API.games.filter + encodeURIComponent(name || "")
      }/${color}`;
    } else {
      url =
        `${API.BASE_URL + API.games.normal}?white=${encodeURIComponent(
          name || "",
        )}&black=` +
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
      .then((data: unknown) => {
        if (color === undefined) {
          setGames((data as { rows: GameData[] }).rows);
        } else {
          setGames(data as GameData[]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, opening]);

  return (
    <div id="player">
      <Content>
        <h1>{name}</h1>
        {!loadingExtremes && (
          <div id="info">
            {maxElo ? (
              <p>
                {t("player.highest_rating")} {maxElo}
              </p>
            ) : null}
            {minYear && maxYear ? (
              <p>
                {t("player.year")} {minYear} - {maxYear}
              </p>
            ) : null}
          </div>
        )}
        {(crPlayers.length > 1 || fidePlayers.length > 1) && (
          <h3 id="ambigousAlert">
            <span className="error">{t("player.warning")}</span>
            <br />
            {t("player.most_likely")}:
          </h3>
        )}
        <div id="data-container">
          {loadingCr ? (
            <div>
              <div className="loading">
                <div className="spin"></div>
                <p>{t("player.searching_cr")} </p>
              </div>
            </div>
          ) : (
            <CrPlayersList players={crPlayers} />
          )}
          {loadingFide ? (
            <div>
              <div className="loading">
                <div className="spin"></div>
                <p>{t("player.searching_fide")} </p>
              </div>
            </div>
          ) : (
            <FidePlayersList players={fidePlayers} />
          )}
        </div>
        <div style={{ margin: "auto", width: "fit-content" } as const}>
          <table>
            <thead>
              <tr>
                <th colSpan={2}>{t("menu.preparation")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link
                    to={`${
                      URLS.preparation.url + encodeURIComponent(name || "")
                    }/white`}
                  >
                    {t("white")}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`${
                      URLS.preparation.url + encodeURIComponent(name || "")
                    }/black`}
                  >
                    {t("black")}
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <details>
          <summary>
            {t("players.profile")} yottabase
            <a
              href={`https://www.yottachess.com/player/${encodeURIComponent(
                name || "",
              )}`}
            >
              {t("link")}
            </a>
          </summary>
          <iframe
            loading="lazy"
            referrerPolicy="origin-when-cross-origin"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            src={`https://www.yottachess.com/player/${encodeURIComponent(
              name || "",
            )}`}
            title="Profile na yottachess"
          ></iframe>
        </details>
        <table style={{ border: 0, margin: "auto" } as const}>
          <tr id="container">
            <td id="stats" style={{ border: 0 } as const}>
              {loadingStats ? (
                <div>
                  <div className="loading">
                    <div className="spin"></div>
                    <p>{t("player.loading_stats")} </p>
                  </div>
                </div>
              ) : (
                <OpeningsStats name={name || ""} stats={stats} />
              )}
            </td>
            <td style={{ border: 0 } as const}>
              <img
                alt="Wykres rankingu"
                crossOrigin="anonymous"
                id="graph"
                onError={handleErrorImage}
                src={`${API.BASE_URL + API.graph}svg/${encodeURIComponent(
                  name || "",
                )}`}
              />
            </td>
          </tr>
        </table>
        {loadingGames ? (
          <div>
            <div className="loading">
              <div className="spin"></div>
              <p>{t("player.loading_games")} </p>
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
