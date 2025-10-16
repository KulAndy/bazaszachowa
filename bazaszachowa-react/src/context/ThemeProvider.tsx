import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import Cookies from "js-cookie";
import { type ReactNode, useEffect, useState } from "react";

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

  const toggleTheme = () => {
    setTheme((previousTheme) => {
      const newTheme = previousTheme === "light" ? "dark" : "light";
      Cookies.set("theme", newTheme, { expires: 365 });
      return newTheme;
    });
  };

  const muiTheme = createTheme({
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--document-footer)",
          },
        },
      },
    },
    palette: {
      background: { default: "var(--document-background)" },
      mode: theme === "light" ? "light" : "dark",
    },
  });

  return (
    // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
