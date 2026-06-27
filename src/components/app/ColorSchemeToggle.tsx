import Brightness4 from "@mui/icons-material/Brightness4";
import Brightness7 from "@mui/icons-material/Brightness7";
import { IconButton, Tooltip } from "@mui/material";
import { use } from "react";

import { ThemeContext } from "../../context/ThemeContext";

const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = use(ThemeContext);

  return (
    <Tooltip
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <IconButton color="inherit" onClick={toggleTheme}>
        {theme === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ColorSchemeToggle;
