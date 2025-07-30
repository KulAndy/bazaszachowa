import Cookies from "js-cookie";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = () => {
    const storedTheme = Cookies.get("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return storedTheme || (prefersDarkMode ? "dark" : "light");
  };

  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    const storedTheme = Cookies.get("theme");
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    if (storedTheme === undefined) {
      setTheme(mediaQueryList.matches ? "dark" : "light");
    }

    const handleChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  const memoizedTheme = useMemo(() => theme, [theme]);

  // eslint-disable-next-line
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      Cookies.set("theme", newTheme, { expires: 365 });
      return newTheme;
    });
  };

  const contextValue = useMemo(
    () => ({ theme: memoizedTheme, toggleTheme }),
    [memoizedTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
