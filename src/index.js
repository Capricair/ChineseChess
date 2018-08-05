import "./style/index.scss";
import "./fonts/icomoon/style.scss";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Redirect} from "react-router-dom";

import Login from "./views/index/index";
import Hall from "./views/hall/index";
import ChineseChess from "./views/main/index";

const Routes = (
    <BrowserRouter>
        <div>
            <Route path="/" exact component={Login}/>
            <Route path="/hall" component={Hall}/>
            <Route path="/game" component={ChineseChess}/>
        </div>
    </BrowserRouter>
);

ReactDOM.render(Routes, document.getElementById("app"));

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}