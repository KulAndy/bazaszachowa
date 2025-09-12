import { Typography } from "@mui/material";

import Content from "../components/Content";
import { useI18n } from "../context/useI18n";

const Rodo = () => {
  const { t } = useI18n();
  return (
    <Content>
      <article>
        <Typography component="p">{t("gdpr.gdpr_info")}</Typography>
        <Typography component="p">{t("gdpr.gdpr_dedication")}</Typography>
        <iframe
          allow="autoplay"
          src={t("gdpr.kiss_my_ass_link")}
          title={t("gdpr.kiss_my_ass_title")}
        ></iframe>
        <figcaption>{t("gdpr.kiss_my_ass_caption")} </figcaption>{" "}
      </article>
    </Content>
  );
};

export default Rodo;
