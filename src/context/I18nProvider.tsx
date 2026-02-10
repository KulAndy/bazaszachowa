import Cookies from "js-cookie";
import Polyglot from "node-polyglot";
import { useMemo, useState } from "react";

import de from "../i18n/de.json";
import en from "../i18n/en.json";
import pl from "../i18n/pl.json";

import { I18nContext, isLocale, type Locale } from "./I18nContext";

const dictionaries: Record<Locale, Record<string, string>> = {
  de,
  en,
  pl,
};

const detectLocale = (): Locale => {
  const cookieLocale = Cookies.get("locale");
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.slice(0, 2);
    if (isLocale(browserLang)) {
      return browserLang;
    }
  }
  return "en";
};

export const I18nProvider: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const [localeState, setLocaleState] = useState<Locale>(detectLocale);

  const polyglot = useMemo(
    () =>
      new Polyglot({ locale: localeState, phrases: dictionaries[localeState] }),
    [localeState],
  );

  const t = (key: string, options?: number | Polyglot.InterpolationOptions) =>
    polyglot.t(key, options);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    Cookies.set("locale", newLocale);
  };

  return (
    <I18nContext value={{ locale: localeState, setLocale, t } as const}>
      {children}
    </I18nContext>
  );
};
