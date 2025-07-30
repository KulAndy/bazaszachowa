import "./Games.css";
import React, { useState } from "react";

import { GameData } from "../ChessEditor";
import Content from "../components/Content";
import GamesTable from "../components/GamesTable";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { API } from "../settings";

const Games = () => {
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
  const letters = ["A", "B", "C", "D", "E"];

  let counter = 1;

  for (const letter of letters) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        options1.push(
          <option value={counter++}>
            {letter}
            {i}
            {j}
          </option>,
        );
      }
    }
  }

  counter = 1;

  for (const letter of letters) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        options2.push(
          <option value={counter++}>
            {letter}
            {i}
            {j}
          </option>,
        );
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        .then((data) => {
          setSearchedBase(data.table);
          setGames(data.rows);
        })
        .finally(() => {
          setLoadingGames(false);
        });
    } else {
      alert("Wymagane nazwisko przynajmniej jednego z graczy");
    }
  };

  return (
    <div id="games">
      <Content>
        <div id="searchContainer">
          <div className="not_mobile"></div>{" "}
          <form onSubmit={handleSubmit}>
            <table className="no_border">
              <tr>
                <td>Białe:</td>
                <td colSpan={3}>
                  <SearchPlayersWithHints
                    f={setWhite}
                    id="white"
                    list="whitelist"
                    placeholder="Nowak, Jan"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>Czarne: </td>
                <td colSpan={3}>
                  <SearchPlayersWithHints
                    f={setBlack}
                    id="black"
                    list="blacklist"
                    placeholder="Nowak, Jan"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "21ch" }}>ignoruj kolory</td>
                <td colSpan={3}>
                  <input
                    checked={ignore}
                    onChange={() => {
                      setIgnore(!ignore);
                    }}
                    type="checkbox"
                  />
                </td>
              </tr>
              <tr>
                <td>lata:</td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input
                    max={currentYear}
                    min="1475"
                    onChange={(e) => {
                      setMinYear(parseInt(e.target.value));
                    }}
                    step="1"
                    style={{ width: "4em" }}
                    type="number"
                    value={minYear}
                  />
                </td>
                <td> - </td>
                <td style={{ display: "flex", justifyContent: "flex-start" }}>
                  <input
                    max={currentYear}
                    min="1475"
                    onChange={(e) => {
                      setMaxYear(parseInt(e.target.value));
                    }}
                    step="1"
                    style={{ width: "4em" }}
                    type="number"
                    value={maxYear}
                  />
                </td>
              </tr>
              <tr>
                <td>turniej:</td>
                <td colSpan={3}>
                  <input
                    onChange={(e) => {
                      setEvent(e.target.value);
                    }}
                    type="text"
                    value={event}
                  />
                </td>
              </tr>
              <tr>
                <td>ECO:</td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  <select
                    name="ecoMin"
                    onChange={(e) => {
                      setMinEco(parseInt(e.target.value));
                    }}
                    value={minEco}
                  >
                    {options1}
                  </select>
                </td>
                <td> - </td>
                <td style={{ display: "flex", justifyContent: "flex-start" }}>
                  <select
                    name="ecoMax"
                    onChange={(e) => {
                      setMaxEco(parseInt(e.target.value));
                    }}
                    value={maxEco}
                  >
                    {options2}
                  </select>
                </td>
              </tr>
              <tr>
                <td>baza:</td>
                <td>
                  Polska{" "}
                  <input
                    checked={base === "poland"}
                    name="base"
                    onChange={() => {
                      setBase("poland");
                    }}
                    type="radio"
                    value="poland"
                  />
                </td>
                <td colSpan={2}>
                  {" "}
                  całość{" "}
                  <input
                    checked={base === "all"}
                    name="base"
                    onChange={() => {
                      setBase("all");
                    }}
                    type="radio"
                    value="all"
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "18ch" }}>wyszukiwanie</td>
                <td>
                  zwykłe
                  <input
                    checked={searching === "classic"}
                    name="searching"
                    onChange={() => {
                      setSearching("classic");
                    }}
                    type="radio"
                  />
                </td>
                <td colSpan={2}>
                  dokładne
                  <input
                    checked={searching === "fulltext"}
                    name="searching"
                    onChange={() => {
                      setSearching("fulltext");
                    }}
                    type="radio"
                  />
                </td>
              </tr>
              <tr style={{ height: "4em" }}>
                <th colSpan={4}>
                  <button>szukaj</button>
                </th>
              </tr>
            </table>
          </form>
          <div id="right_content">
            <details id="help">
              <summary>Pomoc</summary>
              <ul>
                Możliwe parametry wyszukiwania:
                <li>Trzeba podać nazwisko przynajmniej jednego gracza</li>
                <li>
                  kody
                  <a href="https://pl.wikipedia.org/wiki/Encyklopedia_otwar%C4%87_szachowych">
                    ECO
                  </a>
                  na wikipedii
                </li>
                <li>
                  <ul>
                    baza
                    <li>
                      Polska - turnieje głównie z Polski, ok 700 tys. , szybsza
                      baza
                    </li>
                    <li>
                      Całość - wszystkie partie, ok 15 mln, wolniejsza baza
                    </li>
                  </ul>
                </li>
                <li>
                  <ul>
                    Wyszukiwanie (wielkość liter nie ma znaczenia)
                    <li>
                      Zwykłe - zadziała zarówno wpisanie &quot;Nowak, Jan&quot;
                      jak i &quot;Nowak, J&quot; , można stować jokery (
                      &quot;_&quot; - jeden dowolny znak, &quot;%&quot; -
                      dowolny ciąg znaków )
                    </li>
                    <li>
                      Dokładne - wyszuka tylko po wpisaniu &quot;Nowak,
                      Jan&quot;, szybsze, zalecane jeśli zna się pełne imię i
                      nazwisko gracza/y
                    </li>
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
              <p>Ładowanie gier ... </p>
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
