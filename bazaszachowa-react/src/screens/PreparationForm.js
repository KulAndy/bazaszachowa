import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { URLS } from "../settings";

const PreparationForm = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`${URLS.preparation.url}${encodeURIComponent(player)}/${color}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Gracz</label>
      <SearchPlayersWithHints placeholder="Nowak, Jan" f={setPlayer} required />
      <p style={{ textAlign: "center" }}>
        <label htmlFor="white">kolor</label>
      </p>
      <p style={{ textAlign: "center" }}>
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
        <input type="submit" value="szukaj" />
      </p>
    </form>
  );
};

export default PreparationForm;
