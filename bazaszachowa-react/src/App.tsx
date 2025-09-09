import Cookies from "js-cookie";
import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import { useTheme } from "./context/useTheme";
import { NOMENU_URLS, URLS } from "./settings";

import "./styles/reset.css";
import "./styles/App.scss";

const Bug = lazy(() => import("./screens/Bug"));
const Contact = lazy(() => import("./screens/Contact"));
const Documentation = lazy(() => import("./screens/Documentation"));
const Downloads = lazy(() => import("./screens/Downloads"));
const Game = lazy(() => import("./screens/Game"));
const Games = lazy(() => import("./screens/Games"));
const Home = lazy(() => import("./screens/Home"));
const License = lazy(() => import("./screens/License"));
const NotFound = lazy(() => import("./screens/NotFound"));
const Player = lazy(() => import("./screens/Player"));
const Players = lazy(() => import("./screens/Players"));
const Preparation = lazy(() => import("./screens/Preparation"));
const Rodo = lazy(() => import("./screens/Rodo"));

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
