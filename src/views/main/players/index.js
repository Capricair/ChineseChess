import React from "react";
import BaseComponent from "../../base/index";
import {PieceColor, PlayerStatus} from "../../../enums/index";
import {Global} from "../../../utils";
import StoreKey from "../../../utils/StoreKey";

export default class Players extends BaseComponent {
    static defaultProps = {
        adversary: {},
        self: {},
        gameStart: false,
        active: PieceColor.Red,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    get readyButton() {
        return (
            <button type="button" onClick={() => {
                this.readyClickHandler()
            }}>准备</button>
        )
    }

    readyClickHandler() {
        let roomId = parseInt(sessionStorage.getItem(StoreKey.roomId));
        Global.socket.playerReady(roomId);
    }

    render() {
        let {adversary, self, gameStart, active} = this.props;
        return (
            <div className="players">
                <div className="player">
                    <div className="avatar">{adversary.user}</div>
                    {!gameStart && adversary.status === PlayerStatus.Ready ? "已准备" : ""}
                    {gameStart && active === adversary.color ? "走棋" : ""}
                </div>
                <div className="player">
                    <div className="avatar">{self.user}</div>
                    {!gameStart ? self.status !== PlayerStatus.Ready ? this.readyButton : "已准备" : ""}
                    {gameStart && active === self.color ? "走棋" : ""}
                </div>
            </div>
        )
    }
}