import { Box, Typography } from "@mui/material";

import Content from "../components/app/Content";
import { useI18n } from "../context/useI18n";

const NotFound = () => {
  const { t } = useI18n();
  return (
    <Content>
      <Box mt={4} textAlign="center">
        <Typography className="error" variant="h3">
          {t("not_found")}
        </Typography>
      </Box>
    </Content>
  );
};

export default NotFound;
