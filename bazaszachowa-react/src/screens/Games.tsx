import "../styles/Games.scss";
import React, { useCallback, useState } from "react";

import { GameData } from "../ChessEditor";
import Content from "../components/Content";
import GamesTable from "../components/GamesTable";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../i18n/I18nContext";
import { API } from "../settings";

const Games = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");
  const [ignore, setIgnore] = useState(false);
  const [minYear, setMinYear] = useState(1475);
  const [maxYear, setMaxYear] = useState(currentYear);
  const [minEco, setMinEco] = useState(1);
  const [maxEco, setMaxEco] = useState(500);
  const [base, setBase] = useState("all");
  const [searching, setSearching] = useState("classic");
  const [event, setEvent] = useState("");
  const [games, setGames] = useState<GameData[]>([]);
  const [searchedBase, setSearchedBase] = useState("all");
  const [loadingGames, setLoadingGames] = useState(false);

  const options1 = [];
  const options2 = [];
  let counter = 1;
  for (const letter of ["A", "B", "C", "D", "E"] as const) {
    for (let index = 0; index < 10; index++) {
      for (let index_ = 0; index_ < 10; index_++) {
        options1.push(
          <option key={`min-${counter}`} value={counter}>
            {letter}
            {index}
            {index_}
          </option>,
        );
        options2.push(
          <option key={`max-${counter}`} value={counter++}>
            {letter}
            {index}
            {index_}
          </option>,
        );
      }
    }
  }

  const handleSubmit = useCallback(
    (event_: React.FormEvent) => {
      event_.preventDefault();
      if (white.trim().length > 0 || black.trim().length > 0) {
        const body: Record<string, string> = {
          black,
          event,
          ignore: String(ignore),
          maxEco: String(maxEco),
          maxYear: String(maxYear),
          minEco: String(minEco),
          minYear: String(minYear),
          searching,
          table: base,
          white,
        };
        const url = new URL(API.BASE_URL + API.games.normal);
        url.search = new URLSearchParams(body).toString();
        setLoadingGames(true);
        fetch(url)
          .then((response) => response.json())
          .then((data: { rows: GameData[]; table: string }) => {
            setSearchedBase(data.table);
            setGames(data.rows);
          })
          .finally(() => {
            setLoadingGames(false);
          });
      } else {
        alert("Wymagane nazwisko przynajmniej jednego z graczy");
      }
    },
    [
      base,
      black,
      event,
      ignore,
      maxEco,
      maxYear,
      minEco,
      minYear,
      searching,
      white,
    ],
  );

  const handleToggleIgnore = useCallback(() => {
    setIgnore(!ignore);
  }, [ignore]);

  const handleMinYearChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setMinYear(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleMaxYearChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setMaxYear(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleEventChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setEvent(event_.target.value);
    },
    [],
  );

  const handleMinEcoChange = useCallback(
    (event_: React.ChangeEvent<HTMLSelectElement>) => {
      setMinEco(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleMaxEcoChange = useCallback(
    (event_: React.ChangeEvent<HTMLSelectElement>) => {
      setMaxEco(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleBaseChangePoland = useCallback(() => {
    setBase("poland");
  }, []);

  const handleBaseChangeAll = useCallback(() => {
    setBase("all");
  }, []);

  const handleSearchingClassic = useCallback(() => {
    setSearching("classic");
  }, []);

  const handleSearchingFulltext = useCallback(() => {
    setSearching("fulltext");
  }, []);

  return (
    <div id="games">
      <Content>
        <div id="search-container">
          <div className="desktop"></div>
          <form onSubmit={handleSubmit}>
            <table className="no-border">
              <tbody>
                <tr>
                  <td>
                    <label>{t("white")}:</label>
                  </td>
                  <td colSpan={3}>
                    <SearchPlayersWithHints
                      callback={setWhite}
                      id="white"
                      list="whitelist"
                      placeholder="Nowak, Jan"
                      type="text"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("black")}:</label>
                  </td>
                  <td colSpan={3}>
                    <SearchPlayersWithHints
                      callback={setBlack}
                      id="black"
                      list="blacklist"
                      placeholder="Nowak, Jan"
                      type="text"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "21ch" } as const}>
                    <label>{t("games.ignore_colors")}</label>
                  </td>
                  <td colSpan={3}>
                    <input
                      checked={ignore}
                      onChange={handleToggleIgnore}
                      type="checkbox"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("years")}:</label>
                  </td>
                  <td
                    style={
                      { display: "flex", justifyContent: "flex-end" } as const
                    }
                  >
                    <input
                      max={currentYear}
                      min="1475"
                      onChange={handleMinYearChange}
                      step="1"
                      style={{ width: "4em" } as const}
                      type="number"
                      value={minYear}
                    />
                  </td>
                  <td> - </td>
                  <td
                    style={
                      { display: "flex", justifyContent: "flex-start" } as const
                    }
                  >
                    <input
                      max={currentYear}
                      min="1475"
                      onChange={handleMaxYearChange}
                      step="1"
                      style={{ width: "4em" } as const}
                      type="number"
                      value={maxYear}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("tournament")}:</label>
                  </td>
                  <td colSpan={3}>
                    <input
                      onChange={handleEventChange}
                      type="text"
                      value={event}
                    />
                  </td>
                </tr>
                <tr>
                  <td>ECO:</td>
                  <td
                    style={
                      { display: "flex", justifyContent: "flex-end" } as const
                    }
                  >
                    <select
                      name="ecoMin"
                      onChange={handleMinEcoChange}
                      value={minEco}
                    >
                      {options1}
                    </select>
                  </td>
                  <td> - </td>
                  <td
                    style={
                      { display: "flex", justifyContent: "flex-start" } as const
                    }
                  >
                    <select
                      name="ecoMax"
                      onChange={handleMaxEcoChange}
                      value={maxEco}
                    >
                      {options2}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("base")}:</label>
                  </td>
                  <td>
                    <label>{t("games.poland")} </label>
                    <input
                      checked={base === "poland"}
                      name="base"
                      onChange={handleBaseChangePoland}
                      type="radio"
                      value="poland"
                    />
                  </td>
                  <td colSpan={2}>
                    <label>{t("games.all")} </label>
                    <input
                      checked={base === "all"}
                      name="base"
                      onChange={handleBaseChangeAll}
                      type="radio"
                      value="all"
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "18ch" } as const}>
                    <label>{t("games.searching")}</label>
                  </td>
                  <td>
                    <label>{t("games.searching_classic")}</label>
                    <input
                      checked={searching === "classic"}
                      name="searching"
                      onChange={handleSearchingClassic}
                      type="radio"
                    />
                  </td>
                  <td colSpan={2}>
                    <label>{t("games.searching_exact")}</label>
                    <input
                      checked={searching === "fulltext"}
                      name="searching"
                      onChange={handleSearchingFulltext}
                      type="radio"
                    />
                  </td>
                </tr>
                <tr style={{ height: "4em" } as const}>
                  <th colSpan={4}>
                    <button>{t("games.search")}</button>
                  </th>
                </tr>
              </tbody>
            </table>
          </form>
          <div id="right-content">
            <details id="help">
              <summary>{t("games.help")}</summary>
              <ul>
                {t("games.params")}:<li>{t("games.param.player")}</li>
                <li>
                  {t("games.param.eco")}{" "}
                  <a href={t("eco_href")}>{t("games.param.ecoLink")}</a>
                </li>
                <li>
                  {t("games.param.database")}
                  <ul>
                    <li>{t("games.param.database.pl")}</li>
                    <li>{t("games.param.database.all")}</li>
                  </ul>
                </li>
                <li>
                  {t("games.param.search")}
                  <ul>
                    <li>{t("games.param.search.normal")}</li>
                    <li>{t("games.param.search.exact")}</li>
                  </ul>
                </li>
              </ul>
            </details>
          </div>
        </div>
        {loadingGames ? (
          <div>
            <div className="loading">
              <div className="spin"></div>
              <p>{t("games.loading_games")} </p>
            </div>
          </div>
        ) : (
          <GamesTable base={searchedBase} games={games} noEmpty={true} />
        )}
      </Content>
    </div>
  );
};

export default Games;
