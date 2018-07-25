import PieceType from "./PieceType";
import BoardSize from "./BoardSize";

let LoopAction = {
    Continue: 0,
    Break: 1,
};

function setRookPos(posList, target, pieces, x, y) {
    let piece = pieces[`${y},${x}`];
    if (piece){
        if (piece.color !== target.color){
            posList[`${y},${x}`] = {x: x, y: y};
        }
        return LoopAction.Break;
    } else {
        posList[`${y},${x}`] = {x: x, y: y};
    }
}

function setCannonPos(posList, target, pieces, x, y, vars) {
    let piece = pieces[`${y},${x}`];
    if (vars.hasMetPiece && piece && piece.color !== target.color){
        posList[`${y},${x}`] = {x: x, y: y};
        return LoopAction.Break;
    }
    if (!vars.hasMetPiece && piece){
        vars.hasMetPiece = true;
        return LoopAction.Continue;
    }
    if (!vars.hasMetPiece && !piece){
        posList[`${y},${x}`] = {x: x, y: y};
    }
}

export default {
    [PieceType.Rook]: function (target, from, pieces) {
        let pos = {};
        for (let x = from.x - 1; x > 0; x--) {
            let action = setRookPos(pos, target, pieces, x, from.y);
            if (action === LoopAction.Break) break;
        }
        for (let x = from.x + 1; x <= BoardSize.Width; x++) {
            let action = setRookPos(pos, target, pieces, x, from.y);
            if (action === LoopAction.Break) break;
        }
        for (let y = from.y - 1; y > 0; y--) {
            let action = setRookPos(pos, target, pieces, from.x, y);
            if (action === LoopAction.Break) break;
        }
        for (let y = from.y + 1; y <= BoardSize.Height; y++) {
            let action = setRookPos(pos, target, pieces, from.x, y);
            if (action === LoopAction.Break) break;
        }
        return pos;
    },
    [PieceType.Cannon]: function (target, from, pieces) {
        let pos = {}, vars = {hasMetPiece: false};

        for (let x = from.x - 1; x > 0; x--) {
            let action = setCannonPos(pos, target, pieces, x, from.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let x = from.x + 1; x <= BoardSize.Width; x++) {
            let action = setCannonPos(pos, target, pieces, x, from.y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = from.y - 1; y > 0; y--) {
            let action = setCannonPos(pos, target, pieces, from.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        for (let y = from.y + 1; y <= BoardSize.Height; y++) {
            let action = setCannonPos(pos, target, pieces, from.x, y, vars);
            if (action === LoopAction.Continue) continue;
            if (action === LoopAction.Break) break;
        }
        vars.hasMetPiece = false;

        return pos;
    }
}