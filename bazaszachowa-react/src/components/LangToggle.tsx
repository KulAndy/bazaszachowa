import React from "react";

import { useI18n } from "../i18n/I18nContext";

const LangToggle = () => {
  const { locale, setLocale } = useI18n();
  const newLang = locale === "pl" ? "en" : "pl";

  return (
    <button
      className="toggle-button"
      onClick={() => {
        setLocale(newLang);
      }}
    >
      {newLang}
    </button>
  );
};

export default LangToggle;
