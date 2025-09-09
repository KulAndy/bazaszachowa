/* eslint-disable i18next/no-literal-string */
import Content from "../components/Content";
import { useI18n } from "../context/useI18n";
import logo from "../logo.svg";
import "../styles/Home.scss";

const Home = () => {
  const { t } = useI18n();
  return (
    <div id="home">
      <Content classNames={["float-left"] as const} contentId="left-content">
        <p>
          {t("home.useful_links")} <br />
        </p>
        {t("home.alternatives")}
        <ul>
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
        {t("home.free_chess_software")}
        <ul>
          <li>
            <a href="https://scidvspc.sourceforge.net/">scid vs pc</a>
          </li>
        </ul>
        {t("home.best_chess_engine")}
        <ul>
          <li>
            <a href="https://stockfishchess.org/">stockfish</a>
          </li>
        </ul>
        {t("home.fully_free_chess_site")}
        <ul>
          <li>
            <a href="https://lichess.org/">lichess</a>
          </li>
        </ul>
      </Content>
      <Content classNames={["float-left"] as const}>
        <img alt="Logo" id="logo" src={logo} />
      </Content>
      <Content classNames={["float-left"] as const} contentId="right-content">
        <article>
          <p>
            {t("home.manifest_part1")}
            <br />
            {t("home.manifest_part2")}
            <a href={t("home.honour_link")}>{t("home.honour")}</a>,{" "}
            <a href={t("home.dignity_link")}>{t("home.dignity")}</a>{" "}
            {t("home.and")}
            <a href={t("home.fair_play_link")}>{t("home.fair_play")}</a> .
            <br />
          </p>
          <hr />
          <p>
            {t("home.license_info")}{" "}
            <a href="/license"> {t("home.license_genitive")} </a> &#127866;.
          </p>
        </article>
      </Content>
    </div>
  );
};

export default Home;
