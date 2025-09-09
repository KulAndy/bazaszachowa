import { useTheme } from "../context/useTheme";

const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="toggle-button" onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "🔆"}
    </button>
  );
};

export default ColorSchemeToggle;
