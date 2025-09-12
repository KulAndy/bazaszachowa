import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import Cookies from "js-cookie";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ThemeContext } from "./ThemeContext";

const getInitialTheme = () => {
  const storedTheme = Cookies.get("theme");
  const prefersDarkMode = globalThis.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  return storedTheme || (prefersDarkMode ? "dark" : "light");
};

export const ThemeProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    const storedTheme = Cookies.get("theme");
    const mediaQueryList = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    if (storedTheme === undefined) {
      setTheme(mediaQueryList.matches ? "dark" : "light");
    }

    const handleChange = (event: MediaQueryListEvent) =>
      setTheme(event.matches ? "dark" : "light");

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => {
      const newTheme = previousTheme === "light" ? "dark" : "light";
      Cookies.set("theme", newTheme, { expires: 365 });
      return newTheme;
    });
  }, []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          background: { default: "var(--document-background)" },
          mode: theme === "light" ? "light" : "dark",
        },
      }),
    [theme],
  );

  const contextValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
