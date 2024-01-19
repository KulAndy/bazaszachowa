import "./Preparation.css";
import React from "react";
import { useParams } from "react-router-dom";

import Content from "../components/Content";
import PreparationForm from "./PreparationForm";
import PreparationPlayer from "./PreparationPlayer";

const Preparation = () => {
  const { player, color } = useParams();
  if (
    player === undefined ||
    color === undefined ||
    player === null ||
    color === null ||
    player.trim().length === 0
  ) {
    return (
      <Content style={{ width: "fit-content", textAlign: "center !important" }}>
        <PreparationForm />
      </Content>
    );
  } else {
    return (
      <div id="preparation">
        <Content>
          <PreparationPlayer player={player} color={color} />
        </Content>
      </div>
    );
  }
};

export default Preparation;
