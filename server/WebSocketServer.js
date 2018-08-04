const uuid = require("uuid/v1");
const WebSocket = require("ws");
const server = new WebSocket.Server({
    port: 9090,
    verifyClient: function (info) {
        //TODO 客户端连接验证，返回true或false表示同意或拒绝连接
        return true;
    }
});

const cache = {
    user: {},
    room: {},
};

const actions = {
    bindUser: (data, client)=>{
        client.uuid = data.uuid;
        cache.user[data.uuid] = {user: data.user};
    },
    enterRoom: (data, client)=>{
        cache.room[data.uuid] = {roomId: data.roomId, status: data.status};
        server.broadcast({
            action: "enterRoom",
            uuid: data.uuid,
            user: data.user,
            roomId: data.roomId,
            color: data.color,
            status: data.status,
        });
    },
    getAllRooms: (data, client)=>{
        server.sendTo(client, {
            action: "getAllRooms",
            rooms: cache.room,
        })
    }
};

function parseJSON(str){
    let result = {};
    try {
        result = JSON.parse(str);
        return result;
    } catch (e) {
        console.log(e);
        return result;
    }
}

// broadcast to all.
server.broadcast = function broadcast(data) {
    server.clients.forEach(function each(client) {
        server.sendTo(client, data);
    });
};

server.sendTo = function (client, data) {
    try {
        client.send(JSON.stringify(data));
    } catch (e) {
        console.log(e);
    }
};

server.findClient = function (uuid) {
    return server.clients.find(x => x.uuid === uuid);
};

const intervalId = setInterval(function () {
    server.clients.forEach(function (client) {
        if (client.isAlive === false){
            return client.terminate();
        }
        client.isAlive = false;
        client.ping(function () {});
    });
}, 60 * 1000);

server.on("connection", function (client) {
    client.isAlive = true;
    client.on('pong', function () {
        client.isAlive = true;
    });

    client.on("message", function incoming(message) {
        try {
            let data = parseJSON(message);
            let action = actions[data.action];
            if (typeof action === "function"){
                action(data, client);
            }
        } catch (e) {
            console.log(e);
        }
    });
});

server.on("listening", function () {
    console.log(`WebSocket server is listening at ${JSON.stringify(server.address())}`);
});