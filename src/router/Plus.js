import React, {useEffect} from "react";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import store from "./redux/store";
import { message} from "antd";
const loc = JSON.parse(localStorage.getItem("user"));

class Ling {
	wsServer = "ws://192.168.150.129:";
	websocket = null;
	constructor(port) {
		this.wsServer = this.wsServer + port;
		this.websocket = new WebSocket(this.wsServer);

		this.websocket.onopen = (evt) => {
			//使用箭头函数才能拿到this
			console.log("客户端:连接服务器成功");
		};
		this.websocket.onclose = function (evt) {
			//断开连接时执行
			console.log("客户端:连接断开");
		};

		this.websocket.onmessage = function (evt) {
			//接收服务端的消息时执行
			// console.log("服务端:" + evt.data);
		};

		this.websocket.onerror = function (evt, e) {
			//发生错误时执行
			console.log("连接错误" + evt.data);
		};
	}
	send = (str) => {
		this.websocket.send(str);
	};
}
let data = new Ling(8888);
export default function Plus(props) {
	const Comp = React.lazy(() => import(`${props.src}`));
	const location = useLocation();
	const path = useNavigate();
	useEffect(() => {
		const router = `${location.pathname}`;
		if (router.indexOf("/home") != -1) {
			if(loc){
				const user = loc.user_id;
				if (!user) {
					path("/ent");
				}
			}
			
		}
		return ()=>{
		}
	}, [location.pathname]);
	return (
		<React.Suspense fallback={<>加载中</>}>
			<Comp serve={data} />
		</React.Suspense>
	);
}
