import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./PreparationForm.css";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../i18n/I18nContext";
import { URLS } from "../settings";

const PreparationForm = () => {
  const { t } = useI18n();
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">{t("players.player")}</label>
      <SearchPlayersWithHints f={setPlayer} placeholder="Nowak, Jan" required />
      <p style={{ textAlign: "center" }}>
        <label htmlFor="white">{t("color")}</label>
      </p>
      <p id="color-toggle" style={{ textAlign: "center" }}>
        <input
          checked={color === "white"}
          id="white"
          name="color"
          onChange={() => {
            setColor("white");
          }}
          type="radio"
          value="white"
        />
        <label htmlFor="white">{t("white")}</label>
        <input
          checked={color === "black"}
          id="black"
          name="color"
          onChange={() => {
            setColor("black");
          }}
          type="radio"
          value="black"
        />
        <label htmlFor="black">{t("black")}</label>
      </p>
      <p style={{ textAlign: "center" }}>
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
