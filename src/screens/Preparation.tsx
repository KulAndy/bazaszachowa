import { useParams } from "react-router-dom";

import Content from "../components/app/Content";

import PreparationForm from "./PreparationForm";
import PreparationPlayer from "./PreparationPlayer";

const Preparation = () => {
  const { color, player } = useParams();

  const child =
    player === undefined ||
    color === undefined ||
    player === null ||
    color === null ||
    player.trim().length === 0 ? (
      <PreparationForm />
    ) : (
      <PreparationPlayer color={color} player={player} />
    );

  return (
    <div id="preparation">
      <Content style={{ width: "fit-content" } as const}>{child}</Content>
    </div>
  );
};

export default Preparation;
