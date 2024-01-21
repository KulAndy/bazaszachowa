import React from "react";
import { useTheme } from "./ThemeProvider";

const ColorSchemeToggle = ({ text }) => {
  const { toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="toggle-button">
      {text}
    </button>
  );
};

export default ColorSchemeToggle;
