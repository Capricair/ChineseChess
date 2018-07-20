import {PieceType} from "../../enums/index";

//将
class King {
    get type(){
        return PieceType.King;
    }
}

//車
class Rook{
    get type(){
        return PieceType.Rook;
    }
}

//马
class Knight {
    get type(){
        return PieceType.Knight;
    }
}

//相
class Bishop{
    get type(){
        return PieceType.Bishop;
    }
}

//士
class Guard{
    get type(){
        return PieceType.Guard;
    }
}

//炮
class Cannon{
    get type(){
        return PieceType.Cannon;
    }
}

//兵
class Pawn{
    get type(){
        return PieceType.Pawn;
    }
}

export {
    King,
    Rook,
    Knight,
    Bishop,
    Guard,
    Cannon,
    Pawn,
}