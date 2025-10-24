import Cookies from "js-cookie";
import Polyglot from "node-polyglot";
import { useEffect, useState } from "react";

import en from "../i18n/en.json";
import pl from "../i18n/pl.json";

import { I18nContext } from "./I18nContext";

type Locale = "en" | "pl";

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  pl,
};

const detectLocale = (): Locale => {
  const cookieLocale = Cookies.get("locale");
  if (cookieLocale === "pl" || cookieLocale === "en") {
    return cookieLocale;
  }
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === "pl") {
      return "pl";
    }
  }
  return "en";
};

export const I18nProvider: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const [localeState, setLocaleState] = useState<Locale>(detectLocale);

  const [polyglot, setPolyglot] = useState(
    () =>
      new Polyglot({ locale: localeState, phrases: dictionaries[localeState] }),
  );

  useEffect(() => {
    const phrases = dictionaries[localeState];
    setPolyglot(new Polyglot({ locale: localeState, phrases }));
    Cookies.set("locale", localeState);
  }, [localeState]);

  const t = (key: string, options?: number | Polyglot.InterpolationOptions) =>
    polyglot.t(key, options);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  return (
    <I18nContext value={{ locale: localeState, setLocale, t } as const}>
      {children}
    </I18nContext>
  );
};
