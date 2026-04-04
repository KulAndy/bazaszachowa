import { noop } from "es-toolkit";
import { createContext } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: noop,
});
