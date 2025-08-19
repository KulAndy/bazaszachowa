import Cookies from "js-cookie";
import Polyglot from "node-polyglot";
import React, { createContext, useContext, useEffect, useState } from "react";

import en from "./en.json";
import pl from "./pl.json";

type Locale = "en" | "pl";

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  pl,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: number | Polyglot.InterpolationOptions) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

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

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <I18nContext.Provider value={{ locale: localeState, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
