import { FormControl, MenuItem, Select } from "@mui/material";

import type { Locale } from "../../context/I18nContext";
import { useI18n } from "../../context/useI18n";

import "flag-icons/css/flag-icons.min.css";

const flagsDict: Record<Locale, string> = {
  de: "de",
  en: "gb",
  pl: "pl",
};

const supportedLocales = Object.keys(flagsDict) as Locale[];

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
            <span
              className={`fi fi-${flagsDict[lang]}`}
              style={{ marginRight: 8 } as const}
            />
            {lang.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LangToggle;
