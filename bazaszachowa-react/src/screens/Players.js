import "./Players.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { URLS, NOMENU_URLS, API } from "../settings";
import Content from "../components/Content";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";

const Players = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [player, setPlayer] = useState(name);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (player !== null && player !== undefined) {
        try {
          const response = await fetch(
            API.BASE_URL + API.players + encodeURIComponent(player.trim())
          );

          const jsonData = await response.json();
          setPlayers(jsonData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`${URLS.players.url}${player}`);
  };

  return (
    <div id="players">
      <Content>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Gracz</label>
          <SearchPlayersWithHints
            value={player}
            f={setPlayer}
            name="name"
            id="name"
            autofocus
            required
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
              <tr>
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
