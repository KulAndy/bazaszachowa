import "./Players.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Content from "../components/Content";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { API, NOMENU_URLS, URLS } from "../settings";

const Players = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [player, setPlayer] = useState(name);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (player !== null && player !== undefined) {
        const response = await fetch(
          API.BASE_URL + API.players + encodeURIComponent(player.trim()),
        );

        const jsonData = await response.json();
        setPlayers(jsonData);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate(`${URLS.players.url}${player}`);
  };

  return (
    <div id="players">
      <Content>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Gracz</label>
          <SearchPlayersWithHints
            f={setPlayer}
            id="name"
            name="name"
            required
            value={player}
          />
          <br />
          <input type="submit" value="szukaj" />
        </form>
        {players.length > 0 && (
          <table>
            <tr>
              <th>Nazwisko i Imię</th>
              <th>profil</th>
            </tr>
            {players.map((item) => (
              <tr key={item}>
                <td>{item}</td>
                <td>
                  <Link to={NOMENU_URLS.profile + encodeURIComponent(item)}>
                    zobacz
                  </Link>
                </td>
              </tr>
            ))}
          </table>
        )}
      </Content>
    </div>
  );
};

export default Players;
