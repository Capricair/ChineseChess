import "./index.scss";
import React from "react";
import BaseComponent from "../base/index";
import {Views} from "../../enums/index";
import {WebSocketClient, Global, StoreKey} from "../../utils/index";

export default class Login extends BaseComponent {
    constructor(props) {
        super(props)
    }

    onSubmitHandler(e) {
        e.preventDefault();
        Global.socket = new WebSocketClient({
            uuid: sessionStorage[StoreKey.uuid] || Global.UUID,
            user: this.refs[`txtNickName`].value,
            success: () => {
                this.props.history.push(Views.hall);
            },
            onerror: (e) => {
                alert("服务器连接失败！");
            },
        });
    }

    render() {
        return (
            <div className="login-form">
                <div>
                    <form onSubmit={(e) => {
                        this.onSubmitHandler(e)
                    }}>
                        <table>
                            <tbody>
                            <tr>
                                <td>昵称</td>
                                <td><input ref="txtNickName" type="text" required/></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button type="submit">进入游戏大厅</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        )
    }
}