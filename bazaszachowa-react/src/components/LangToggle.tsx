import { IconButton, Tooltip } from "@mui/material";
import { useCallback } from "react";

import { useI18n } from "../context/useI18n";

const flagsDict: Record<string, string> = { en: "🇬🇧", pl: "🇵🇱" };

const LangToggle: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const newLang = locale === "pl" ? "en" : "pl";

  const handleLang = useCallback(() => {
    setLocale(newLang);
  }, [newLang, setLocale]);

  return (
    <Tooltip title={`Switch to ${newLang.toUpperCase()}`}>
      <IconButton color="inherit" onClick={handleLang}>
        {flagsDict[newLang] || "🌐"}
      </IconButton>
    </Tooltip>
  );
};

export default LangToggle;
