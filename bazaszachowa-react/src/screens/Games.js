import "./Games.css";
import React, { useState } from "react";
import Content from "../components/Content";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { API } from "../settings";
import GamesTable from "../components/GamesTable";

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
  const [games, setGames] = useState([]);
  const [seachedBase, setSearchedBase] = useState("all");
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
          </option>
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
          </option>
        );
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (white.trim().length > 0 || black.trim().length > 0) {
      const body = {
        white,
        black,
        ignore,
        minYear,
        maxYear,
        minEco,
        maxEco,
        event,
        table: base,
        searching,
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
          <div class="not_mobile"></div>{" "}
          <form onSubmit={handleSubmit}>
            <table class="no_border">
              <tr>
                <td>Białe:</td>
                <td colspan="3">
                  <SearchPlayersWithHints
                    list="whitelist"
                    type="text"
                    id="white"
                    placeholder="Nowak, Jan"
                    f={setWhite}
                  />
                </td>
              </tr>
              <tr>
                <td>Czarne: </td>
                <td colspan="3">
                  <SearchPlayersWithHints
                    list="blacklist"
                    type="text"
                    id="black"
                    placeholder="Nowak, Jan"
                    f={setBlack}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "21ch" }}>ignoruj kolory</td>
                <td colspan="3">
                  <input
                    type="checkbox"
                    checked={ignore}
                    onChange={() => {
                      setIgnore(!ignore);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>lata:</td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input
                    type="number"
                    step="1"
                    min="1475"
                    max={currentYear}
                    value={minYear}
                    style={{ width: "4em" }}
                    onChange={(e) => {
                      setMinYear(parseInt(e.target.value));
                    }}
                  />
                </td>
                <td> - </td>
                <td style={{ display: "flex", justifyContent: "flex-start" }}>
                  <input
                    type="number"
                    step="1"
                    min="1475"
                    max={currentYear}
                    value={maxYear}
                    style={{ width: "4em" }}
                    onChange={(e) => {
                      setMaxYear(parseInt(e.target.value));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>turniej:</td>
                <td colspan="3">
                  <input
                    type="text"
                    value={event}
                    onChange={(e) => {
                      setEvent(e.target.value);
                    }}
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
                    type="radio"
                    name="base"
                    value="poland"
                    checked={base === "poland"}
                    onChange={() => {
                      setBase("poland");
                    }}
                  />
                </td>
                <td colspan="2">
                  {" "}
                  całość{" "}
                  <input
                    type="radio"
                    name="base"
                    value="all"
                    checked={base === "all"}
                    onChange={() => {
                      setBase("all");
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: "18ch" }}>wyszukiwanie</td>
                <td>
                  zwykłe
                  <input
                    type="radio"
                    name="searching"
                    checked={searching === "classic"}
                    onChange={() => {
                      setSearching("classic");
                    }}
                  />
                </td>
                <td colspan="2">
                  dokładne
                  <input
                    type="radio"
                    name="searching"
                    checked={searching === "fulltext"}
                    onChange={() => {
                      setSearching("fulltext");
                    }}
                  />
                </td>
              </tr>
              <tr style={{ height: "4em" }}>
                <th colspan="4">
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
                      Całość - wszystkie partie, ok 11 mln, wolniejsza baza
                    </li>
                  </ul>
                </li>
                <li>
                  <ul>
                    Wyszukiwanie (wielkość liter nie ma znaczenia)
                    <li>
                      Zwykłe - zadziała zarówno wpisanie "Nowak, Jan" jak i
                      "Nowak, J" , można stować jokery ( "_" - jeden dowolny
                      znak, "%" - dowolny ciąg znaków )
                    </li>
                    <li>
                      Dokładne - wyszuka tylko po wpisaniu "Nowak, Jan",
                      szybsze, zalecane jeśli zna się pełne imię i nazwisko
                      gracza/y
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
          <GamesTable games={games} base={seachedBase} noEmpty={true} />
        )}
      </Content>
    </div>
  );
};

export default Games;
