import "./style/base.scss";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import ChineseChess from "./views/main/index";

const Routes = (
    <Router>
        <Route path="/" component={ChineseChess}/>
    </Router>
);

ReactDOM.render(Routes, document.getElementById("app"));

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}