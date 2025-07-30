import "./Preparation.css";
import React from "react";
import { useParams } from "react-router-dom";

import Content from "../components/Content";

import PreparationForm from "./PreparationForm";
import PreparationPlayer from "./PreparationPlayer";

const Preparation = () => {
  const { color, player } = useParams();
  if (
    player === undefined ||
    color === undefined ||
    player === null ||
    color === null ||
    player.trim().length === 0
  ) {
    return (
      <Content style={{ textAlign: "center", width: "fit-content" }}>
        <PreparationForm />
      </Content>
    );
  } else {
    return (
      <div id="preparation">
        <Content>
          <PreparationPlayer color={color} player={player} />
        </Content>
      </div>
    );
  }
};

export default Preparation;
