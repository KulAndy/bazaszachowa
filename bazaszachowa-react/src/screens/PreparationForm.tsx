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
      <SearchPlayersWithHints placeholder="Nowak, Jan" f={setPlayer} required />
      <p style={{ textAlign: "center" }}>
        <label htmlFor="white">kolor</label>
      </p>
      <p id="color-toggle" style={{ textAlign: "center" }}>
        <input
          type="radio"
          name="color"
          id="white"
          value="white"
          checked={color === "white"}
          onChange={() => {
            setColor("white");
          }}
        />
        <label htmlFor="white">białe</label>
        <input
          type="radio"
          name="color"
          id="black"
          value="black"
          checked={color === "black"}
          onChange={() => {
            setColor("black");
          }}
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
