import Cookies from "js-cookie";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import { useTheme } from "./components/ThemeProvider";
import Bug from "./screens/Bug";
import Contact from "./screens/Contact";
import Documentation from "./screens/Documentation";
import Downloads from "./screens/Downloads";
import Game from "./screens/Game";
import Games from "./screens/Games";
import Home from "./screens/Home";
import License from "./screens/License";
import NotFound from "./screens/NotFound";
import Player from "./screens/Player";
import Players from "./screens/Players";
import Preparation from "./screens/Preparation";
import Rodo from "./screens/Rodo";
import { NOMENU_URLS, URLS } from "./settings";

import "./styles/reset.css";
import "./styles/App.scss";

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const storedTheme = Cookies.get("theme");
  if (storedTheme !== undefined && storedTheme !== theme) {
    toggleTheme();
  }

  return (
    <ErrorBoundary>
      <div className={`app ${theme}`}>
        <Router>
          <Menu links={URLS} />
          <div id="main">
            <ErrorBoundary>
              <Routes>
                <Route Component={Home} path={URLS.home.url} />
                <Route Component={Contact} path={URLS.contact.url} />
                <Route Component={Rodo} path={URLS.rodo.url} />
                <Route Component={License} path={URLS.license.url} />
                <Route Component={Players} path={`${URLS.players.url}:name?`} />
                <Route
                  Component={Player}
                  path={`${NOMENU_URLS.profile}:name/:color?/:opening?`}
                />
                <Route Component={Games} path={URLS.search.url} />
                <Route
                  Component={Game}
                  path={`${NOMENU_URLS.game}:base/:gameid`}
                />
                <Route
                  Component={Preparation}
                  path={`${URLS.preparation.url}:player?/:color?`}
                />
                <Route
                  Component={Bug}
                  path={`${NOMENU_URLS.bug}:base/:gameid`}
                />
                <Route
                  Component={Documentation}
                  path={`${NOMENU_URLS.docs}:file?`}
                />
                <Route Component={Downloads} path={URLS.downloads.url} />
                <Route Component={NotFound} path="*" />
              </Routes>
            </ErrorBoundary>
          </div>
        </Router>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
