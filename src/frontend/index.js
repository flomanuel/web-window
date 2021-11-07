import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NewEntry from "./components/NewEntry";
import Settings from "./components/Settings";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/new-entry" component={NewEntry}/>
            <Route exact path="*" component={Settings}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('app-root'));
