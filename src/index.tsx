import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import moment from "moment";
import "semantic-ui-css/semantic.min.css";

import "moment/locale/fr";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FirebaseProvider from "./context/firebase.context";
import DashboardPage from "./page/dashboard";
import StatementPage from "./page/statement";
import StatisticsPage from "./page/statistics";
import ConnectionComponent from "./page/connection";
import InscriptionComponent from "./page/inscription";

import { TemplateConnected } from "./component";
import { ToastContainer } from "react-toastify";

moment.locale("fr");

ReactDOM.render(
  <FirebaseProvider>
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/connection" exact>
            <ConnectionComponent />
          </Route>
          <Route path="/inscription" exact>
            <InscriptionComponent />
          </Route>
          <Route path="/statements" exact>
            <TemplateConnected>
              <DashboardPage />
            </TemplateConnected>
          </Route>
          <Route path="/statements/statement/:id" exact>
            <TemplateConnected>
              <StatementPage />
            </TemplateConnected>
          </Route>
          <Route path="/statistics" exact>
            <TemplateConnected>
              <StatisticsPage />
            </TemplateConnected>
          </Route>
        </Switch>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={15000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.StrictMode>
  </FirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
