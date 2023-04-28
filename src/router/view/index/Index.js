import {AppstoreOutlined, BarChartOutlined, InboxOutlined, DownloadOutlined, PlayCircleOutlined, FileOutlined} from "@ant-design/icons";
import {Layout, Input, Menu, Drawer, List, Avatar, Collapse, Modal, Badge, message, Upload, Card} from "antd";
import React, {useState, useEffect, useMemo} from "react";
import {Outlet, Link, useLocation, useNavigate} from "react-router-dom";
import request from "../../axios/request";
import store from "../../redux/store";
import VirtualList from "rc-virtual-list";
import {useRef} from "react";
import timestampToTime from "../../hooks/gettime";
import request_post from "../../axios/request_post";
const {Header, Content, Footer, Sider} = Layout;
const {Panel} = Collapse;
const {Dragger} = Upload;

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}
let items,
	loc = JSON.parse(localStorage.getItem("user")),
	items1;
// if (loc && loc.group == 0 && loc.user_id.length == 9) {

// }
const {TextArea} = Input;
const imagType = ".jpg.jpeg.gif.pjpeg.png";
const items_s = [
	{
		label: "消息",
		key: "item-1",
	},
	{
		label: "通讯录",
		key: "item-2",
	},
];

export default function Index({serve}) {
	const [open, setOpen] = useState(false);
	const [address, seaddress] = useState([]);
	const [unread, setunread] = useState(0);
	const baotai = store.getState().getIn(["baotai"]);
	const [loc,setloc] = useState(JSON.parse(localStorage.getItem("user")));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [user_info, setuser_info] = useState();
	const [pipei, setpipei] = useState("");
	const [notwindow, setnotwindow] = useState([]);
	const [items_s_key, setitems_s_key] = useState("item-2");
	const [class_teacher, setclass_teacher] = useState([]);
	const [window_data, setwindow_data] = useState([]);
	const [bbbb, setbbbb] = useState();
	const [items, setitems] = useState([]);
	const [limit, setlimit] = useState(100);
	const [inform_num, setinform_num] = useState(0);
	const TextArea_ref = useRef(null);
	const onClose = () => {
		setOpen(() => !open);
	};

	const close = (e) => {
		try {
			const newdata = JSON.parse(e.data);
			console.log(newdata);
			if (newdata.type == "address") {
				if (loc.group == 0) {
					setclass_teacher(() => [...newdata.class]);
					seaddress(() => [...newdata.data]);
				} else {
					seaddress(() => newdata.data);
				}
			}
			if (newdata.type == "unreadinfo") {
				if (newdata.data.length > 0) {
					let str = "";
					newdata.data.forEach((val) => {
						str += val.sen_id;
					});
					setunread(() => newdata.data.length);
					setpipei(() => str);
				} else {
					setunread(() => 0);
					setpipei(() => "");
				}
			}
			if (newdata.type == "notwindow") {
				setnotwindow(() => newdata.data);
			}
			if (newdata.type == "dialogue") {
				if (!isModalOpen) return;
				let id = user_info.tid ? user_info.tid : user_info.student_id ? user_info.student_id : user_info.sen_id;
				if (newdata.data.length > 0) {
					if (
						!(
							(newdata.data[0].sen_id == id && loc.user_id == newdata.data[0].accept_id) ||
							(newdata.data[0].accept_id == id && newdata.data[0].sen_id == loc.user_id)
						)
					) {
						return;
					}
					if (window_data.length > 0) {
						let res = newdata.data.find((val) => val.id == window_data[window_data.length - 1].id);
						console.log(res);
						if (res) {
							serve.send(JSON.stringify({constructor: 5, data: {sen_id: id, accept_id: loc.user_id}}));
							const rever = newdata.data.reverse();
							setwindow_data(() => rever);
							if (newdata.wei) {
								if (newdata.wei.data.length > 0) {
									let str = "";
									newdata.data.wei.data.forEach((val) => {
										str += val.sen_id;
										console.log(str);
									});
									setunread(() => newdata.data.wei.data.length);
									setpipei(() => str);
								} else {
									console.log(45455);
									setpipei(() => "");
									setunread(() => newdata.wei.data.length);
								}
							}
							const VirtualList = document.getElementsByClassName("rc-virtual-list-holder")[0];
							if (VirtualList) {
								VirtualList.scrollTop = VirtualList.scrollHeight;
							}
							return;
						}
					}
					const rever = newdata.data.reverse();
					const re = [...rever, ...window_data];
					setwindow_data(() => re);
					console.log(window_data);
					if (newdata.wei) {
						if (newdata.wei.data.length > 0) {
							let str = "";
							newdata.data.wei.data.forEach((val) => {
								str += val.sen_id;
								console.log(str);
							});
							setunread(() => newdata.data.wei.data.length);
							setpipei(() => str);
						} else {
							console.log(45455);
							setpipei(() => "");
							setunread(() => newdata.wei.data.length);
						}
					}

					serve.websocket.removeEventListener("message", close, false);
				}
			}
			if (newdata.type == "informcontent") {
				console.log(newdata);
			}
			if (newdata.type == "useroot") {
				store.dispatch({type: "useroot", data: newdata.data[0]});
			}
			if (newdata.type == "inform") {
				//获取未读通知条数
				setinform_num(() => newdata.data[0].wei);
			}
			if (newdata.type == "user_root") {
				request("/index/index/get_post_Systemroot_all_bbb", {user_id: loc.user_id}).then((res) => {
					
					fnitmes(res.data.data);
				});
			}
		} catch (e) {}
	};
	useMemo(() => {
		serve.websocket.addEventListener("message", close, false);
	}, [window_data]);

	const fnitmes = (data) => {
		console.log(data);
		let minarr = [];
		let strarr = [];
		data.forEach((val, k) => {
			if (val.children) {
				val.children.forEach((son) => {
					strarr.push(son.site);
				});
				let sonss = val.children.map((son, j) =>
					getItem(
						<Link className="list-group-item" to={son.site}>
							{son.remark}
						</Link>,
						son.key
					)
				);
				minarr.push(
					getItem(
						val.title,
						val.root_id,
						<BarChartOutlined
							style={{
								display: "none",
							}}
						/>,
						sonss
					)
				);
			} else {
				if (val.key != "inform") {
					minarr.push(
						getItem(
							<Link className="list-group-item" to={val.site}>
								{val.title}
							</Link>,
							val.root_id,
							<BarChartOutlined
								style={{
									display: "none",
								}}
							/>
						)
					);
				} else {
					minarr.push(
						getItem(
							<Link className="list-group-item" to="/home/Inform">
								通知
							</Link>,
							"inform",
							<Badge
								count={inform_num}
								style={{
									display: inform_num > 0 ? "block" : "none",
								}}></Badge>
						)
					);
				}
				strarr.push(val.site);
			}
		});
		store.dispatch({type: "useroot_wen", data: strarr});
		setitems(() => minarr);
	};
	useEffect(() => {
		request("/index/index/get_post_Systemroot_all_bbb", {user_id: loc.user_id}).then((res) => {
			fnitmes(res.data.data);
		});
		serve.send(JSON.stringify({constructor: 2, data: {root: loc.group, user_id: loc.user_id}}));
		return () => {
			serve.websocket.removeEventListener("message", close, false);
		};
	}, [window_data]);
	const list = useRef(null);
	useEffect(() => {
		if (items.length > 0) {
			request("/index/index/get_post_Systemroot_all_bbb", {user_id: loc.user_id}).then((res) => {
				fnitmes(res.data.data);
			});
		}
		console.log(inform_num);
	}, [inform_num]);
	useEffect(() => {
		const VirtualList = document.getElementsByClassName("rc-virtual-list-holder")[0];
		if (VirtualList && limit == 100) {
			console.dir(VirtualList);
			VirtualList.scrollTop = VirtualList.scrollHeight;
		}
	}, [list.current]);

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		console.log(TextArea_ref);
		const text = TextArea_ref.current.resizableTextArea.textArea.value;
		if (text.length == 0) {
			message.error("请输入内容");
		} else {
			let id = user_info.tid ? user_info.tid : user_info.student_id ? user_info.student_id : user_info.sen_id;
			request("/index/index/sendcontent", {accept_id: loc.user_id, sen_id: id, info: text}).then((res) => {
				if (res.data.code == 200) {
					const newwindow_data = window_data;
					newwindow_data.push({
						accept_id: id,
						accessory: null,
						bank: loc.user_id,
						id: window_data[window_data.length - 1].id + 1,
						info: text,
						key: window_data[window_data.length - 1].id + 1,
						portrait: loc.portrait,
						sen_id: loc.user_id,
						sen_time: timestampToTime(new Date().valueOf()),
						state: 0,
						user_id: loc.user_id,
						user_name: loc.user_name,
					});
					TextArea_ref.current.resizableTextArea.textArea.value = "";
					setwindow_data(() => [...newwindow_data]);
					serve.send(JSON.stringify({constructor: 4, data: {sen_id: loc.user_id, accept_id: id}}));
				}
			});
		}
		// setlimit(() => 100);
		// setIsModalOpen(false);
		// setwindow_data(() => []);
	};
	const handleCancel = () => {
		setlimit(() => 100);
		setIsModalOpen(false);
		setwindow_data(() => []);
	};
	const chatBox = (e) => {
		setwindow_data(() => []);
		console.log(e);
		setuser_info(() => {
			return {...e};
		});
		let id = e.tid ? e.tid : e.student_id ? e.student_id : e.sen_id;
		serve.send(JSON.stringify({constructor: 3, data: {sen_id: id, user_id: loc.user_id, limit: 0}}));
		showModal();
	};

	const onScroll = (e, s) => {
		if (e.currentTarget.scrollTop === 0) {
			serve.websocket.removeEventListener("message", close, false);
			let id = user_info.tid ? user_info.tid : user_info.student_id ? user_info.student_id : user_info.sen_id;
			serve.send(JSON.stringify({constructor: 3, data: {sen_id: id, user_id: loc.user_id, limit: limit}}));
			setlimit(() => limit * 2);
		}
	};
	const postFile = (e) => {
		console.log(e);
		let data = new FormData();
		let accept_id = user_info.tid ? user_info.tid : user_info.student_id ? user_info.student_id : user_info.sen_id;
		data.append("file", e.file);
		data.append("accept_id", accept_id);
		data.append("sen_id", loc.user_id);
		data.append("old_name", e.file.name);
		request_post("/index/student/postFile", data).then((res) => {
			const newwindow_data = window_data;
			const obj = {
				accept_id: accept_id,
				accessory: JSON.stringify(res.data.data),
				bank: loc.user_id,
				id: window_data[window_data.length - 1].id + 1,
				info: null,
				key: window_data[window_data.length - 1].id + 1,
				portrait: loc.portrait,
				sen_id: loc.user_id,
				sen_time: timestampToTime(new Date().valueOf()),
				state: 0,
				user_id: loc.user_id,
				user_name: loc.user_name,
			};
			newwindow_data.push(obj);
			console.log(obj);
			setwindow_data(() => [...newwindow_data]);
			let id = user_info.tid ? user_info.tid : user_info.student_id ? user_info.student_id : user_info.sen_id;
			serve.send(JSON.stringify({constructor: 4, data: {sen_id: loc.user_id, accept_id: id}}));
			e.onSuccess();
		});
	};
	const props = {
		name: "file",
		multiple: true,
		customRequest: (e) => {
			postFile(e);
		},
		onChange(info) {
			const {status} = info.file;
			if (status !== "uploading") {
				console.log(info.file, info.fileList);
			}
			if (status === "done") {
				message.success(`${info.file.name} 文件上传成功`);
			} else if (status === "error") {
				message.error(`${info.file.name} 文件上传失败`);
			}
		},
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};
	const [isModalOpen_s, setIsModalOpen_s] = useState(false);
	const [url, seturl] = useState();
	const showModal_s = (url) => {
		seturl(() => {
			return {...url};
		});
		setIsModalOpen_s(true);
	};
	const handleOk_s = () => {
		seturl(() => null);
		setIsModalOpen_s(false);
	};
	const handleCancel_s = () => {
		seturl(() => null);
		setIsModalOpen_s(false);
	};
	const video_ref = useRef(null);
	function download(url, fileName) {
		const a = document.createElement("a");
		a.style.display = "none";
		a.setAttribute("target", "_blank");

		fileName && a.setAttribute("download", fileName);
		a.href = url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	return (
		<div>
			<Layout hasSider>
				<Sider
					style={{
						overflow: "auto",
						height: "100vh",
						position: "fixed",
						left: 0,
						top: 0,
						bottom: 0,
					}}>
					<div className="logo" />
					<Menu onClick={(e) => {}} theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={items} />
				</Sider>
				<Layout
					className="site-layout"
					style={{
						marginLeft: 200,
					}}>
					<Header className="header">
						<List key={"sdfsdf"} itemLayout="horizontal" style={{float: "right", width: "150px"}}>
							<List.Item key={"sdfsdfsdfsdf"}>
								<List.Item.Meta
									avatar={
										<Avatar
											style={{
												width: "40px",
												height: "40px",
											}}
											src={loc ? baotai + loc.portrait : "https://joeschmoe.io/api/v1/random"}
										/>
									}
									title={<div style={{color: "white"}}>{loc ? loc.user_name : "请重新登录"}</div>}
									description={
										<div style={{color: "white"}} onClick={onClose}>
											<span
												style={{
													paddingRight: "5px",
												}}>
												消息
											</span>
											{unread != 0 ? <Badge count={unread} size="small"></Badge> : false}
										</div>
									}
								/>
							</List.Item>
						</List>
						<div className="logo" />
					</Header>
					<Outlet />
				</Layout>
			</Layout>
			{isModalOpen_s && url ? (
				<Modal
					style={{top: "10px"}}
					title={url.old_name}
					footer={null}
					closable={false}
					width={800}
					open={isModalOpen_s}
					onOk={handleOk_s}
					onCancel={handleCancel_s}>
					{imagType.indexOf(url.type) != -1 ? (
						<img
							style={{
								width: "600px",
								height: "600px",
								display: "block",
								margin: "0 auto",
							}}
							onClick={() => {
								download(baotai + "/file/chat/" + url.new_name, url.old_name);
							}}
							src={baotai + "/file/chat/" + url.new_name}
						/>
					) : url.type == ".mp4" ? (
						<video
							controls
							autoplay="autoplay"
							ref={video_ref}
							src={baotai + "/file/chat/" + url.new_name}
							style={{
								width: "780px",
								height: "400px",
								display: "block",
								margin: "0 auto",
							}}
						/>
					) : (
						false
					)}
				</Modal>
			) : (
				false
			)}
			{open ? (
				<Drawer title="通讯列表" placement="right" onClose={onClose} open={open}>
					{isModalOpen ? (
						<Modal
							okText="发送"
							width={600}
							title={
								user_info.teacher_name
									? user_info.teacher_name
									: user_info.student_name
									? user_info.student_name
									: user_info.user_name
							}
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}>
							<List
								key={9999}
								split={false}
								style={{
									marginBottom: "10px",
								}}>
								<VirtualList
									ref={list}
									id="VirtualList"
									data={window_data}
									height={300}
									itemHeight={47}
									itemKey="id"
									onScroll={onScroll}>
									{(val) =>
										val.sen_id != loc.user_id ? (
											<List.Item key={val.id}>
												<List.Item.Meta
													avatar={<Avatar src={baotai + val.portrait} />}
													title={<div>{`${val.user_name}  ${val.sen_time}`}</div>}
													description={
														<div
															style={{
																color: "black",
															}}>
															{val.info ? (
																val.info
															) : val.accessory ? (
																imagType.indexOf(JSON.parse(val.accessory).type) != -1 ? (
																	<img
																		onClick={() => {
																			showModal_s(JSON.parse(val.accessory));
																		}}
																		style={{
																			width: "200px",
																			height: "200px",
																		}}
																		src={baotai + "/file/chat/" + JSON.parse(val.accessory).new_name}
																	/>
																) : JSON.parse(val.accessory).type == ".mp4" ? (
																	<div
																		style={{
																			position: "relative",
																		}}
																		onClick={() => {
																			showModal_s(JSON.parse(val.accessory));
																		}}>
																		<video
																			ref={video_ref}
																			src={baotai + "/file/chat/" + JSON.parse(val.accessory).new_name}
																			width="320"
																			height="240"
																		/>
																		<PlayCircleOutlined
																			style={{
																				position: "absolute",
																				color: "#ffff",
																				top: "40%",
																				fontSize: "50px",
																				left: "65%",
																			}}
																		/>
																	</div>
																) : (
																	<div
																		sdf="45"
																		style={{
																			width: "100%",
																			height: "80px",
																		}}>
																		<div
																			onClick={() => {
																				download(
																					baotai + "/file/chat/" + JSON.parse(val.accessory).new_name,
																					JSON.parse(val.accessory).old_name
																				);
																			}}
																			style={{
																				height: "80px",
																				float: "left",
																				display: "flex",
																				border: "1px solid #ccc",
																				padding: "0 10px",
																				cursor: "pointer",
																				minWidth: "200px",
																			}}>
																			<FileOutlined
																				style={{
																					fontSize: "50px",
																					lineHeight: "80px",
																					display: "block",
																				}}
																			/>
																			<div
																				style={{
																					lineHeight: "80px",
																					fontSize: "18px",
																				}}>
																				{JSON.parse(val.accessory).old_name}
																			</div>
																		</div>
																	</div>
																)
															) : (
																false
															)}
														</div>
													}
												/>
											</List.Item>
										) : (
											<List.Item key={val.id}>
												<List.Item.Meta
													title={
														<div
															style={{
																textAlign: "right",
															}}>
															{`${val.user_name}  ${val.sen_time}`}
														</div>
													}
													description={
														<div
															style={{
																textAlign: "right",
																color: "black",
															}}>
															{val.info ? (
																val.info
															) : val.accessory ? (
																imagType.indexOf(JSON.parse(val.accessory).type) != -1 ? (
																	<img
																		onClick={() => {
																			showModal_s(JSON.parse(val.accessory));
																		}}
																		style={{
																			width: "200px",
																			height: "200px",
																		}}
																		src={baotai + "/file/chat/" + JSON.parse(val.accessory).new_name}
																	/>
																) : JSON.parse(val.accessory).type == ".mp4" ? (
																	<div
																		style={{
																			position: "relative",
																		}}
																		onClick={() => {
																			showModal_s(JSON.parse(val.accessory));
																		}}>
																		<video
																			ref={video_ref}
																			src={baotai + "/file/chat/" + JSON.parse(val.accessory).new_name}
																			width="320"
																			height="240"
																		/>
																		<PlayCircleOutlined
																			style={{
																				position: "absolute",
																				color: "#ffff",
																				top: "40%",
																				fontSize: "50px",
																				left: "65%",
																			}}
																		/>
																	</div>
																) : (
																	<div
																		sdf="45"
																		style={{
																			width: "100%",
																			height: "80px",
																		}}>
																		<div
																			onClick={() => {
																				download(
																					baotai + "/file/chat/" + JSON.parse(val.accessory).new_name,
																					JSON.parse(val.accessory).old_name
																				);
																			}}
																			style={{
																				height: "80px",
																				float: "right",
																				display: "flex",
																				border: "1px solid #ccc",
																				padding: "0 10px",
																				cursor: "pointer",
																				minWidth: "200px",
																			}}>
																			<FileOutlined
																				style={{
																					fontSize: "50px",
																					lineHeight: "80px",
																					display: "block",
																				}}
																			/>
																			<div
																				style={{
																					lineHeight: "80px",
																					fontSize: "18px",
																				}}>
																				{JSON.parse(val.accessory).old_name}
																			</div>
																		</div>
																	</div>
																)
															) : (
																false
															)}
														</div>
													}
												/>
												<div
													style={{
														marginLeft: "10px",
													}}>
													<Avatar src={baotai + val.portrait} />
												</div>
											</List.Item>
										)
									}
								</VirtualList>
							</List>
							<div
								className="list_none"
								style={{
									display: "flex",
								}}>
								<TextArea
									ref={TextArea_ref}
									style={{
										flex: "80%",
									}}
									rows={4}
									placeholder="发送内容"
								/>
								<Dragger
									style={{
										flex: "20%",
										height: "80px",
									}}
									{...props}>
									<p className="ant-upload-drag-icon">
										<InboxOutlined />
									</p>
									<p className="ant-upload-text">点击发送文件</p>
								</Dragger>
							</div>
						</Modal>
					) : (
						false
					)}
					{loc.user_id.length == 9 ? (
						<div>
							<Menu
								onClick={(e) => {
									setitems_s_key(e.key);
								}}
								items={items_s}
								defaultSelectedKeys={items_s_key}
								mode="horizontal"
							/>
							{address.length > 0 && items_s_key == "item-2" ? (
								<Collapse accordion ghost={true}>
									{address.map((val, k) => (
										<Panel key={k} header={val.name + `(${val.sum[0].zai}/${val.sum[0].zong})`}>
											<List itemLayout="horizontal" size="samll">
												{val.sondata.map((son, j) => (
													<List.Item
														key={j}
														onClick={() => {
															chatBox(son);
														}}>
														<List.Item.Meta
															avatar={
																<Badge dot={pipei.indexOf(son.teacher_id) != -1 ? true : false}>
																	<Avatar
																		style={{
																			filter: son.fd ? "none" : "grayscale(100%)",
																		}}
																		src={baotai + son.portrait}
																	/>
																</Badge>
															}
															title={
																<div
																	style={{
																		color: son.fd ? "black" : "#cccc",
																	}}>
																	{son.teacher_name}
																	{son.fd ? "(在线)" : "(离线)"}
																</div>
															}
															description={
																<div
																	style={{
																		color: son.fd ? "black" : "#cccc",
																	}}>
																	{son.post_name}
																</div>
															}
														/>
													</List.Item>
												))}
											</List>
										</Panel>
									))}
									{class_teacher.length > 0
										? class_teacher.map((val, k) => (
												<Panel key={k + 1000} header={val.student_class_num + "级" + val.sname}>
													<List itemLayout="horizontal" size="samll">
														{val.class_children.map((son, j) => (
															<List.Item
																key={j + 3000}
																onClick={() => {
																	chatBox(son);
																}}>
																<List.Item.Meta
																	avatar={
																		<Badge dot={pipei.indexOf(son.teacher_id) != -1 ? true : false}>
																			<Avatar
																				style={{
																					filter: son.fd ? "none" : "grayscale(100%)",
																				}}
																				src={baotai + son.portrait}
																			/>
																		</Badge>
																	}
																	title={
																		<div
																			style={{
																				color: son.fd ? "black" : "#cccc",
																			}}>
																			{son.student_name}
																			{son.fd ? "(在线)" : "(离线)"}
																		</div>
																	}
																/>
															</List.Item>
														))}
													</List>
												</Panel>
										  ))
										: false}
								</Collapse>
							) : (
								<div>
									{notwindow.length > 0 ? (
										<List itemLayout="horizontal">
											{notwindow.map((val, k) => (
												<List.Item
													key={k}
													onClick={() => {
														chatBox(val);
													}}>
													<List.Item.Meta
														avatar={
															<Badge dot={pipei.indexOf(val.sen_id) != -1 ? true : false}>
																<Avatar
																	style={{
																		filter: val.fd ? "none" : "grayscale(100%)",
																	}}
																	src={baotai + val.portrait}
																/>
															</Badge>
														}
														title={<div>{val.user_name}</div>}
														description={
															<div>
																{val.data[0].user_name}:
																{val.data[0].info
																	? val.data[0].info
																	: imagType.indexOf(JSON.parse(val.data[0].accessory).type) != -1
																	? "图片"
																	: JSON.parse(val.data[0].accessory).type == ".mp4"
																	? "视频"
																	: "文件"}
															</div>
														}
													/>
												</List.Item>
											))}
										</List>
									) : (
										false
									)}
								</div>
							)}
						</div>
					) : (
						<div>
							<Menu
								onClick={(e) => {
									setitems_s_key(e.key);
								}}
								defaultSelectedKeys={items_s_key}
								items={items_s}
								mode="horizontal"
							/>
							{address.department && items_s_key == "item-2" ? (
								<div>
									<Collapse accordion ghost={true}>
										{
											<Panel
												key={9633}
												header={address.department.name + `(${address.department.zai}/${address.department.zong})`}>
												<List itemLayout="horizontal" size="samll">
													{address.department.sondata.map((son, j) => (
														<List.Item
															key={j}
															onClick={() => {
																chatBox(son);
															}}>
															<List.Item.Meta
																avatar={
																	<Badge dot={pipei.indexOf(son.bank) != -1 ? true : false}>
																		<Avatar
																			style={{
																				filter: son.fd ? "none" : "grayscale(100%)",
																			}}
																			src={baotai + son.portrait}
																		/>
																	</Badge>
																}
																title={
																	<div
																		style={{
																			color: son.fd ? "black" : "#cccc",
																		}}>
																		{son.teacher_name}
																		{son.fd ? "(在线)" : "(离线)"}
																	</div>
																}
																description={
																	<div
																		style={{
																			color: son.fd ? "black" : "#cccc",
																		}}>
																		{son.post_name}
																	</div>
																}
															/>
														</List.Item>
													))}
												</List>
											</Panel>
										}
										{address.class ? (
											<Panel
												key={555}
												header={
													address.class.nj +
													"级" +
													address.class.sname +
													address.class.num +
													"班" +
													`(${address.class.zai}/${address.class.zong})`
												}>
												<List itemLayout="horizontal" size="samll">
													{address.class.sondata.map((son, j) => (
														<List.Item
															key={j + 3000}
															onClick={() => {
																chatBox(son);
															}}>
															<List.Item.Meta
																avatar={
																	<Badge dot={pipei.indexOf(son.bank) != -1 ? true : false}>
																		<Avatar
																			style={{
																				filter: son.fd ? "none" : "grayscale(100%)",
																			}}
																			src={baotai + son.portrait}
																		/>
																	</Badge>
																}
																title={
																	<div
																		style={{
																			color: son.fd ? "black" : "#cccc",
																		}}>
																		{son.student_name}
																		{son.fd ? "(在线)" : "(离线)"}
																	</div>
																}
															/>
														</List.Item>
													))}
												</List>
											</Panel>
										) : (
											false
										)}
									</Collapse>
								</div>
							) : (
								<div>
									{notwindow.length > 0 ? (
										<List itemLayout="horizontal">
											{notwindow.map((val, k) => (
												<List.Item
													key={k}
													onClick={() => {
														chatBox(val);
													}}>
													<List.Item.Meta
														avatar={
															<Badge dot={pipei.indexOf(val.sen_id) != -1 ? true : false}>
																<Avatar
																	style={{
																		filter: val.fd ? "none" : "grayscale(100%)",
																	}}
																	src={baotai + val.portrait}
																/>
															</Badge>
														}
														title={<div>{val.user_name}</div>}
														description={
															<div>
																{val.data[0].user_name}:{val.data[0].info}
															</div>
														}
													/>
												</List.Item>
											))}
										</List>
									) : (
										false
									)}
								</div>
							)}
						</div>
					)}
				</Drawer>
			) : (
				false
			)}
		</div>
	);
}
