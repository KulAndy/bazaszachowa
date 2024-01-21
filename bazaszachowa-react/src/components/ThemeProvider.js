import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const storedTheme = Cookies.get("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    return storedTheme !== undefined
      ? storedTheme
      : prefersDarkMode
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const storedTheme = Cookies.get("theme");
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    if (storedTheme === undefined) {
      setTheme(mediaQueryList.matches ? "dark" : "light");
    }

    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");

    handleChange(mediaQueryList);

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  const memoizedTheme = useMemo(() => theme, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      Cookies.set("theme", newTheme, { expires: 365 });
      return newTheme;
    });
  };

  const contextValue = useMemo(
    () => ({ theme: memoizedTheme, toggleTheme }),
    [memoizedTheme, toggleTheme]
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
