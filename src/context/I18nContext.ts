import { noop } from "es-toolkit";
import Polyglot from "node-polyglot";
import { createContext } from "react";

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: number | Polyglot.InterpolationOptions) => string;
}

export type Locale = "en" | "pl";

const defaultI18nContext: I18nContextType = {
  locale: "pl",
  setLocale: noop,
  t: (key: string) => key,
};

export const I18nContext = createContext<I18nContextType>(defaultI18nContext);
