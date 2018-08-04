import React from "react";
import WebSocketClient from "../../utils/WebSocketClient";
import {default as Global} from "../../utils/Global";
import StoreKey from "../../utils/StoreKey";

export default class BaseComponent extends React.Component{
    constructor(props){
        super(props);
        if (!Global.socket){
            Global.socket = new WebSocketClient({
                uuid: localStorage.getItem(StoreKey.uuid),
                user: localStorage.getItem(StoreKey.user),
            });
        }
    }
}