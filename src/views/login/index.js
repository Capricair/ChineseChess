import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import {Views} from "../../enums/index";
import WebSocketClient from "../../utils/WebSocketClient";
import Global from "../../utils/Global";

export default class Login extends React.Component {
    constructor(props){
        super(props)
    }

    onSubmitHandler(e){
        e.preventDefault();
        Global.socket = new WebSocketClient({
            user: this.refs[`txtNickName`].value,
        });
        this.props.history.push(Views.hall);
    }

    render(){
        return (
            <div className="login-form">
                <div>
                    <form onSubmit={(e)=>{this.onSubmitHandler(e)}}>
                        <table>
                            <tbody>
                            <tr>
                                <td>昵称</td>
                                <td><input ref="txtNickName" type="text" required/></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><button type="submit">进入游戏大厅</button></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        )
    }
}