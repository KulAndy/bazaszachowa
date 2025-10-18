import { IconButton, Tooltip } from "@mui/material";

import { useI18n } from "../context/useI18n";

const flagsDict: Record<string, string> = { en: "🇬🇧", pl: "🇵🇱" };

const LangToggle: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const newLang = locale === "pl" ? "en" : "pl";

  return (
    <Tooltip title={`Switch to ${newLang.toUpperCase()}`}>
      <IconButton
        color="inherit"
        onClick={() => {
          setLocale(newLang);
        }}
      >
        {flagsDict[newLang] || "🌐"}
      </IconButton>
    </Tooltip>
  );
};

export default LangToggle;
