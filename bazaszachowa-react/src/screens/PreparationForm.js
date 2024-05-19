import React, { useState } from "react";
import { Link } from "react-router-dom";

import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { URLS } from "../settings";

const PreparationForm = () => {
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
      {submitted && (
        <Link
          to={`${URLS.preparation.url}${encodeURIComponent(player)}/${color}`}
        />
      )}
    </form>
  );
};

export default PreparationForm;
