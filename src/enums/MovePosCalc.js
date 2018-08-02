import PieceType from "./PieceType";
import BoardSize from "./BoardSize";

let LoopAction = {
    Continue: 1,
    Break: 2,
};

let BishopPosList = [
    ["3,1", "7,1", "1,3", "5,3", "9,3", "3,5", "7,5"],
    ["3,10", "7,10", "1,8", "5,8", "9,8", "3,6", "7,6"],
];

let GuardPosList = [
    ["4,1", "4,3", "5,2", "6,1", "6,3"],
    ["4,10", "4,8", "5,9", "6,10", "6,8"],
];

let KingPosList = [
    ["4,1", "4,2", "4,3", "5,1", "5,2", "5,3", "6,1", "6,2", "6,3"],
    ["4,10", "4,9", "4,8", "5,10", "5,9", "5,8", "6,10", "6,9", "6,8"],
];

function SetRookPos(posList, target, pieces, x, y) {
    let piece = pieces[`${x},${y}`];
    if (piece) {
        if (piece.color !== target.color) {
            posList[`${x},${y}`] = {x: x, y: y};
        }
        return LoopAction.Break;
    } else {
        posList[`${x},${y}`] = {x: x, y: y};
    }
}

function SetCannonPos(posList, target, pieces, x, y, vars) {
    let piece = pieces[`${x},${y}`];
    if (vars.hasMetPiece && piece && piece.color !== target.color) {
        posList[`${x},${y}`] = {x: x, y: y};
        return LoopAction.Break;
    }
    if (!vars.hasMetPiece && piece) {
        vars.hasMetPiece = true;
        return LoopAction.Continue;
    }
    if (!vars.hasMetPiece && !piece) {
        posList[`${x},${y}`] = {x: x, y: y};
    }
}

function IsKingMet(pieces) {
    let [king1, king2] = GetKings(pieces);
    if (king1 && king2 && king1.x === king2.x) {
        let start = Math.min(king1.y + 1, king2.y + 1);
        let end = Math.max(king1.y - 1, king2.y - 1);
        for (let i = start; i < end; i++) {
            if (pieces[`${king1.x},${i}`]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function ComparePiece(piece1, piece2) {
    return piece1.type === piece2.type && piece1.x === piece2.x && piece1.y === piece2.y;
}

function GetKings(pieces) {
    return Object.values(pieces).filter(x => x.type === PieceType.King);
}

export default {
    [PieceType.Rook]: function (target, pieces) {
        let pos = {};
        for (let x = target.x - 1; x > 0; x--) {
            let action = SetRookPos(pos, target, pieces, x, target.y);
            if (action === LoopAction.Break) break;
        }
        for (let x = target.x + 1; x <= BoardSize.Width; x++) {
            let action = SetRookPos(pos, target, pieces, x, target.y);
            if (action === LoopAction.Break) break;
        }
        for (let y = target.y - 1; y > 0; y--) {
            let action = SetRookPos(pos, target, pieces, target.x, y);
            if (action === LoopAction.Break) break;
        }
        for (let y = target.y + 1; y <= BoardSize.Height; y++) {
            let action = SetRookPos(pos, target, pieces, target.x, y);
            if (action === LoopAction.Break) break;
        }
        return pos;
    },
    [PieceType.Knight]: function (target, pieces) {
        let pos = {};
        let map = [
            {pos: `${target.x + 2},${target.y + 1}`, roadblock: `${target.x + 1},${target.y}`},
            {pos: `${target.x + 2},${target.y - 1}`, roadblock: `${target.x + 1},${target.y}`},
            {pos: `${target.x - 2},${target.y + 1}`, roadblock: `${target.x - 1},${target.y}`},
            {pos: `${target.x - 2},${target.y - 1}`, roadblock: `${target.x - 1},${target.y}`},
            {pos: `${target.x + 1},${target.y + 2}`, roadblock: `${target.x},${target.y + 1}`},
            {pos: `${target.x - 1},${target.y + 2}`, roadblock: `${target.x},${target.y + 1}`},
            {pos: `${target.x + 1},${target.y - 2}`, roadblock: `${target.x},${target.y - 1}`},
            {pos: `${target.x - 1},${target.y - 2}`, roadblock: `${target.x},${target.y - 1}`},
        ];
        map.forEach((p) => {
            if (!pieces[p.roadblock] && (!pieces[p.pos] || pieces[p.pos].color !== target.color)) {
                let [x, y] = p.pos.split(",").map(x => parseInt(x));
                pos[p.pos] = {x: x, y: y};
            }
        });
        return pos;
    },
    [PieceType.Bishop]: function (target, pieces) {
        let pos = {};
        let list = BishopPosList[0].includes(`${target.x},${target.y}`) ? BishopPosList[0] : BishopPosList[1];
        let map = [
            {pos: `${target.x - 2},${target.y - 2}`, roadblock: `${target.x - 1},${target.y - 1}`},
            {pos: `${target.x - 2},${target.y + 2}`, roadblock: `${target.x - 1},${target.y + 1}`},
            {pos: `${target.x + 2},${target.y - 2}`, roadblock: `${target.x + 1},${target.y - 1}`},
            {pos: `${target.x + 2},${target.y + 2}`, roadblock: `${target.x + 1},${target.y + 1}`},
        ];
        map.forEach((p) => {
            if (list.includes(p.pos) && !pieces[p.roadblock] && (!pieces[p.pos] || pieces[p.pos].color !== target.color)) {
                let [x, y] = p.pos.split(",").map(x => parseInt(x));
                pos[p.pos] = {x: x, y: y};
            }
        });
        return pos;
    },
    [PieceType.Guard]: function (target, pieces) {
        let pos = {};
        let list = GuardPosList[0].includes(`${target.x},${target.y}`) ? GuardPosList[0] : GuardPosList[1];
        let map = [
            {pos: `${target.x - 1},${target.y - 1}`},
            {pos: `${target.x - 1},${target.y + 1}`},
            {pos: `${target.x + 1},${target.y - 1}`},
            {pos: `${target.x + 1},${target.y + 1}`},
        ];
        map.forEach((p) => {
            if (list.includes(p.pos) && (!pieces[p.pos] || pieces[p.pos].color !== target.color)) {
                let [x, y] = p.pos.split(",").map(x => parseInt(x));
                pos[p.pos] = {x: x, y: y};
            }
        });
        return pos;
    },
    [PieceType.King]: function (target, pieces) {
        let pos = {};
        let list = KingPosList[0].includes(`${target.x},${target.y}`) ? KingPosList[0] : KingPosList[1];
        let map = [
            {pos: `${target.x + 1},${target.y}`},
            {pos: `${target.x - 1},${target.y}`},
            {pos: `${target.x},${target.y + 1}`},
            {pos: `${target.x},${target.y - 1}`},
        ];
        map.forEach((p) => {
            if (list.includes(p.pos) && (!pieces[p.pos] || pieces[p.pos].color !== target.color)) {
                let [x, y] = p.pos.split(",").map(x => parseInt(x));
                pos[p.pos] = {x: x, y: y};
            }
        });
        if (IsKingMet(pieces)) {
            let {x, y} = GetKings(pieces).find(x => !ComparePiece(target, x));
            pos[`${x},${y}`] = {x: x, y: y};
        }
        return pos;
    },
    [PieceType.Cannon]: function (target, pieces) {
        let pos = {}, vars = {hasMetPiece: false};

        for (let x = target.x - 1; x > 0; x--) {
            let action = SetCannonPos(pos, target, pieces, x, target.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let x = target.x + 1; x <= BoardSize.Width; x++) {
            let action = SetCannonPos(pos, target, pieces, x, target.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = target.y - 1; y > 0; y--) {
            let action = SetCannonPos(pos, target, pieces, target.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = target.y + 1; y <= BoardSize.Height; y++) {
            let action = SetCannonPos(pos, target, pieces, target.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        return pos;
    },
    [PieceType.Pawn]: function (target, pieces) {
        let pos = {};
        let map = [{pos: `${target.x},${target.initY === 4 ? target.y + 1 : target.y - 1}`}];
        if (target.isCrossRiver) {
            map.push({pos: `${target.x + 1},${target.y}`});
            map.push({pos: `${target.x - 1},${target.y}`});
        }
        map.forEach((p) => {
            let [x, y] = p.pos.split(",").map(x => parseInt(x));
            if (x > 0 && x <= BoardSize.Width && y > 0 && y <= BoardSize.Height
                && (!pieces[p.pos] || pieces[p.pos].color !== target.color)) {
                pos[p.pos] = {x: x, y: y};
            }
        });
        return pos;
    }
}