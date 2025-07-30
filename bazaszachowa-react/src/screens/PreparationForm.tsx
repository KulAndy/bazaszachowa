import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./PreparationForm.css";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { URLS } from "../settings";

const PreparationForm = () => {
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Gracz</label>
      <SearchPlayersWithHints f={setPlayer} placeholder="Nowak, Jan" required />
      <p style={{ textAlign: "center" }}>
        <label htmlFor="white">kolor</label>
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
        <label htmlFor="white">białe</label>
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
        <label htmlFor="black">czarne</label>
      </p>
      <p style={{ textAlign: "center" }}>
        <Link
          to={`${URLS.preparation.url}${encodeURIComponent(player)}/${color}`}
        >
          <input type="submit" value="szukaj" />
        </Link>
      </p>
    </form>
  );
};

export default PreparationForm;
