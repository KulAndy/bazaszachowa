import "../styles/Player.scss";
import { CircularProgress } from "@mui/material";
import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { GameData } from "../ChessEditor";
import Content from "../components/app/Content";
import FideTournaments from "../components/FideTournaments";
import GamesTable from "../components/GamesTable";
import type { CrPlayerType } from "../components/player/CrPlayer";
import CrPlayersList from "../components/player/CrPlayerList";
import type { FidePlayerType } from "../components/player/FidePlayer";
import FidePlayersList from "../components/player/FidePlayerList";
import PolandTournaments from "../components/PolandTournaments";
import type { Stat } from "../components/stats/ColorStats";
import GamesStats from "../components/stats/GamesStats";
import OpeningsStats from "../components/stats/OpeningStats";
import { useI18n } from "../context/useI18n";
import { API, URLS } from "../settings";

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
    axios
      .get(API.BASE_URL + API.extremes + encodeURIComponent(name || ""))
      .then(
        (
          response: AxiosResponse<
            { maxElo: null | number; maxYear: number; minYear: number }[]
          >,
        ) => response.data,
      )
      .then(
        (
          data: { maxElo: null | number; maxYear: number; minYear: number }[],
        ) => {
          setMaxElo(data[0].maxElo || null);
          setMinYear(data[0].minYear || null);
          setMaxYear(data[0].maxYear || null);
        },
      )
      .catch(() => {})
      .finally(() => {
        setLoadingExtremes(false);
      });
  };

  const loadCr = () => {
    axios
      .get(API.BASE_URL + API.cr + encodeURIComponent(name || ""))
      .then((response: AxiosResponse<CrPlayerType[]>) => response.data)
      .then((data: CrPlayerType[]) => {
        setCrPlayers(data);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingCr(false);
      });
  };

  const loadFide = () => {
    axios
      .get(API.BASE_URL + API.fide + encodeURIComponent(name || ""))
      .then((response: AxiosResponse<FidePlayerType[]>) => response.data)
      .then((data: FidePlayerType[]) => {
        setFidePlayers(data);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingFide(false);
      });
  };

  const loadStats = () => {
    axios
      .get(API.BASE_URL + API.openings + encodeURIComponent(name || ""))
      .then((response: AxiosResponse<typeof stats>) => response.data)
      .then((data: typeof stats) => {
        setStats(data);
      })
      .catch(() => {})
      .finally(() => {
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
        "&minEco=A00" +
        "&maxEco=E99" +
        "&base=all" +
        "&searching=fulltext";
    }
    void axios
      .get(url)
      .then((response: AxiosResponse<unknown>) => response.data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, opening, name]);

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
                <CircularProgress />
                <p>{t("player.searching_cr")} </p>
              </div>
            </div>
          ) : (
            <CrPlayersList players={crPlayers} />
          )}
          {loadingFide ? (
            <div>
              <div className="loading">
                <CircularProgress />
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
            {t("players.profile")}
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            yottabase
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
            // eslint-disable-next-line react-dom/no-unsafe-iframe-sandbox
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            src={`https://www.yottachess.com/player/${encodeURIComponent(
              name || "",
            )}`}
            title="Profile na yottachess"
          ></iframe>
        </details>
        <table style={{ border: 0, margin: "auto" } as const}>
          <tbody>
            <tr id="container">
              <td id="stats" style={{ border: 0 } as const}>
                {loadingStats ? (
                  <div>
                    <div className="loading">
                      <CircularProgress />
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
                  onError={(event: React.SyntheticEvent) => {
                    const target = event.target as HTMLElement;
                    target.parentElement?.remove();
                  }}
                  src={`${API.BASE_URL + API.graph}svg/${encodeURIComponent(
                    name || "",
                  )}`}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {name ? <PolandTournaments name={name} /> : null}
        {name ? <FideTournaments name={name} /> : null}
        {games ? <GamesStats games={games} player={name || ""} /> : null}
        {loadingGames ? (
          <div>
            <div className="loading">
              <CircularProgress />
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
