import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import classNames from "classnames";
import {PieceColor, PlayerStatus, Views} from "../../enums/index";
import {Global} from "../../utils/index";
import StoreKey from "../../utils/StoreKey";

let EmptySeatClass = "icomoon icon-user icon-empty";

export default class Hall extends BaseComponent {
    constructor(props) {
        super(props);
        super.checkLogin();
        this.state = {
            rooms: this.defaultRooms,
        };
        Global.socket.onmessage = (data) => {
            let action = this.actions[data.action];
            if (typeof action === "function"){
                action.call(this, data);
            }
        };
        this.initRoomsData();
    }

    actions = {
        getAllRooms: (data)=>{
            Object.values(data.rooms).forEach((room) => {
                this.updateRooms(room);
            })
        },
        enterRoom: (data)=>{
            this.updateRooms(data);
            if (data.uuid === sessionStorage.getItem(StoreKey.uuid)){
                sessionStorage.setItem(StoreKey.roomId, data.roomId);
                sessionStorage.setItem(StoreKey.color, data.color);
                this.props.history.push(Views.game);
            }
        },
        leaveRoom: (data)=>{
            this.removePlayer(data);
        }
    };

    initRoomsData(){
        let roomId = parseInt(sessionStorage.getItem(StoreKey.roomId));
        let color = parseInt(sessionStorage.getItem(StoreKey.color));
        if (Global.socket.readyState === WebSocket.OPEN){
            Global.socket.leaveRoom(roomId, color);
            Global.socket.getAllRooms();
        } else {
            Global.socket.onopen = function () {
                Global.socket.getAllRooms();
            };
        }
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

    removePlayer(data){
        let {rooms} = this.state;
        let room = rooms.find(x => [x.red.uuid, x.black.uuid].includes(data.uuid));
        if (room){
            data.color === PieceColor.Red ? room.red = this.defaultPlayer : room.black = this.defaultPlayer;
        }
        this.setState({
            rooms: rooms
        })
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
        let room = this.state.rooms[roomId];
        let player = color === PieceColor.Red ? room.red : room.black;
        if (!player.uuid){
            Global.socket.enterRoom(roomId, color, status);
        }
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