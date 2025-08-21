import React from "react";
import { Link } from "react-router-dom";

import { useI18n } from "../i18n/I18nContext";

import ColorSchemeToggle from "./ColorSchemeToggle";
import LangToggle from "./LangToggle";

const Menu = ({
  links,
}: {
  readonly links: Record<string, { name: string; url: string }>;
}) => {
  const { t } = useI18n();
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
          <Link to={links[key].url}>{t(links[key].name)}</Link>
        </li>
      ))}
    </>
  );

  return (
    <nav>
      <ul className="desktop">{menuNavigation}</ul>
      <details className="mobile">
        <summary>{t("menu.menu")}</summary>
        <ul>{menuNavigation} </ul>
      </details>
    </nav>
  );
};

export default Menu;
