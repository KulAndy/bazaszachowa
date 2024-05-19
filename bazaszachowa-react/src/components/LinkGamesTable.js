import React from "react";
import { Link } from "react-router-dom";
import { NOMENU_URLS } from "../settings";

const LinkGamesTable = ({ games, base = "all", noEmpty = false, ...props }) => {
  if (noEmpty && (!games || games.length === 0)) {
    return <></>;
  }

  let items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

  const download = (games) => {
    let pgn = "";
    for (const game of games) {
      pgn += game2pgn(game);
    }

    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "games.pgn";
    link.click();

    URL.revokeObjectURL(url);
  };

  const game2pgn = (game) =>
    `[Event "${game.Event}"]
[Site "${game.Site}"]
[Date "${game.Year}.${game.Month || "??"}.${game.Day || "??"}"]
[Round "${game.Round}"]
[White "${game.White}"]
[Black "${game.Black}"]
[Result "${game.Result}"]
[ECO "${game.ECO}"]
[WhiteElo "${game.WhiteElo || 0}"]
[BlackElo "${game.BlackElo || 0}"]

${game.moves}

`;

  return (
    <div {...props}>
      <table id="games">
        <caption>
          Znalezionych gier: {games.length || 0}{" "}
          <button
            onClick={() => {
              download(items);
            }}
          >
            Pobierz
          </button>
        </caption>
        <thead>
          <tr>
            <th>Biały</th>
            <th style={{ whiteSpace: "nowrap" }}>Wynik</th>
            <th>Czarny</th>
            <th>Rok</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <Link
                to={{
                  pathname: `${NOMENU_URLS.game}${base}/${item.id}`,
                  state: {
                    base,
                    gameid: item.id,
                    list: items.map((elem) => elem.id),
                  },
                }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <td>{item.White}</td>
                <td style={{ textAlign: "center" }}>{item.Result}</td>
                <td>{item.Black}</td>
                <td>{item.Year}</td>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkGamesTable;
