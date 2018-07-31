let StatusEnum = {
    Init: "init",
    Playing: "playing",
    Paused: "paused",
    Ended: "ended",
};

export default function AudioPlayer(selector) {
    let status = StatusEnum.Init;
    let player = document.querySelector(selector);
    let playList = [];
    let index = 0;

    Object.defineProperties(this, {
        player: {
            value: player,
        },
        status: {
            configurable: false,
            get: function () {
                return status;
            }
        },
        playList: {
            configurable: false,
            writable: false,
            value: (list)=>{
                playList = list;
                if (playList[index]){
                    player.src = playList[index];
                    player.play();
                }
            }
        }
    });

    player.addEventListener("play", function () {
        status = StatusEnum.Playing;
    });

    player.addEventListener("pause", function () {
        status = StatusEnum.Ended ? StatusEnum.Ended : StatusEnum.Paused;
    });

    player.addEventListener("ended", function () {
        status = StatusEnum.Ended;
        if (index < playList.length - 1){
            index++;
            if (playList[index]){
                player.src = playList[index];
                player.play();
            }
        } else {
            index = 0;
        }
    });
}