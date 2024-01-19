import Content from "../components/Content";
import audio from "../Szymon-Podwin-_Całujcie-mnie-wszyscy-w-dupę_-_Julian-Tuwim_.mp3";

const Rodo = () => {
  return (
    <Content>
      <article>
        Drodzy fani RODO, wasze partie nie zostaną usunięte, bo w momencie
        opublikowania zapisu partii, tak jak nagrania w każdym inny sporcie,
        trafia on ( razem z nazwiskami czy wynikami ) do domeny publicznej. Co
        za tym idzie wszyscy mają do niego pełne prawa.
        <br />
        <br />
        Z dedykacją dla was zamieszczam tę piosenkę.
        <br />
        <br />
        <iframe
          title="całujcie mnie wszyscy w dupę"
          src={audio}
          frameborder="0"
          allow="autoplay"
        ></iframe>
        <figcaption>
          Szymon Podwin - "Całujcie mnie wszyscy w dupę" (Julian Tuwim)
        </figcaption>
      </article>
    </Content>
  );
};

export default Rodo;
