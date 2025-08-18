import React from "react";

import { useTheme } from "./ThemeProvider";

const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="toggle-button" onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "🔆"}
    </button>
  );
};

export default ColorSchemeToggle;
