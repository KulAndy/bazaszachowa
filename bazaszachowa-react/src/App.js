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

const App = () => {
    return (
        <div className="App">
            <Menu links={URLS} />
            <Router>
                <Routes>
                    <Route path={URLS.home.url} element={<Home />} />
                    <Route path={URLS.contact.url} element={<Contact />} />
                    <Route path={URLS.rodo.url} element={<Rodo />} />
                    <Route path={URLS.license.url} element={<License />} />
                    <Route path={URLS.players.url + ":name?"} element={<Players />} />
                    <Route
                        path={NOMENU_URLS.profile + ":name/:color?/:opening?"}
                        element={<Player />}
                    />
                    <Route path={URLS.search.url} element={<Games />} />
                    <Route path={NOMENU_URLS.game + ":base/:gameid"} element={<Game />} />
                    <Route
                        path={URLS.preparation.url + ":player?/:color?"}
                        element={<Preparation />}
                    />
                    <Route path={NOMENU_URLS.bug + ":base/:gameid"} element={<Bug />} />
                    <Route
                        path={URLS.preparation.url + "/:color?"}
                        element={<Preparation />}
                    />
                    <Route path={NOMENU_URLS.docs + ":file?"} element={<Docs />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <Footer />
        </div>
    );
};

export default App;
