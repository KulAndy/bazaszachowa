import { FormControl, MenuItem, Select } from "@mui/material";

import type { Locale } from "../../context/I18nContext";
import { useI18n } from "../../context/useI18n";

const flagsDict: Record<Locale, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  pl: "🇵🇱",
};

const supportedLocales = Object.keys(flagsDict) as (keyof typeof flagsDict)[];

const LangToggle: React.FC = () => {
  const { locale, setLocale } = useI18n();

  return (
    <FormControl size="small" sx={{ minWidth: 100 } as const}>
      <Select
        displayEmpty
        onChange={(event) => setLocale(event.target.value)}
        value={locale}
      >
        {supportedLocales.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {flagsDict[lang]} {lang.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LangToggle;
