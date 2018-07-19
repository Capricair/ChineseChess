import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";

let DiagonalPos = [
    {pos: ["1-4", "2-5", "8-4", "9-5"], value: <div className="diagonal diagonal-ac"/>},
    {pos: ["1-5", "2-4", "8-5", "9-4"], value: <div className="diagonal diagonal-bd"/>},
];

let ArmsPos = [
    {pos: ["2-1", "2-7", "3-4", "3-6", "6-2", "6-4", "6-6", "6-8"], value: <div className="serif serif-lower-right"/>},
    {pos: ["2-2", "2-8", "3-3", "3-5", "6-1", "6-3", "6-5", "6-7"], value: <div className="serif serif-lower-left"/>},
    {pos: ["4-1", "4-3", "4-5", "4-7", "7-3", "7-5", "8-2", "8-8"], value: <div className="serif serif-upper-left"/>},
    {pos: ["4-2", "4-4", "4-6", "4-8", "7-4", "7-6", "8-1", "8-7"], value: <div className="serif serif-upper-right"/>},
    {pos: ["3-2", "3-8", "7-1", "7-7"], value: <div className="serif serif-diagonal-ac"/>},
    {pos: ["3-1", "3-7", "7-2", "7-8"], value: <div className="serif serif-diagonal-bd"/>},
];

export default class ChineseChess extends BaseComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    getPosObj(pos, i, j){
        for (let item of pos){
            if (item.pos.includes(`${i}-${j}`)){
                return item.value;
            }
        }
        return null;
    }

    getChessBoard() {
        let rows = [];
        for (let i = 1; i < 10; i++) {
            let cols = [];
            for (let j = 1; j < 9; j++) {
                let classNames = [];
                let diagonal = null;
                let arms = null;

                diagonal = this.getPosObj(DiagonalPos, i, j);
                arms = this.getPosObj(ArmsPos, i, j);

                cols.push((
                    <td key={`${i}-${j}`} data-pos={`${i}-${j}`}>
                        {diagonal}
                        {arms}
                        <div className={classNames.join(" ")}></div>
                    </td>
                ))
            }
            rows.push((
                <tr key={i}>
                    {i === 5 ? <td colSpan={8} className="chu-river">
                        <div/>
                    </td> : cols}
                </tr>
            ))
        }
        return (
            <table className="chessboard">
                <tbody>{rows}</tbody>
            </table>
        );
    }

    render() {
        return (
            <div className="chinese-chess">
                <div className="container">
                    <div className="wrapper">
                        {this.getChessBoard()}
                    </div>
                </div>
            </div>
        )
    }
}