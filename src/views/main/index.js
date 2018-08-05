import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import Players from "./players/index";
import Chessboard from "./chessboard/index";
import ChessBook from "./chessbook/index";
import {PieceColor, PlayerStatus, BoardSize} from "../../enums/index";
import {StoreKey, Global} from "../../utils/index";
import {Configurable} from "../../decorators/index";

export default class ChineseChess extends BaseComponent {
    constructor(props) {
        super(props);
        super.checkLogin();
        this.state = {
            @Configurable(false)
            uuid: sessionStorage.getItem(StoreKey.uuid),
            @Configurable(false)
            roomId: parseInt(sessionStorage.getItem(StoreKey.roomId)),
            adversary: {},
            self: {},
            perspective: parseInt(sessionStorage.getItem(StoreKey.color)),
            gameStart: false,
            active: PieceColor.Red,
            log: [],
        };
        Global.socket.onmessage = (data) => {
            let action = this.actions[data.action];
            if (typeof action === "function") {
                action.call(this, data);
            }
        };
        this.initPlayersData();
    }

    componentWillUnmount() {
        //离开房间房的处理方法在hall初始化房间内
    }

    actions = {
        enterRoom: (data) => {
            if (data.roomId === this.state.roomId) {
                this.setState({
                    adversary: {
                        uuid: data.uuid,
                        user: data.user,
                        roomId: data.roomId,
                        color: data.color,
                        status: data.status,
                    }
                })
            }
        },
        getPlayersByRoomId: (data) => {
            let adversary = data.players.find(x => x.uuid !== sessionStorage.getItem(StoreKey.uuid)) || {};
            let self = data.players.find(x => x.uuid === sessionStorage.getItem(StoreKey.uuid)) || {};
            this.setState({
                adversary: adversary,
                self: self,
                gameStart: this.isAllReady(adversary, self),
            })
        },
        playerReady: (data) => {
            this.setPlayer(data.player.uuid, data.player, () => {
                let {adversary, self} = this.state;
                if (this.isAllReady(adversary, self)) {
                    this.setState({
                        gameStart: true,
                    });
                }
            });
        },
        leaveRoom: (data) => {
            this.setPlayer(data.uuid, this.defaultPlayer);
        },
        movePiece: (data) => {
            if (data.receiver === this.state.uuid){
                let {from, to} = data;
                from.y = BoardSize.Height + 1 - from.y;
                to.y = BoardSize.Height + 1 - to.y;
                this.refs[`chessboard`].movePiece(from, to);
            }
        },
    };

    isAllReady(player1, player2) {
        return player1.status === PlayerStatus.Ready && player2.status === PlayerStatus.Ready;
    }

    setPlayer(uuid, player, callback) {
        let data = uuid === this.state.uuid ? {self: player} : {adversary: player};
        this.setState(data, callback);
    }

    initPlayersData() {
        let roomId = parseInt(sessionStorage.getItem(StoreKey.roomId));
        if (Global.socket.readyState === WebSocket.OPEN) {
            Global.socket.getPlayersByRoomId(roomId);
        } else {
            Global.socket.onopen = (e) => {
                Global.socket.getPlayersByRoomId(roomId);
            };
        }
    }

    onMoveHandler(piece, from, to, active, fromSocket) {
        this.movePieceAction(from, to, fromSocket);
        this.setActive(active);
        this.record(piece, from, to);
    }

    movePieceAction(from, to, fromSocket) {
        if (!fromSocket){
            let {adversary, self} = this.state;
            let [fromX, fromY] = (from || "").split(",").map(x => parseInt(x));
            let [toX, toY] = (to || "").split(",").map(x => parseInt(x));
            Global.socket.movePiece(adversary, self, {x: fromX, y: fromY}, {x: toX, y: toY});
        }
    }

    setActive(active) {
        this.setState({
            active: active,
        })
    }

    record(piece, from, to) {
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
        let {adversary, self, perspective, gameStart, active, log} = this.state;
        return (
            <div className="chinese-chess">
                <div className="container">
                    <div className="wrapper">
                        <Players
                            adversary={adversary}
                            self={self}
                            gameStart={gameStart}
                            active={active}
                        />
                        <Chessboard
                            ref="chessboard"
                            ready={gameStart}
                            perspective={perspective}
                            adversary={adversary}
                            self={self}
                            onMove={(piece, from, to, active, fromSocket) => {
                                this.onMoveHandler(piece, from, to, active, fromSocket)
                            }}
                        />
                        <ChessBook
                            perspective={perspective}
                            data={log}
                        />
                    </div>
                </div>
            </div>
        )
    }
}