import Content from "../components/Content";

const Home = () => {
  return (
    <div>
      <Content contentId="left_content" classNames={["float_left"]}>
        <p>
          Przydatne linki <br />
        </p>
        <ul>
          Alternatywa
          <li>
            <a href="https://www.yottachess.com/">yottachess</a>
          </li>
          <li>
            <a href="https://chess-results.com/PartieSuche.aspx?lan=3">
              chess-results
            </a>
          </li>
        </ul>
        <ul>
          Darmowy program szachowy
          <li>
            <a href="http://scidvspc.sourceforge.net/">scid vs pc</a>
          </li>
        </ul>
        <ul>
          Najlepszy silnik szachowy
          <li>
            <a href="https://stockfishchess.org/">stockfish</a>
          </li>
        </ul>
        <ul>
          W pełni wolna strona szachowa
          <li>
            <a href="https://lichess.org/">lichess</a>
          </li>
        </ul>
      </Content>
      <Content classNames={["float_left"]}>
        <article>
          <h1>Manifest</h1>
          <p>
            Z uwagi na to, że aktualnie w Polsce nie ma serwisu udostępniającego
            partie szachowe, bo jedyny istniejący został zawieszony, a jest to
            idea godna kontynuowania, lecz PZSzach, czy którykolwiek WZSzach nie
            jest zaintereseowany takim projektem, powstała ta strona. <br />
            Strona z założenia ma pomagać graczom w przygotowaniu, co pomoże w
            podwyższeniu poziomu sportowego. Osoby, które w nieuczciwy sposób
            chcą zyskać przewagę poprzez usunięcie ich z bazy powinny zapoznać
            się z takimi pojęciami jak
            <a href="https://pl.wikipedia.org/wiki/Honor_(etyka)">
              honor
            </a>,{" "}
            <a href="https://pl.wikipedia.org/wiki/Godno%C5%9B%C4%87">
              godność człowieka
            </a>{" "}
            i
            <a href="https://pl.wikipedia.org/wiki/Fair_play">
              postawa fair play
            </a>
            .<br />
          </p>
        </article>
        <hr />
        <p>
          Baza partii będzie aktualizowana mniej więcej raz na miesiąc i można z
          niej korzystać w zgodzie z zamieszczoną na stronie{" "}
          <a href="/license"> licencją </a> &#127866;.
        </p>
      </Content>
    </div>
  );
};

export default Home;
