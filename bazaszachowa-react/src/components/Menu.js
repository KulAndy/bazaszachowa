import ColorSchemeToggle from "./ColorSchemeToggle";
import { useTheme } from "./ThemeProvider";
import { Link } from "react-router-dom";

const Menu = ({ links }) => {
  const { theme } = useTheme();

  return (
    <nav>
      <ul class="desktop">
        <li>
          <ColorSchemeToggle text={theme === "light" ? "🌙" : "🔆"} />
        </li>
        {Object.keys(links).map((key) => (
          <li key={key}>
            <Link to={links[key].url}>{links[key].name}</Link>
          </li>
        ))}
      </ul>
      <details class="mobile">
        <summary>menu</summary>
        <ul>
          <li>
            <ColorSchemeToggle text={theme === "light" ? "🌙" : "🔆"} />
          </li>
          {Object.keys(links).map((key) => (
            <li key={key}>
              <Link to={links[key].url}>{links[key].name}</Link>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
};

export default Menu;
