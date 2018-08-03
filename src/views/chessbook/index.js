import React from "react";
import BaseComponent from "../base/index";
import {PieceColor, PieceTypeZH, ChineseNumeral, BoardSize} from "../../enums/";

export default class ChessBook extends BaseComponent {
    static defaultProps = {
        data: [],
        perspective: PieceColor.Red,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    getBookList() {
        let {data} = this.props;
        let list = [];
        for (let i = 0; i < data.length; i += 2) {
            list.push((
                <li key={i}>
                    <div className="player-red">{this.getStepName(data[i])}</div>
                    <div className="player-black">{this.getStepName(data[i + 1])}</div>
                </li>
            ))
        }
        return <ol>{list}</ol>
    }

    getMoveName(item, isOpposite) {
        let {from, to} = item;
        let name = "";

        if (isOpposite) {
            from.x = BoardSize.Width + 1 - from.x;
            from.y = BoardSize.Height + 1 - from.y;
            to.x = BoardSize.Width + 1 - to.x;
            to.y = BoardSize.Height + 1 - to.y;
        }

        if (from.x === to.x && from.y > to.y) {
            name = `进${ChineseNumeral[from.y - to.y]}`;
        }
        if (from.x === to.x && from.y < to.y) {
            name = `退${ChineseNumeral[to.y - from.y]}`;
        }
        if (from.y === to.y && from.x !== to.x) {
            name = `平${ChineseNumeral[to.x]}`;
        }

        return name;
    }

    getStepName(item) {
        if (!item) return null;
        let isOpposite = this.props.perspective !== item.color;
        let pieceName = PieceTypeZH[item.type];
        let posName = isOpposite ? ChineseNumeral[BoardSize.Width + 1 - item.x] : ChineseNumeral[item.from.x];
        let moveName = this.getMoveName(item, isOpposite);
        return `${pieceName}${posName}${moveName}`;
    }

    render() {
        return (
            <div className="chess-book">
                {this.getBookList()}
            </div>
        )
    }
}