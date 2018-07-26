import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import {PieceType, PieceColor, BoardSize, MovePosCalc} from "../../enums/index";
import {Bishop, Cannon, Guard, King, Knight, Pawn, Rook} from "../piece";

let DiagonalPos = [
    {pos: ["4,1", "5,2", "4,8", "5,9"], value: <div className="diagonal diagonal-ac"/>},
    {pos: ["5,1", "4,2", "5,8", "4,9"], value: <div className="diagonal diagonal-bd"/>},
];

let SerifPos = [
    {pos: ["1,2", "7,2", "4,3", "6,3", "2,6", "4,6", "6,6", "8,6"], value: <div className="serif serif-lower-right"/>},
    {pos: ["2,2", "8,2", "3,3", "5,3", "1,6", "3,6", "5,6", "7,6"], value: <div className="serif serif-lower-left"/>},
    {pos: ["1,4", "3,4", "5,4", "7,4", "3,7", "5,7", "2,8", "8,8"], value: <div className="serif serif-upper-left"/>},
    {pos: ["2,4", "4,4", "6,4", "8,4", "4,7", "6,7", "1,8", "7,8"], value: <div className="serif serif-upper-right"/>},
    {pos: ["2,3", "8,3", "1,7", "7,7"], value: <div className="serif serif-diagonal-ac"/>},
    {pos: ["1,3", "7,3", "2,7", "8,7"], value: <div className="serif serif-diagonal-bd"/>},
];

let PieceComponentEnum = {
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
            pieces: {},
            active: PieceColor.Red,
            selected: null,
            validPos: {},
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
            "2,1": {x: 2, y: 1, type: PieceType.Knight, color: colors[0]},
            "3,1": {x: 3, y: 1, type: PieceType.Bishop, color: colors[0]},
            "4,1": {x: 4, y: 1, type: PieceType.Guard, color: colors[0]},
            "5,1": {x: 5, y: 1, type: PieceType.King, color: colors[0]},
            "6,1": {x: 6, y: 1, type: PieceType.Guard, color: colors[0]},
            "7,1": {x: 7, y: 1, type: PieceType.Bishop, color: colors[0]},
            "8,1": {x: 8, y: 1, type: PieceType.Knight, color: colors[0]},
            "9,1": {x: 9, y: 1, type: PieceType.Rook, color: colors[0]},
            "2,3": {x: 2, y: 3, type: PieceType.Cannon, color: colors[0]},
            "8,3": {x: 8, y: 3, type: PieceType.Cannon, color: colors[0]},
            "1,4": {x: 1, y: 4, type: PieceType.Pawn, color: colors[0]},
            "3,4": {x: 3, y: 4, type: PieceType.Pawn, color: colors[0]},
            "5,4": {x: 5, y: 4, type: PieceType.Pawn, color: colors[0]},
            "7,4": {x: 7, y: 4, type: PieceType.Pawn, color: colors[0]},
            "9,4": {x: 9, y: 4, type: PieceType.Pawn, color: colors[0]},
        };
        Object.keys(pieces).forEach((key) => {
            let p = pieces[key];
            pieces[`${p.x},${BoardSize.Height + 1 - p.y}`] = {
                x: p.x,
                y: BoardSize.Height + 1 - p.y,
                type: p.type, color: colors[1],
            };
        });
        this.setState({
            pieces: pieces
        });
    }

    getAllPieceData(){
        return this.state.pieces;
    }

    getPieceData(x, y) {
        return this.state.pieces[`${x},${y}`];
    }

    getSelectedPiece() {
        return this.state.selected;
    }

    getActiveColor() {
        return this.state.active;
    }

    getValidPos(){
        return this.state.validPos;
    }

    select(x, y) {
        let piece = this.getPieceData(x, y);
        if (piece && piece.color === this.getActiveColor()) {
            let calc = MovePosCalc[piece.type];
            let validPos = {};
            if (typeof calc === "function"){
                validPos = calc(piece, this.getAllPieceData());
            }
            this.setState({
                selected: piece,
                validPos: validPos,
            })
        }
    }

    move(x, y) {
        let piece = this.getPieceData(x, y);
        if (piece) {

        }
    }

    positionClickHandler(x, y) {
        let {selected} = this.state;
        if (!selected) {
            this.select(x, y);
        } else if (selected && selected.x !== x && selected.y !== y) {

        }
    }

    getPosValue(pos, x, y) {
        for (let item of pos) {
            if (item.pos.includes(`${x},${y}`)) {
                return item.value;
            }
        }
        return null;
    }

    createChessPiece(type, color) {
        return React.createElement(PieceComponentEnum[type], {color: color});
    }

    createChessPosition(x, y, classNames) {
        let pieceComponent = null;
        let pieceData = this.getPieceData(x, y);
        if (pieceData) {
            let selected = this.getSelectedPiece();
            pieceComponent = this.createChessPiece(pieceData.type, pieceData.color);
            if (selected && pieceData.x === selected.x && pieceData.y === selected.y) {
                //如果当前棋子是选中的棋子
                pieceComponent = (
                    <div className="piece-selected">{pieceComponent}</div>
                );
            }
        }
        let validPos = this.getValidPos();
        if (validPos[`${x},${y}`]){
            pieceComponent = (
                <div className="piece-valid">{pieceComponent}</div>
            )
        }
        return (
            <div key={`${x}-${y}-${classNames}`}
                 data-pos={`${x},${y}`}
                 className={classNames}
                 onClick={() => {
                     this.positionClickHandler(x, y)
                 }}>
                {pieceComponent}
            </div>
        )
    }

    getPiecePosition(x, y) {
        let pos = [this.createChessPosition(x, y, "chess-pos")];
        let lastCol = this.createChessPosition(x + 1, y, "chess-pos last-col");
        let lastRow = this.createChessPosition(x, y + 1, "chess-pos last-row");
        let lastPos = this.createChessPosition(x + 1, y + 1, "chess-pos last-pos");
        let padding = [];
        if ([4, 9].includes(y) && x === 8) {
            padding = [lastCol, lastRow, lastPos];
        } else if (x === 8) {
            padding = [lastCol];
        } else if ([4, 9].includes(y)) {
            padding = [lastRow];
        }
        return pos.concat(padding);
    }

    getChessboard() {
        let rows = [];
        let river = (
            <td colSpan={10} className="river">
                <div/>
            </td>
        );
        for (let y = 1; y < 10; y++) {
            let cols = [];
            if (y !== 5) {
                for (let x = 1; x < 9; x++) {
                    let diagonal = this.getPosValue(DiagonalPos, x, y);
                    let serif = this.getPosValue(SerifPos, x, y);
                    let position = this.getPiecePosition(x, y);
                    cols.push((
                        <td key={`${x}-${y}`}>
                            {diagonal}
                            {serif}
                            {position}
                        </td>
                    ))
                }
            }
            rows.push((
                <tr key={y}>
                    {y === 5 ? river : cols}
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
        return this.getChessboard();
    }
}