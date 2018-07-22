import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import {King, Rook, Knight, Bishop, Guard, Cannon, Pawn} from "../piece/index";
import {PieceType, PieceColor} from "../../enums/index";

let DiagonalPos = [
    {pos: ["1,4", "2,5", "8,4", "9,5"], value: <div className="diagonal diagonal-ac"/>},
    {pos: ["1,5", "2,4", "8,5", "9,4"], value: <div className="diagonal diagonal-bd"/>},
];

let SerifPos = [
    {pos: ["2,1", "2,7", "3,4", "3,6", "6,2", "6,4", "6,6", "6,8"], value: <div className="serif serif-lower-right"/>},
    {pos: ["2,2", "2,8", "3,3", "3,5", "6,1", "6,3", "6,5", "6,7"], value: <div className="serif serif-lower-left"/>},
    {pos: ["4,1", "4,3", "4,5", "4,7", "7,3", "7,5", "8,2", "8,8"], value: <div className="serif serif-upper-left"/>},
    {pos: ["4,2", "4,4", "4,6", "4,8", "7,4", "7,6", "8,1", "8,7"], value: <div className="serif serif-upper-right"/>},
    {pos: ["3,2", "3,8", "7,1", "7,7"], value: <div className="serif serif-diagonal-ac"/>},
    {pos: ["3,1", "3,7", "7,2", "7,8"], value: <div className="serif serif-diagonal-bd"/>},
];

let PieceComponentNameEnum = {
    [PieceType.King]: King,
    [PieceType.Rook]: Rook,
    [PieceType.Knight]: Knight,
    [PieceType.Bishop]: Bishop,
    [PieceType.Guard]: Guard,
    [PieceType.Cannon]: Cannon,
    [PieceType.Pawn]: Pawn,
};

export default class ChessBoard extends BaseComponent {
    static defaultProps = {
        perspective: PieceColor.Red,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        this.init();
    }

    init() {
        let colors = this.props.perspective === PieceColor.Black
            ? [PieceColor.Red, PieceColor.Black] : [PieceColor.Black, PieceColor.Red];
        let pieces = {
            "1,1": {x: 1, y: 1, type: PieceType.Rook, color: colors[0]},
            "1,2": {x: 2, y: 1, type: PieceType.Knight, color: colors[0]},
            "1,3": {x: 3, y: 1, type: PieceType.Bishop, color: colors[0]},
            "1,4": {x: 4, y: 1, type: PieceType.Guard, color: colors[0]},
            "1,5": {x: 5, y: 1, type: PieceType.King, color: colors[0]},
            "1,6": {x: 6, y: 1, type: PieceType.Guard, color: colors[0]},
            "1,7": {x: 7, y: 1, type: PieceType.Bishop, color: colors[0]},
            "1,8": {x: 8, y: 1, type: PieceType.Knight, color: colors[0]},
            "1,9": {x: 9, y: 1, type: PieceType.Rook, color: colors[0]},
            "3,2": {x: 2, y: 3, type: PieceType.Cannon, color: colors[0]},
            "3,8": {x: 8, y: 3, type: PieceType.Cannon, color: colors[0]},
            "4,1": {x: 1, y: 4, type: PieceType.Pawn, color: colors[0]},
            "4,3": {x: 3, y: 4, type: PieceType.Pawn, color: colors[0]},
            "4,5": {x: 5, y: 4, type: PieceType.Pawn, color: colors[0]},
            "4,7": {x: 7, y: 4, type: PieceType.Pawn, color: colors[0]},
            "4,9": {x: 9, y: 4, type: PieceType.Pawn, color: colors[0]},
        };
        Object.keys(pieces).forEach((key) => {
            let p = pieces[key];
            pieces[`${11 - p.y},${p.x}`] = {x: p.x, y: 11 - p.y, type: p.type, color: colors[1]};
        });
        this.setState({
            data: pieces
        });
    }

    positionClickHandler(i, j) {

    }

    getPosValue(pos, i, j) {
        for (let item of pos) {
            if (item.pos.includes(`${i},${j}`)) {
                return item.value;
            }
        }
        return null;
    }

    createChessPiece(type, color){
        let piece = React.createElement(PieceComponentNameEnum[type], {color: color});
        return piece;
    }

    createChessPosition(x, y, classNames) {
        let chess = null;
        let data = this.state.data[`${x},${y}`];
        if (data){
            chess = this.createChessPiece(data.type, data.color);
        }
        return (
            <div key={`${x}-${y}-${classNames}`}
                 data-pos={`${x},${y}`}
                 className={classNames}
                 onClick={() => {
                     this.positionClickHandler(x, y)
                 }}>
                {chess}
            </div>
        )
    }

    getChessPosition(i, j) {
        let pos = [this.createChessPosition(i, j, "chess-pos")];
        let lastCol = this.createChessPosition(i, j + 1, "chess-pos last-col");
        let lastRow = this.createChessPosition(i + 1, j, "chess-pos last-row");
        let lastPos = this.createChessPosition(i + 1, j + 1, "chess-pos last-pos");
        let padding = null;
        if ([4, 9].includes(i) && j === 8) {
            padding = [lastCol, lastRow, lastPos];
        } else if (j === 8) {
            padding = [lastCol];
        } else if ([4, 9].includes(i)) {
            padding = [lastRow];
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
                        <td key={`${i}-${j}`}>
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

    render() {
        return this.getChessBoard();
    }
}