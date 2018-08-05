import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import Players from "./players/index";
import Chessboard from "./chessboard/index";
import ChessBook from "./chessbook/index";
import {PieceColor} from "../../enums/index";
import {StoreKey, Global} from "../../utils/index";
import {Configurable} from "../../decorators/index";

export default class ChineseChess extends BaseComponent {
    constructor(props) {
        super(props);
        super.checkLogin();
        this.state = {
            @Configurable(false)
            roomId: parseInt(sessionStorage.getItem(StoreKey.roomId)),
            adversary: {},
            self: {},
            perspective: sessionStorage.getItem(StoreKey.color),
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
        this.setPlayers();
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
            })
        },
        playerReady: (data)=>{
            this.setState({
                self: data.player,
            })
        }
    };

    setPlayers() {
        let roomId = parseInt(sessionStorage.getItem(StoreKey.roomId));
        if (Global.socket.readyState === WebSocket.OPEN) {
            Global.socket.getPlayersByRoomId(roomId);
        } else {
            Global.socket.onopen = (e) => {
                Global.socket.getPlayersByRoomId(roomId);
            };
        }
    }

    onMoveHandler(piece, from, to, active) {
        this.setActive(active);
        this.record(piece, from, to);
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
                            ready={gameStart}
                            perspective={perspective}
                            onMove={(piece, from, to, active) => {
                                this.onMoveHandler(piece, from, to, active)
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