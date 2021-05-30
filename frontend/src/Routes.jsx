import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LandingPage, JoinPage, NewGamePage, GamePage } from "./pages";

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/create">
        <NewGamePage />
      </Route>
      <Route path="/join">
        <JoinPage />
      </Route>
      <Route path="/play">
        <GamePage />
      </Route>
      <Route path="/">
        <LandingPage />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
