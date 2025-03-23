import ColorSchemeToggle from "./ColorSchemeToggle";
import { useTheme } from "./ThemeProvider";
import { Link } from "react-router-dom";

const Menu = ({
  links,
}: {
  links: { [x: string]: { name: string; url: string } };
}) => {
  const { theme } = useTheme();

  return (
    <nav>
      <ul className="desktop">
        <li>
          <ColorSchemeToggle text={theme === "light" ? "🌙" : "🔆"} />
        </li>
        {Object.keys(links).map((key) => (
          <li key={key}>
            <Link to={links[key].url}>{links[key].name}</Link>
          </li>
        ))}
      </ul>
      <details className="mobile">
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
