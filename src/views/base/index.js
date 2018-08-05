import React from "react";
import WebSocketClient from "../../utils/WebSocketClient";
import Global from "../../utils/Global";
import StoreKey from "../../utils/StoreKey";
import {Views} from "../../enums/index";

export default class BaseComponent extends React.Component{
    constructor(props){
        super(props);
    }

    checkLogin(){
        if (!sessionStorage.getItem(StoreKey.uuid)){
            this.props.history.push(Views.index.pathname);
        }
        if (!Global.socket){
            Global.socket = new WebSocketClient({
                uuid: sessionStorage.getItem(StoreKey.uuid),
                user: sessionStorage.getItem(StoreKey.user),
                fallback: ()=>{
                    this.props.history.push(Views.index);
                }
            });
        }
        if (!window.onunload){
            window.onunload = function(){
                Global.socket.send({
                    action: "close",
                    uuid: sessionStorage.getItem(StoreKey.uuid),
                    user: sessionStorage.getItem(StoreKey.user),
                });
            };
        }
    }
}