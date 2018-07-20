import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import {King, Rook, Knight, Bishop, Guard, Cannon, Pawn} from "../chess/index";
import {PieceType} from "../../enums/index";

let DiagonalPos = [
    {pos: ["1-4", "2-5", "8-4", "9-5"], value: <div className="diagonal diagonal-ac"/>},
    {pos: ["1-5", "2-4", "8-5", "9-4"], value: <div className="diagonal diagonal-bd"/>},
];

let SerifPos = [
    {pos: ["2-1", "2-7", "3-4", "3-6", "6-2", "6-4", "6-6", "6-8"], value: <div className="serif serif-lower-right"/>},
    {pos: ["2-2", "2-8", "3-3", "3-5", "6-1", "6-3", "6-5", "6-7"], value: <div className="serif serif-lower-left"/>},
    {pos: ["4-1", "4-3", "4-5", "4-7", "7-3", "7-5", "8-2", "8-8"], value: <div className="serif serif-upper-left"/>},
    {pos: ["4-2", "4-4", "4-6", "4-8", "7-4", "7-6", "8-1", "8-7"], value: <div className="serif serif-upper-right"/>},
    {pos: ["3-2", "3-8", "7-1", "7-7"], value: <div className="serif serif-diagonal-ac"/>},
    {pos: ["3-1", "3-7", "7-2", "7-8"], value: <div className="serif serif-diagonal-bd"/>},
];

export default class ChessBoard extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            data: [],
        };
    }

    init(firstMove){

    }

    positionClickHandler(i, j) {

    }

    getPosValue(pos, i, j) {
        for (let item of pos) {
            if (item.pos.includes(`${i}-${j}`)) {
                return item.value;
            }
        }
        return null;
    }

    createChessPosition(i, j, classNames, chess) {
        return <div key={`${i}-${j}-${classNames}`}
                    className={classNames}
                    onClick={() => {
                        this.positionClickHandler(i, j)
                    }}>{chess}</div>
    }

    getChessPosition(i, j) {
        let pos = [this.createChessPosition(i, j, "chess-pos")];
        let padding = null;
        if ([4, 9].includes(i) && j === 8) {
            padding = [
                this.createChessPosition(i, j, "chess-pos last-col"),
                this.createChessPosition(i, j, "chess-pos last-row"),
                this.createChessPosition(i, j, "chess-pos last-pos"),
            ];
        } else if (j === 8) {
            padding = [this.createChessPosition(i, j, "chess-pos last-col")];
        } else if ([4, 9].includes(i)) {
            padding = [this.createChessPosition(i, j, "chess-pos last-row")];
        }
        return pos.concat(padding);
    }

    getChessBoard() {
        let rows = [];
        let river = (
            <td colSpan={10} className="river">
                <div/>
            </td>
        );
        for (let i = 1; i < 10; i++) {
            let cols = [];
            if (i !== 5) {
                for (let j = 1; j < 9; j++) {
                    let diagonal = this.getPosValue(DiagonalPos, i, j);
                    let serif = this.getPosValue(SerifPos, i, j);
                    let chessPos = this.getChessPosition(i, j);
                    cols.push((
                        <td key={`${i}-${j}`} data-pos={`${i}-${j}`}>
                            {diagonal}
                            {serif}
                            {chessPos}
                        </td>
                    ))
                }
            }
            rows.push((
                <tr key={i}>
                    {i === 5 ? river : cols}
                </tr>
            ))
        }
        return (
            <table className="chessboard">
                <tbody>{rows}</tbody>
            </table>
        );
    }

    render(){
        return this.getChessBoard();
    }
}