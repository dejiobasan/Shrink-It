import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import Form from "./form";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" Component={Form} />
              <Route path="/app" Component={Form} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
