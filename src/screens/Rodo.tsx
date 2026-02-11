import { Typography } from "@mui/material";

import Content from "../components/app/Content";
import { useI18n } from "../context/useI18n";

const Rodo = () => {
  const { t } = useI18n();
  return (
    <Content>
      <article>
        <Typography component="p">{t("gdpr.gdpr_info")}</Typography>
        <Typography component="p">{t("gdpr.gdpr_dedication")}</Typography>
        <audio autoPlay controls loop>
          <source src={t("gdpr.kiss_my_ass_link")} type="audio/mp3" />
        </audio>
        <figcaption>{t("gdpr.kiss_my_ass_caption")} </figcaption>{" "}
      </article>
    </Content>
  );
};

export default Rodo;
