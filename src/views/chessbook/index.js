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
        let fromX = from.x, fromY = from.y, toX = to.x, toY = to.y;
        let name = "";

        if (isOpposite) {
            fromX = BoardSize.Width + 1 - fromX;
            fromY = BoardSize.Height + 1 - fromY;
            toX = BoardSize.Width + 1 - toX;
            toY = BoardSize.Height + 1 - toY;
        }

        if (fromY > toY) {
            name = `进${ChineseNumeral[fromX === toX ? fromY - toY : toX]}`;
        }
        if (fromY < toY) {
            name = `退${ChineseNumeral[fromX === toX ? toY - fromY : toX]}`;
        }
        if (fromY === toY && fromX !== toX) {
            name = `平${ChineseNumeral[toX]}`;
        }

        return name;
    }

    getStepName(item) {
        if (!item) return null;
        let isOpposite = this.props.perspective !== item.color;
        let pieceName = PieceTypeZH[item.type];
        let posName = isOpposite ? ChineseNumeral[BoardSize.Width + 1 - item.from.x] : ChineseNumeral[item.from.x];
        let moveName = this.getMoveName(item, isOpposite);
        return `${pieceName}${posName}${moveName}`;
    }

    componentDidUpdate(){
        let container = this.refs["chess-book"];
        container.scrollTop = container.scrollHeight - container.clientHeight;
    }

    render() {
        return (
            <div ref="chess-book" className="chess-book">
                {this.getBookList()}
            </div>
        )
    }
}