import PieceType from "./PieceType";
import BoardSize from "./BoardSize";

let LoopAction = {
    Continue: 1,
    Break: 2,
};

function setRookPos(posList, target, pieces, x, y) {
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

function setCannonPos(posList, target, pieces, x, y, vars) {
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

export default {
    [PieceType.Rook]: function (target, pieces) {
        let pos = {};
        for (let x = target.x - 1; x > 0; x--) {
            let action = setRookPos(pos, target, pieces, x, target.y);
            if (action === LoopAction.Break) break;
        }
        for (let x = target.x + 1; x <= BoardSize.Width; x++) {
            let action = setRookPos(pos, target, pieces, x, target.y);
            if (action === LoopAction.Break) break;
        }
        for (let y = target.y - 1; y > 0; y--) {
            let action = setRookPos(pos, target, pieces, target.x, y);
            if (action === LoopAction.Break) break;
        }
        for (let y = target.y + 1; y <= BoardSize.Height; y++) {
            let action = setRookPos(pos, target, pieces, target.x, y);
            if (action === LoopAction.Break) break;
        }
        return pos;
    },
    [PieceType.Knight]: function (target, pieces) {
        let pos = {}, {x, y} = target;
        if (!pieces[`${x + 1},${y}`]) {
            if (x + 2 <= BoardSize.Width) {
                if (y + 1 <= BoardSize.Height) {
                    let p = {x: x + 2, y: y + 1};
                    pos[`${p.x},${p.y}`] = p;
                }
                if (y - 1 > 0) {
                    let p = {x: x + 2, y: y - 1};
                    pos[`${p.x},${p.y}`] = p;
                }
            }
        }
        if (!pieces[`${x - 1},${y}`]) {
            if (x - 2 > 0) {
                if (y + 1 <= BoardSize.Height) {
                    let p = {x: x - 2, y: y + 1};
                    pos[`${p.x},${p.y}`] = p;
                }
                if (y - 1 > 0) {
                    let p = {x: x - 2, y: y - 1};
                    pos[`${p.x},${p.y}`] = p;
                }
            }
        }
        if (!pieces[`${x},${y + 1}`]) {
            if (y + 2 <= BoardSize.Height) {
                if (x + 1 <= BoardSize.Width) {
                    let p = {x: x + 1, y: y + 2};
                    pos[`${p.x},${p.y}`] = p;
                }
                if (x - 1 > 0) {
                    let p = {x: x - 1, y: y + 2};
                    pos[`${p.x},${p.y}`] = p;
                }
            }
        }
        if (!pieces[`${x},${y - 1}`]) {
            if (y - 2 > 0) {
                if (x + 1 <= BoardSize.Width) {
                    let p = {x: x + 1, y: y - 2};
                    pos[`${p.x},${p.y}`] = p;
                }
                if (x - 1 > 0) {
                    let p = {x: x - 1, y: y - 2};
                    pos[`${p.x},${p.y}`] = p;
                }
            }
        }
        return pos;
    },
    [PieceType.Cannon]: function (target, pieces) {
        let pos = {}, vars = {hasMetPiece: false};

        for (let x = target.x - 1; x > 0; x--) {
            let action = setCannonPos(pos, target, pieces, x, target.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let x = target.x + 1; x <= BoardSize.Width; x++) {
            let action = setCannonPos(pos, target, pieces, x, target.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = target.y - 1; y > 0; y--) {
            let action = setCannonPos(pos, target, pieces, target.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = target.y + 1; y <= BoardSize.Height; y++) {
            let action = setCannonPos(pos, target, pieces, target.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        return pos;
    }
}