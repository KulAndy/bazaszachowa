import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { useTheme } from "../context/useTheme";

const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

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
