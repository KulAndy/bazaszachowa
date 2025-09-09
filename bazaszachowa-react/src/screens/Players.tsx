import "../styles/Players.scss";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Content from "../components/Content";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../i18n/I18nContext";
import { API, NOMENU_URLS, URLS } from "../settings";

const Players = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { name } = useParams();
  const [player, setPlayer] = useState(name);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (player !== null && player !== undefined) {
        const response = await fetch(
          API.BASE_URL + API.players + encodeURIComponent(player.trim()),
        );

        const jsonData = (await response.json()) as string[];
        setPlayers(jsonData);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      navigate(`${URLS.players.url}${player || ""}`);
    },
    [navigate, player],
  );

  return (
    <div id="players">
      <Content>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">{t("players.player")} </label>
          <SearchPlayersWithHints
            callback={setPlayer}
            id="name"
            name="name"
            required
            value={player}
          />
          <br />
          <input type="submit" value={t("search")} />
        </form>
        {players.length > 0 && (
          <table>
            <tr>
              <th>{t("players.fullname")}</th>
              <th>{t("players.profile")}</th>
            </tr>
            {players.map((item) => (
              <tr key={item}>
                <td>{item}</td>
                <td>
                  <Link to={NOMENU_URLS.profile + encodeURIComponent(item)}>
                    {t("players.see")}
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
