import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";

export default class ChineseChess extends BaseComponent{
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    getChessBoard(){
        let rows = [];
        for(let i=1; i<10; i++){
            let cols = [];
            for (let j=1; j<9; j++){
                let props = [];

                if ((i === 1 && j === 4) || (i === 2 && j === 5) || (i === 8 && j === 4) || (i === 9 && j === 5)){
                    props = { className: "diagonal d1" };
                } else if ((i === 1 && j === 5) || (i === 2 && j === 4) || (i === 8 && j === 5) || (i === 9 && j === 4)){
                    props = { className: "diagonal d2" };
                }

                cols.push((
                    <td key={`${i}-${j}`} data-pos={`${i},${j}`}>
                        <div {...props}></div>
                    </td>
                ))
            }
            rows.push((
                <tr key={i}>
                    {i === 5 ? <td colSpan={8} className="chu-river"><div/></td> : cols}
                </tr>
            ))
        }
        return (
            <table className="chess-board">
                <tbody>{rows}</tbody>
            </table>
        );
    }

    render(){
        return (
            <div className="chinese-chess">
                <div className="container">
                    <div className="wrapper">
                        {this.getChessBoard()}
                    </div>
                </div>
            </div>
        )
    }
}