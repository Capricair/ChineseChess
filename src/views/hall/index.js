import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import classNames from "classnames";
import {PieceColor, PlayerStatus} from "../../enums/index";
import Global from "../../utils/Global";

let EmptySeatClass = "icomoon icon-user icon-empty";

export default class Hall extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            rooms: this.defaultRooms,
        };

        Global.socket.onmessage = (data) => {
            if (data.action === "getAllRooms") {
                Object.values(data.rooms).forEach((room) => {
                    this.updateRooms(room);
                })
            }
            if (data.action === "enterRoom") {
                this.updateRooms(data);
            }
        };

        Global.socket.onopen = function () {
            this.send({
                action: "getAllRooms",
            });
        };
    }

    get defaultPlayer() {
        return {uuid: null, user: null};
    }

    get defaultRooms() {
        let rooms = [];
        for (let i = 0; i < 18; i++) {
            rooms.push({
                roomId: i,
                red: this.defaultPlayer,
                black: this.defaultPlayer,
                status: PlayerStatus.Idle
            });
        }
        return rooms;
    }

    updateRooms(data) {
        let {rooms} = this.state;
        let from = rooms.find(x => [x.red.uuid, x.black.uuid].includes(data.uuid));
        let to = rooms[data.roomId];
        let player = {uuid: data.uuid, user: data.user};
        if (from) {
            from.red.uuid === data.uuid ? from.red = this.defaultPlayer : from.black = this.defaultPlayer;
        }
        data.color === PieceColor.Red ? to.red = player : to.black = player;
        this.setState({
            rooms: rooms
        })
    }

    seatClickHandler(roomId, color, status) {
        Global.socket.enterRoom(roomId, color, status);
    }

    getRoomList() {
        let {rooms} = this.state;
        let list = Object.values(rooms).map((item, index) => {
            return (
                <li key={index}>
                    <div className={classNames({[EmptySeatClass]: !item.black.uuid})}
                         onClick={() => {
                             this.seatClickHandler(item.roomId, PieceColor.Black, PlayerStatus.Idle)
                         }}>{item.black.user}</div>
                    <div className="list-table-image"/>
                    <div className={classNames({[EmptySeatClass]: !item.red.uuid})}
                         onClick={() => {
                             this.seatClickHandler(item.roomId, PieceColor.Red, PlayerStatus.Idle)
                         }}>{item.red.user}</div>
                </li>
            )
        });
        return <ul className="list-room list-unstyled">{list}</ul>
    }

    render() {
        return (
            <div className="game-hall">
                {this.getRoomList()}
            </div>
        )
    }
}