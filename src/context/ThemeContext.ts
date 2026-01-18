import { noop } from "es-toolkit";
import { createContext } from "react";

export const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: noop,
});
