import { Box, Link, Typography } from "@mui/material";

import { useI18n } from "../../context/useI18n";
import { admin_mail } from "../../settings";

const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <Box component="footer" sx={{ mt: 4, py: 2, textAlign: "center" } as const}>
      <Typography gutterBottom variant="body2">
        {t("footer.info")}:{" "}
        <Link
          href="https://zrzutka.pl/z/bazaszachowa"
          rel="noopener"
          target="_blank"
        >
          {t("footer.collection")}
        </Link>
      </Typography>
      <hr />
      <Typography component="div" variant="body2">
        <address>
          <span className="copyleft">©</span>{" "}
          <Link href={`mailto:${admin_mail}`} underline="hover">
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            Andrzej Kulesza
          </Link>{" "}
          2026
        </address>
      </Typography>
    </Box>
  );
};

export default Footer;
