import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import moment from "moment";
import "semantic-ui-css/semantic.min.css";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./context/firebase.context";
import Dashboard from "./page/dashboard";
import { TemplateConnected } from "./component";

import "moment/locale/fr";
moment.locale("fr");

ReactDOM.render(
  <FirebaseProvider>
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/dashboard" exact>
            <TemplateConnected>
              <Dashboard />
            </TemplateConnected>
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  </FirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
