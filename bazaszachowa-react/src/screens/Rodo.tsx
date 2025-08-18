import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";

const Rodo = () => {
  const { t } = useI18n();
  return (
    <Content>
      <article>
        {t("gdpr_info")}
        <br />
        <br />
        {t("gdpr_dedication")}
        <br />
        <br />
        <iframe
          allow="autoplay"
          src={t("kiss_my_ass_link")}
          title={t("kiss_my_ass_title")}
        ></iframe>
        <figcaption>{t("kiss_my_ass_caption")} </figcaption>
      </article>
    </Content>
  );
};

export default Rodo;
