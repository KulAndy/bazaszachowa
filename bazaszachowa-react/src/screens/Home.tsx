import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";
import logo from "../logo.svg";
import "./Home.css";

const Home = () => {
  const { t } = useI18n();
  return (
    <div id="home">
      <Content classNames={["float_left"]} contentId="left_content">
        <p>
          {t("usefull_links")} <br />
        </p>
        <ul>
          {t("alternatives")}
          <li>
            <a href="https://www.yottachess.com/">yottachess</a>
          </li>
          <li>
            <a href="https://www.chessbites.com/">chessbites</a>
          </li>
          <li>
            <a href="https://chessify.me/analysis/chess-database">chessify</a>
          </li>
          <li>
            <a href="https://chess-results.com/PartieSuche.aspx?lan=3">
              chess-results
            </a>
          </li>
        </ul>
        <ul>
          {t("free_chess_software")}
          <li>
            <a href="http://scidvspc.sourceforge.net/">scid vs pc</a>
          </li>
        </ul>
        <ul>
          {t("best_chess_engine")}
          <li>
            <a href="https://stockfishchess.org/">stockfish</a>
          </li>
        </ul>
        <ul>
          {t("fully_free_chess_site")}
          <li>
            <a href="https://lichess.org/">lichess</a>
          </li>
        </ul>
      </Content>
      <Content classNames={["float_left"]}>
        <img alt="Logo" id="logo" src={logo} />
      </Content>
      <Content classNames={["float_left"]} contentId="right_content">
        <article>
          <p>
            {t("manifest_part1")}
            <br />
            {t("manifest_part2")}
            <a href={t("honour_link")}>{t("honour")}</a>,{" "}
            <a href={t("dignity_link")}>{t("dignity")}</a> {t("and")}
            <a href={t("fair_play_link")}>{t("fair_play")}</a> .
            <br />
          </p>
          <hr />
          <p>
            {t("license_info")} <a href="/license"> {t("license_genitive")} </a>{" "}
            &#127866;.
          </p>
        </article>
      </Content>
    </div>
  );
};

export default Home;
