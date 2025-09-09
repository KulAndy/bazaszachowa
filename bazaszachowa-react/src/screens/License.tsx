import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";
import { NOMENU_URLS } from "../settings";

const License = () => {
  const { t } = useI18n();

  return (
    <Content>
      <article>
        {t("license.intro")}:
        <ul>
          {t("license.user")}
          <li>{t("license.right_use")}</li>
          <li>{t("license.right_analyze")}</li>
          <li>{t("license.right_copy")}</li>
          <li>{t("license.right_improve")}</li>
          <li>{t("license.no_change_license")}</li>
          <li>{t("license.no_commercial")}</li>
          <li>{t("license.search_obligation")}</li>
          <li>{t("license.beer_for_author")}</li>
          <li>{t("license.error_reports")}</li>
        </ul>
        <sub>
          {t("license.source_code")}{" "}
          <a href="https://github.com/KulAndy/bazaszachowa">
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            frontend
          </a>{" "}
          {t("license.and")}{" "}
          <a href="https://github.com/KulAndy/bazaszachowa-api">
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            backend
          </a>
        </sub>
        <hr />
        {t("license.other_cases")}{" "}
        <a href="https://www.gnu.org/licenses/agpl-3.0.html">
          {
            // eslint-disable-next-line i18next/no-literal-string
          }
          GNU AGPLv3
        </a>
        <hr />
        <a href={NOMENU_URLS.docs}>{t("license.docs")}</a>
      </article>
    </Content>
  );
};

export default License;
