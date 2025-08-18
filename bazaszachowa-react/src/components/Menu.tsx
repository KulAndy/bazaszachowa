import { Link } from "react-router-dom";

import ColorSchemeToggle from "./ColorSchemeToggle";
import LangToggle from "./LangToggle";

const Menu = ({
  links,
}: {
  links: Record<string, { name: string; url: string }>;
}) => {
  const menuNavigation = (
    <>
      <li>
        <ColorSchemeToggle />
      </li>
      <li>
        <LangToggle />
      </li>
      {Object.keys(links).map((key) => (
        <li key={key}>
          <Link to={links[key].url}>{links[key].name}</Link>
        </li>
      ))}
    </>
  );

  return (
    <nav>
      <ul className="desktop">{menuNavigation}</ul>
      <details className="mobile">
        <summary>menu</summary>
        <ul>{menuNavigation} </ul>
      </details>
    </nav>
  );
};

export default Menu;
