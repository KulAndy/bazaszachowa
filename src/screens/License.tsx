import { Box, Divider, Link, Typography } from "@mui/material";

import Content from "../components/app/Content";
import { useI18n } from "../context/useI18n";
import { NOMENU_URLS } from "../settings";

const License = () => {
  const { t } = useI18n();

  return (
    <Content>
      <Box component="article">
        <Typography gutterBottom variant="body1">
          {t("license.intro")}:
        </Typography>
        {t("license.user")}
        <ul>
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
        <Typography
          component="sub"
          gutterBottom
          sx={{ display: "block" } as const}
          variant="body2"
        >
          {t("license.source_code")}{" "}
          <Link
            href="https://github.com/KulAndy/bazaszachowa"
            rel="noopener"
            target="_blank"
          >
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            frontend
          </Link>{" "}
          {t("license.and")}{" "}
          <Link
            href="https://github.com/KulAndy/bazaszachowa-api"
            rel="noopener"
            target="_blank"
          >
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            backend
          </Link>
        </Typography>
        <Divider sx={{ my: 2 } as const} />
        <Typography gutterBottom variant="body1">
          {t("license.other_cases")}{" "}
          <Link
            href="https://www.gnu.org/licenses/agpl-3.0.html"
            rel="noopener"
            target="_blank"
          >
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            GNU AGPLv3
          </Link>
        </Typography>
        <Divider sx={{ my: 2 } as const} />
        <Link href={NOMENU_URLS.docs}>{t("license.docs")}</Link>
      </Box>
    </Content>
  );
};

export default License;
