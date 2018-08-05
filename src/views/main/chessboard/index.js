import React from "react";
import BaseComponent from "../../base/index";
import {Bishop, Cannon, Guard, King, Knight, Pawn, Rook} from "../piece/index";
import {PieceType, PieceColor, BoardSize, MovePosCalc, ChineseNumeral} from "../../../enums/index";
import {AudioPlayer, Voice} from "../../../utils/index";

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

let PieceComponent = {
    [PieceType.King]: King,
    [PieceType.Rook]: Rook,
    [PieceType.Knight]: Knight,
    [PieceType.Bishop]: Bishop,
    [PieceType.Guard]: Guard,
    [PieceType.Cannon]: Cannon,
    [PieceType.Pawn]: Pawn,
};

let VoicePlayer = new AudioPlayer("#voice-player");

function SetPawnProps(pawn) {
    let initY = pawn.y;
    Object.defineProperties(pawn, {
        initY: {
            configurable: false,
            get: function () {
                return initY;
            },
        },
        isCrossRiver: {
            configurable: false,
            get: function () {
                if (initY === 4) {
                    return this.y > 5;
                } else {
                    return this.y < 6;
                }
            }
        }
    })
}

export default class ChessBoard extends BaseComponent {
    static defaultProps = {
        perspective: PieceColor.Red,
        adversary: {},
        self: {},
        ready: true,
        onMove: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            pieces: props.ready ? this.defaultPieces : {},
            active: PieceColor.Red,
            selected: this.defaultSelected,
            validPos: this.defaultValidPos,
            move: this.defaultMove,
            winner: null,
        };
    }

    movePiece(from, to){
        let selected = this.getPiece(from.x, from.y);
        this.move(to.x, to.y, {
            selected: selected,
            fromSocket: true,
        });
    }

    get defaultPieces() {
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
        Object.values(pieces).forEach((p) => {
            let x = p.x;
            let y = BoardSize.Height + 1 - p.y;
            pieces[`${x},${y}`] = {
                x: x,
                y: y,
                type: p.type, color: colors[1],
            };
            if (p.type === PieceType.Pawn) {
                SetPawnProps(p);
                SetPawnProps(pieces[`${x},${y}`]);
            }
        });
        return pieces;
    }

    get defaultSelected() {
        return null;
    }

    get defaultValidPos() {
        return {};
    }

    get defaultMove() {
        return {from: "", to: ""};
    }

    get gameover() {
        return !!this.state.winner;
    }

    get isMyTurn() {
        return this.getActiveColor() === this.props.perspective;
    }

    componentWillReceiveProps(props) {
        if (props.ready) {
            let {pieces} = this.state;
            this.setState({
                ready: props.ready,
                pieces: Object.keys(pieces).length > 0 ? pieces : this.defaultPieces,
            })
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {

    }

    getAllPiece() {
        return this.state.pieces;
    }

    getPiece(x, y) {
        return this.state.pieces[`${x},${y}`];
    }

    getSelectedPiece() {
        return this.state.selected;
    }

    getActiveColor() {
        return this.state.active;
    }

    getValidPos() {
        return this.state.validPos;
    }

    calcValidPos(piece) {
        let pos = {};
        let func = MovePosCalc[piece.type];
        if (typeof func === "function") {
            pos = func(piece, this.getAllPiece());
        }
        return pos;
    }

    isValidMove(x, y) {
        return this.state.validPos[`${x},${y}`];
    }

    getMove() {
        return this.state.move;
    }

    select(x, y) {
        let piece = this.getPiece(x, y);
        if (piece && piece.color === this.getActiveColor()) {
            let validPos = this.calcValidPos(piece) || {};
            this.setState({
                selected: piece,
                validPos: validPos,
            })
        }
    }

    deselect(x, y) {
        this.setState({
            selected: this.defaultSelected,
            validPos: this.defaultValidPos,
        })
    }

    capture(selected, capturing) {
        let pieces = this.getAllPiece();
        if (capturing && capturing.color !== selected.color) {
            return delete pieces[`${capturing.x},${capturing.y}`];
        }
        return false;
    }

    move(x, y, options) {
        let defaults = {
            selected: null,
            fromSocket: false,
        };
        let conf = Object.assign({}, defaults, options);
        let active = this.getActiveColor();
        let pieces = this.getAllPiece();
        let piece = this.getPiece(x, y);
        let selected = conf.selected || this.getSelectedPiece();
        let from = `${selected.x},${selected.y}`;
        let to = `${x},${y}`;
        let winner = null;
        let voice = "";
        if (selected) {
            if (this.capture(selected, piece)) {
                voice = Voice.capture;
            }
            if (piece && piece.type === PieceType.King) {
                winner = selected.color;
            }
            delete pieces[from];
            selected.x = x;
            selected.y = y;
            pieces[to] = selected;
            this.deselect(x, y);
            this.setState({
                pieces: pieces,
                move: {from: from, to: to},
                active: active === PieceColor.Red ? PieceColor.Black : PieceColor.Red,
                winner: winner,
            }, () => {
                if (this.check(x, y)) {
                    voice = Voice.check;
                }
                if ([PieceColor.Red, PieceColor.Black].includes(this.state.winner)) {
                    voice = [Voice.gameover, winner === PieceColor.Red ? Voice.redWin : Voice.blackWin];
                }
                if (voice) {
                    this.playVoice(voice);
                }
                if (typeof this.props.onMove === "function") {
                    this.props.onMove(selected, from, to, this.state.active, conf.fromSocket);
                }
            });
        }
    }

    check(x, y) {
        let pieces = this.getAllPiece();
        for (let piece of Object.values(pieces)) {
            let pos = this.calcValidPos(piece);
            for (let key of Object.keys(pos)) {
                if (pieces[key] && pieces[key].type === PieceType.King) {
                    return true;
                }
            }
        }
        return false;
    }

    playVoice(sources) {
        if (VoicePlayer) {
            VoicePlayer.playList(Array.isArray(sources) ? sources : [sources]);
        }
    }

    positionClickHandler(x, y) {
        if (this.gameover || !this.isMyTurn) {
            return false;
        }
        let selected = this.getSelectedPiece();
        let piece = this.getPiece(x, y);
        if (selected) {
            if (piece && piece.color === selected.color) {
                if (selected.x === x && selected.y === y) {
                    this.deselect(x, y);
                } else {
                    this.select(x, y);
                }
            } else {
                if (this.isValidMove(x, y)) {
                    this.move(x, y);
                }
            }
        } else {
            this.select(x, y);
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
        return React.createElement(PieceComponent[type], {color: color});
    }

    createChessPosition(x, y, className) {
        let pieceComponent = null;
        let pieceData = this.getPiece(x, y);
        let validPos = this.getValidPos();
        let move = this.getMove();
        let pos = `${x},${y}`;
        let fileNumber = null;
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
        if (validPos[`${x},${y}`]) {
            pieceComponent = (
                <div className="piece-valid">{pieceComponent}</div>
            )
        }
        if (pos === move.from || pos === move.to) {
            pieceComponent = (
                <div className="piece-moved">
                    <div>{pieceComponent}</div>
                </div>
            )
        }
        if (y === 1) {
            fileNumber = <div className="file-number opposite">{BoardSize.Width + 1 - x}</div>
        }
        if (y === BoardSize.Height) {
            fileNumber = <div className="file-number">{ChineseNumeral[x]}</div>
        }
        return (
            <div key={`${x}-${y}`}
                 data-pos={`${x},${y}`}
                 className={className}
                 onClick={() => {
                     this.positionClickHandler(x, y)
                 }}>
                {pieceComponent}
                {fileNumber}
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

    render() {
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
}