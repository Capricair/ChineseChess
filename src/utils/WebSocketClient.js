import Global from "../utils/Global";
import StoreKey from "../utils/StoreKey";
import PlayerStatus from "../enums/PlayerStatus";

export default function WebSocketClient(options) {
    if (!options.uuid || !options.user) {
        if (typeof options.error === "function") {
            options.error();
        }
        return false;
    }

    let that = this;
    let defaults = {
        uuid: options.uuid,
        user: options.user,
        success: () => {
        },
        onerror: () => {
        },
    };
    let conf = Object.assign({}, defaults, options);
    let socket = new WebSocket("ws://localhost:9090");
    let actions = {};

    Object.defineProperties(that, {
        readyState: {
            configurable: false,
            get: function () {
                return socket.readyState;
            }
        }
    });

    that.send = function (data) {
        socket.send(JSON.stringify(data));
    };

    that.getAllRooms = function () {
        that.send({action: "getAllRooms"});
    };

    that.enterRoom = function (roomId, color, status) {
        that.send({
            action: "enterRoom",
            uuid: conf.uuid,
            user: conf.user,
            roomId: roomId,
            color: color,
            status: status,
        });
    };

    that.playerReady = function (roomId) {
        that.send({
            action: "playerReady",
            uuid: conf.uuid,
            user: conf.user,
            roomId: roomId,
            status: PlayerStatus.Ready,
        })
    };

    that.getPlayersByRoomId = function (roomId) {
        that.send({
            action: "getPlayersByRoomId",
            roomId: roomId,
        })
    };

    that.leaveRoom = function (roomId, color) {
        that.send({
            action: "leaveRoom",
            uuid: conf.uuid,
            user: conf.user,
            roomId: roomId,
            color: color,
        })
    };

    that.onerror = conf.onerror;

    socket.onopen = function (e) {
        if (conf.uuid && conf.user) {
            sessionStorage.setItem(StoreKey.uuid, conf.uuid);
            sessionStorage.setItem(StoreKey.user, conf.user);
            that.send({
                action: "bindUser",
                uuid: conf.uuid,
                user: conf.user,
            });
            if (typeof conf.success === "function") {
                conf.success();
            }
        }
        if (typeof that.onopen === "function") {
            that.onopen(e);
        }
    };

    socket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        let action = actions[data.action];
        if (typeof action === "function") {
            action(data);
        }
        if (typeof that.onmessage === "function") {
            that.onmessage(data);
        }
    };

    socket.onerror = function (e) {
        if (typeof that.onerror === "function") {
            that.onerror(e);
        }
    };

    socket.onclose = function (e) {
        if (typeof that.onclose === "function") {
            that.onclose(e);
        }
    };
}