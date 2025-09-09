import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/PreparationForm.css";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../i18n/I18nContext";
import { URLS } from "../settings";

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};

const PreparationForm = () => {
  const { t } = useI18n();
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");

  const handleSetWhite = useCallback(() => {
    setColor("white");
  }, []);

  const handleSetBlack = useCallback(() => {
    setColor("black");
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">{t("players.player")}</label>
      <SearchPlayersWithHints
        callback={setPlayer}
        placeholder="Nowak, Jan"
        required
      />
      <p style={{ textAlign: "center" } as const}>
        <label htmlFor="color">{t("color")}</label>
      </p>
      <p id="color-toggle" style={{ textAlign: "center" } as const}>
        <input
          checked={color === "white"}
          id="white"
          name="color"
          onChange={handleSetWhite}
          type="radio"
          value="white"
        />
        <label htmlFor="white">{t("white")}</label>
        <input
          checked={color === "black"}
          id="black"
          name="color"
          onChange={handleSetBlack}
          type="radio"
          value="black"
        />
        <label htmlFor="black">{t("black")}</label>
      </p>
      <p style={{ textAlign: "center" } as const}>
        <Link
          to={`${URLS.preparation.url}${encodeURIComponent(player)}/${color}`}
        >
          <input type="submit" value={t("search")} />
        </Link>
      </p>
    </form>
  );
};

export default PreparationForm;
