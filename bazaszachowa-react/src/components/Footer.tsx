import { useI18n } from "../i18n/I18nContext";
import { admin_mail } from "../settings";

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer>
      <p>
        {t("footer.info")}:{" "}
        <a href="https://zrzutka.pl/z/bazaszachowa">{t("footer.collection")}</a>
      </p>
      <hr />
      <p>
        <address>
          <span className="copyleft">©</span>
          <a href={`mailto:${admin_mail}`}>Andrzej Kulesza</a>
          2025
        </address>
      </p>
    </footer>
  );
};

export default Footer;
