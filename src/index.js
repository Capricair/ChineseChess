import "./style/base.scss";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Redirect} from "react-router-dom";

import ChineseChess from "./views/main/index";

const Routes = (
    <BrowserRouter>
        <Route path="/" component={ChineseChess}/>
    </BrowserRouter>
);

ReactDOM.render(Routes, document.getElementById("app"));

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}