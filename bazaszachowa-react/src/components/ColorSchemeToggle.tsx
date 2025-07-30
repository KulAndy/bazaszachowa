import React from "react";

import { useTheme } from "./ThemeProvider";

interface ColorSchemeToggleProps {
  text: string;
}

const ColorSchemeToggle: React.FC<ColorSchemeToggleProps> = ({ text }) => {
  const { toggleTheme } = useTheme();

  return (
    <button className="toggle-button" onClick={toggleTheme}>
      {text}
    </button>
  );
};

export default ColorSchemeToggle;
