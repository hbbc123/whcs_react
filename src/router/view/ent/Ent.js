import React, {useState, useRef, useEffect} from "react";
import Particles from "react-particles-js";
import "./css/ent.css";
import {Form, Input, Button, Modal, Spin, Table, Alert, message, Card} from "antd";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import gif from "./gif";
import {useNavigate} from "react-router-dom";
import css from "./css/ent.module.css";
import cssss from "../index/educational/css/Distribution.module.css";

import store from "../../redux/store";
import request from "../../axios/request";
const {confirm} = Modal;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function Ent({serve}) {
	const [showtf_s, setshowTf_s] = useState(true);
	const path = useNavigate();
	const [al, setal] = useState(false);
	const [dataVerify, setdataVerify] = useState(null);
	const [verifyUrl, setverifyUrl] = useState(null);
	const [username_s, setusername_s] = useState(null);
	const [password, setpassword] = useState(null);
	const [showTf, setshowTf] = useState(false);
	const imgRef = useRef(null);
	const [msgdata, setmsgdata] = useState([]);
	// const [WebSocket, setWebSocket] = useState(store.getState().getIn(['WebSocket']))
	const onFinish = ({username, password, verify}) => {
		let user = JSON.parse(localStorage.getItem("user"));
		if (verify != dataVerify) {
			message.error("验证码错误请重新输入", 2);
			return;
		}
		request("/enter/code", {user: username, password}).then((res) => {
			console.log(res);
			if (res.data.code == 404) {
				message.error(res.data.msg, 2);
			} else {
				let tf = false;
				if (user) {
					if (user.user_id != username) {
						tf = true;
					}
				} else {
					tf = true;
				}
				if (document.cookie.indexOf("user[0]") == -1 || tf) {
					confirm({
						icon: false,
						okText: "是",
						cancelText: "否",
						centered: true,
						width: 250,
						title: <div style={{textAlign: "center", fontSize: "24px"}}>登陆成功</div>,
						content: <div style={{textAlign: "center"}}>记录用户名密码</div>,
						onOk() {
							request("/enter/code/cookie", {user: username, password}).then((resss) => {
								if (resss.data.code == 200) {
									let group = username.length == 9 ? 0 : 1;
									localStorage.setItem(
										"user",
										JSON.stringify({user_id: username, group, portrait: res.data.portrait, user_name: res.data.user_name})
									);
									serve.send(JSON.stringify({constructor: 1, data: {user_id: username}}));
									setshowTf_s(() => false);
									path("/home/head");
								}
							});
						},
						onCancel() {
							let group = username.length == 9 ? 0 : 1;
							localStorage.setItem(
								"user",
								JSON.stringify({user_id: username, group, portrait: res.data.portrait, user_name: res.data.user_name})
							);
							serve.send(JSON.stringify({constructor: 1, data: {user_id: username}}));
							path("/home/head");
						},
					});
				} else {
					console.log(serve);
					serve.send(JSON.stringify({constructor: 1, data: {user_id: username}}));
					path("/home/head");
				}
			}
		});
	};
	const img = () => {
		request("/enter/code/img").then((res) => {
			setverifyUrl(() => res.data.img);
			setdataVerify(() => res.data.res);
		});
	};
	useEffect(() => {
		img();
		request("/index/index/get_root").then((res) => {
			// store.getState().getIn(['newarr']
			console.log(res);
			store.dispatch({type: "useroot", data: res.data.data[0]});
		});
		let user = JSON.parse(localStorage.getItem("user"));
		console.log(user);
		if (user) {
			request("/enter/code/judge", {user: user.user_id}).then((res) => {
				if (res.data.data) {
					setpassword(() => res.data.data);
				}
				setshowTf(() => true);
			});
			setusername_s(() => user.user_id);
		} else {
			setshowTf(() => true);
		}
	}, []);
	const onClose = (e) => {
		setal(false);
	};
	const dataSource = [
		{
			key: "1",
			bank: '2019T3419',
			password: '690422',
		},
		{
			key: "2",
			bank: '2004T1120',
			password: '379599',
		},
		{
			key: "2",
			bank: '2020592P4846702',
			password: '945365',
		},
	];
	const columns = [
		{
			title: "账号",
			dataIndex: "bank",
			align:'center'
		},
		{
			title: "密码",
			dataIndex: "password",
			align:'center'

		},
	];

	return (
		<div>
			{showtf_s ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<div
						style={{
							position: "absolute",
							zIndex: "9",
							right: "0px",
						}}>
						<Table pagination={false} dataSource={dataSource} columns={columns} />
					</div>
					<div className="enterbox">
						{al ? (
							<Alert
								message="登录失败"
								description="账号不存在或者密码错误"
								type="error"
								closable
								style={{textAlign: "center"}}
								onClose={onClose}
							/>
						) : (
							""
						)}
						<Particles height={document.documentElement.clientHeight} params={gif} />
						<div className="enterxq">
							{showTf ? (
								<Form
									name="basic"
									labelCol={{
										span: 5,
									}}
									wrapperCol={{
										span: 19,
									}}
									initialValues={{
										username: username_s,
										password: password,
									}}
									onFinish={onFinish}
									autoComplete="off">
									{" "}
									<Form.Item>
										<div className={css.title}>综合管理系统</div>
									</Form.Item>
									<Form.Item
										label="用户名"
										name="username"
										rules={[
											{
												required: true,
												message: "请输入用户名",
											},
										]}>
										<Input />
									</Form.Item>
									<Form.Item
										label="密码"
										name="password"
										rules={[
											{
												required: true,
												message: "请输入密码",
											},
										]}>
										<Input.Password />
									</Form.Item>
									<Form.Item
										label="验证码"
										name="verify"
										rules={[
											{
												required: true,
												message: "请输入验证码",
											},
										]}>
										<Input
											style={{
												width: 200,
											}}
										/>
									</Form.Item>
									<img
										ref={imgRef}
										onClick={() => {
											img();
										}}
										className={css.yan}
										src={verifyUrl}
									/>
									<Form.Item
										wrapperCol={{
											offset: 10,
											span: 12,
										}}>
										<Button size="large" type="primary" htmlType="submit">
											登录
										</Button>
									</Form.Item>
								</Form>
							) : (
								false
							)}
						</div>
					</div>
				</div>
			) : (
				<div className={cssss.long_box}>
					<div className={cssss.box_svg}>
						<Spin indicator={antIcon} />
					</div>
				</div>
			)}
		</div>
	);
}
