import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./reset.css";
import "./App.css";
import { URLS, NOMENU_URLS } from "./settings";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import Contact from "./screens/Contact";
import Rodo from "./screens/Rodo";
import License from "./screens/License";
import Players from "./screens/Players";
import Player from "./screens/Player";
import Game from "./screens/Game";
import Games from "./screens/Games";
import Preparation from "./screens/Preparation";
import Bug from "./screens/Bug";
import Docs from "./screens/Docs";
import { useTheme } from "./components/ThemeProvider";
import Cookies from "js-cookie";
import Downloads from "./screens/Downloads";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const storedTheme = Cookies.get("theme");
  if (storedTheme !== undefined && storedTheme !== theme) {
    toggleTheme();
  }

  return (
    <ErrorBoundary>
      <div className={`App ${theme}`}>
        <Router>
          <Menu links={URLS} />
          <ErrorBoundary>
            <Routes>
              <Route path={URLS.home.url} Component={Home} />
              <Route path={URLS.contact.url} Component={Contact} />
              <Route path={URLS.rodo.url} Component={Rodo} />
              <Route path={URLS.license.url} Component={License} />
              <Route path={URLS.players.url + ":name?"} Component={Players} />
              <Route
                path={NOMENU_URLS.profile + ":name/:color?/:opening?"}
                Component={Player}
              />
              <Route path={URLS.search.url} Component={Games} />
              <Route
                path={NOMENU_URLS.game + ":base/:gameid"}
                Component={Game}
              />
              <Route
                path={URLS.preparation.url + ":player?/:color?"}
                Component={Preparation}
              />
              <Route path={NOMENU_URLS.bug + ":base/:gameid"} Component={Bug} />
              <Route
                path={URLS.preparation.url + "/:color?"}
                Component={Preparation}
              />
              <Route path={NOMENU_URLS.docs + ":file?"} Component={Docs} />
              <Route path={URLS.downloads.url} Component={Downloads} />
              <Route path="*" Component={NotFound} />
            </Routes>
          </ErrorBoundary>
        </Router>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
