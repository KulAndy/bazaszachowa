import { useLocation, useParams } from "react-router-dom";
import Content from "../components/Content";
import { NOMENU_URLS } from "../settings";
const NotFound = () => {
  const location = useLocation();
  const { base, gameid } = useParams();
  if (
    location.pathname.startsWith(`${NOMENU_URLS.game_raw}`) &&
    base &&
    gameid
  ) {
    window.location.reload();
  }
  return (
    <Content>
      <h1 className="error">Nie znaleziono strony</h1>
    </Content>
  );
};

export default NotFound;
