import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import Chessboard from "../chessboard/index";

export default class ChineseChess extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="chinese-chess">
                <div className="container">
                    <div className="wrapper">
                        <Chessboard/>
                    </div>
                </div>
            </div>
        )
    }
}