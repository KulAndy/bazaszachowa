import { isString, noop } from "es-toolkit";
import Polyglot from "node-polyglot";
import { createContext } from "react";

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: number | Polyglot.InterpolationOptions) => string;
}

export type Locale = "de" | "en" | "pl";

export const isLocale = (value: unknown): value is Locale =>
  isString(value) && ["de", "en", "pl"].includes(value);

const defaultI18nContext: I18nContextType = {
  locale: "pl",
  setLocale: noop,
  t: (key: string) => key,
};

export const I18nContext = createContext<I18nContextType>(defaultI18nContext);
