import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import Chessboard from "./chessboard/index";
import ChessBook from "./chessbook/index";

export default class ChineseChess extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            log: [],
        };
    }

    onMoveHandler(piece, from, to){
        this.record(piece, from, to);
    }

    record(piece, from, to){
        let {log} = this.state;
        let [fromX, fromY] = (from || "").split(",").map(x => parseInt(x));
        let [toX, toY] = (to || "").split(",").map(x => parseInt(x));
        log.push({
            ...piece,
            from: {x: fromX, y: fromY},
            to: {x: toX, y: toY},
        });
        this.setState({
            log: log,
        })
    }

    render() {
        return (
            <div className="chinese-chess">
                <div className="container">
                    <div className="wrapper">
                        <Chessboard
                            onMove={(piece, from, to)=>{
                                this.onMoveHandler(piece, from, to)
                            }}
                        />
                        <ChessBook data={this.state.log}/>
                    </div>
                </div>
            </div>
        )
    }
}