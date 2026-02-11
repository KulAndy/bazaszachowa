import "../styles/Preparation.css";

import { useParams } from "react-router-dom";

import Content from "../components/app/Content";

import PreparationForm from "./PreparationForm";
import PreparationPlayer from "./PreparationPlayer";

const Preparation = () => {
  const { color, player } = useParams();
  return player === undefined ||
    color === undefined ||
    player === null ||
    color === null ||
    player.trim().length === 0 ? (
    <Content style={{ textAlign: "center", width: "fit-content" } as const}>
      <PreparationForm />
    </Content>
  ) : (
    <div id="preparation">
      <Content>
        <PreparationPlayer color={color} player={player} />
      </Content>
    </div>
  );
};

export default Preparation;
