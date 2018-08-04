function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function UUID() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

let Global = {
    socket: null,
};

Object.defineProperties(Global, {
    UUID: {
        configurable: false,
        get: function () {
            return UUID();
        }
    }
});

export default Global;