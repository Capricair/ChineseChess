import Global from "../utils/Global";
import StoreKey from "../utils/StoreKey";

export default function WebSocketClient(options) {
    let that = this;
    let defaults = {
        uuid: options.uuid,
        user: options.user,
    };
    let conf = Object.assign({}, defaults, options);
    let socket = new WebSocket("ws://localhost:9090");
    let actions = {};

    that.send = function (data) {
        socket.send(JSON.stringify(data));
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

    socket.onopen = function (e) {
        if (!conf.uuid) {
            conf.uuid = Global.UUID;
        }
        localStorage.setItem(StoreKey.uuid, conf.uuid);
        localStorage.setItem(StoreKey.user, conf.user);
        that.send({
            action: "bindUser",
            uuid: conf.uuid,
            user: conf.user,
        });
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