import { Typography } from "@mui/material";

import Content from "../components/app/Content";
import Markdown from "../components/app/Markdown";
import { useI18n } from "../context/useI18n";

const audio = {
  de: {
    caption: "Chorus Viennensis - 'Leck mich im Arsch, K.231' (Mozart)",
    src: "/Mozart-Leck_mich_im_Arsch.mp3",
  },
  en: {
    caption: "Ted Nugent - 'Kiss my ass'",
    src: "/TED_NUGENT_-_Kiss_My_Ass.mp3",
  },
  pl: {
    caption: "Szymon Podwin - 'Całujcie mnie wszyscy w dupę' (Julian Tuwim)",
    src: "/Szymon-Podwin-Calujcie-mnie-wszyscy-w-dupe-Julian-Tuwim.mp3",
  },
};

const Rodo = () => {
  const { locale } = useI18n();
  const langAudio = audio[locale] ?? audio.en;

  return (
    <Content>
      <article>
        <Markdown screen="gdpr" />

        <Typography component="div">
          <audio autoPlay controls loop>
            <source src={langAudio.src} type="audio/mp3" />
          </audio>

          <figcaption>{langAudio.caption}</figcaption>
        </Typography>
      </article>
    </Content>
  );
};

export default Rodo;
