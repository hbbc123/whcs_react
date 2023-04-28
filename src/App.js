import {useEffect, useRef, useState} from "react";
import {useRoutes, useNavigate} from "react-router-dom";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {ConfigProvider} from "antd";
import router from "./router/router";
import "./router/public/css/public.css";
import store from "./router/redux/store";
import { message} from "antd";

function App() {
	const routes = useRoutes(router);
	const path = useNavigate();
	const storage = (e) => {
		console.log(e);
		message.success("干什么? 不要动localStorage  重新登录吧你");
		localStorage.removeItem("user");
		path("/ent");
	};
	useEffect(() => {
		window.addEventListener("storage",storage);
		var allcookies = document.cookie;
		console.log(allcookies);
		if (allcookies.indexOf("user[0]") == -1) {
			localStorage.removeItem("user");
		}
		path("/ent");
		return () => {
			window.removeEventListener("storage", storage);
		};
	}, []);
	
	return (
		<div className="App">
			<ConfigProvider locale={zh_CN}>{routes}</ConfigProvider>

		</div>
	);
}

export default App;
