import {Table, Button, Modal, Input, Form, Select, Spin, message} from "antd";
import React, {useEffect, useState, useRef} from "react";
import request from "../../../axios/request";
import {LoadingOutlined, SearchOutlined, EditOutlined} from "@ant-design/icons";
import css from "./css/Distribution.module.css";
import {downLoadExcelMode} from "../../../hooks/excel";
import getNd from "../../../hooks/getNd";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function Carrange() {
	const [data, setdata] = useState(null);
	const [department, setdepartment] = useState(null);
	const [department_specialty, setdepartment_specialty] = useState(null);
	const [department_specialty_f, setdepartment_specialty_f] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modal_dataSource, setmodal_dataSource] = useState([]);
	const [msg, setmsg] = useState(null);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));

	const [showTf, setshowTf] = useState(false);
	const submit = useRef(null);
	let startzhou, endzhou;
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		read(false);
		setIsModalOpen(false);
		setmodal_dataSource(() => []);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setmodal_dataSource(() => [...[]]);
	};
	const read = (tf) => {
		request("/index/index/classquery").then((res) => {
			console.log(res);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			if (tf) setdepartment_specialty_f(() => [...res.data.department_specialty]);
			setdata(() => [...res.data.data]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read(true);
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const onChange = (e, ee) => {
		console.log(ee);
		if (ee.department_name) {
			let str = [];
			ee.department_name.forEach((par) => {
				department.forEach((val, k) => {
					if (val.text == par) {
						str.push(val.key);
					}
				});
			});
			let arr = [];
			str.forEach((val) => {
				department_specialty.forEach((son) => {
					if (son.pid == val) {
						arr.push(son);
					}
				});
			});
			setdepartment_specialty_f(() => [...arr]);
		} else {
			setdepartment_specialty_f(department_specialty);
		}
	};

	const columns = [
		{
			title: "年级",
			dataIndex: "nj",
			filters: [
				{
					text: "2020级",
					value: "2020",
				},
				{
					text: "2021级",
					value: "2021",
				},
				{
					text: "2022级",
					value: "2022",
				},
			],
			filterMode: "tree",
			filterSearch: true,
			onFilter: (value, record) => {
				let str = record.nj + "";
				return str.indexOf(value) != -1;
			},
		},
		{
			title: "院系",
			dataIndex: "department_name",
			filters: department,
			onFilter: (value, record) => record.department_name.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "specialty_name",
			filters: department_specialty_f,
			onFilter: (value, record) => record.specialty_name.startsWith(value),
		},
		{
			title: "班级",
			dataIndex: "class_num",
		},

		{
			title: "课表是否完成",
			dataIndex: "accomplish",
		},
		{
			title: "编辑课表",
			render: () =>
				useroot.teacher_class_ke == 0 ? (
					<Button
						onClick={(e) => {
							setTimeout(() => {
								showModal();
							}, 500);
						}}
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
				),
		},
	];
	const modal_columns = [
		{
			title: "节次",
			dataIndex: "jie",
		},
		{
			title: "周一",
			dataIndex: "one",
		},
		{
			title: "周二",
			dataIndex: "two",
		},
		{
			title: "周三",
			dataIndex: "three",
		},
		{
			title: "周四",
			dataIndex: "four",
		},
		{
			title: "周五",
			dataIndex: "five",
		},
	];
	const onFinish = (e) => {};

	const inponChange = (type, e, data, j, i, record) => {
		let id;
		if (type == 0) {
			data.forEach((val) => {
				if (val.key == e) {
					id = val.id;
				}
			});
			let obj = {
				type: 0,
				id,
				class_id: record.class_id,
				nd: getNd(),
				week: j,
				class_time: i,
			};

			request("/index/index/addkeclass", {...obj}).then((res) => {
				console.log(res);
				if (res.data.code == 200) {
					message.success(res.data.msg);
				} else if (res.data.code == 300) {
					message.warning(res.data.msg);
				} else {
					message.error(res.data.msg);
				}
			});
		} else if (type == 1) {
			let id;
			data.forEach((element) => {
				if (element.label == e) {
					id = element.key;
				}
			});
			let obj = {
				teacher_id: id,
				nd: getNd(),
				week: j,
				class_time: i,
				class_id: record.class_id,
			};
			console.log(data);
			request("/index/index/classkadds", {...obj}).then((res) => {
				console.log(res);
				if (res.data.code == 200) {
					message.success(res.data.msg);
				} else if (res.data.code == 310) {
					message.error(res.data.msg);
				} else {
					message.warning(res.data.msg);
				}
			});
		}
	};
	const onchangesit = (e, j, i, record, yuanroom) => {
		if (e.length <= 3) return;
		if (yuanroom == e) return;
		request("/index/index/classsite", {data: e, nd: getNd(), week: j, class_time: i, class_id: record.class_id}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
			} else if (res.data.code == 310) {
				message.error(res.data.msg);
			} else {
				message.warning(res.data.msg);
			}
		});
	};

	const inpz = (type, e, j, i, record) => {
		console.log(record);
		if (parseInt(e) > 17) message.error("不能超过十七周");
		if (type == 0) {
			startzhou = parseInt(e);
		} else {
			endzhou = parseInt(e);
		}
		if (startzhou >= endzhou) message.error("开始周不能小于结束周");
		if (parseInt(e) <= 0) message.error("周不能小于等于零");
		request("/index/index/classtimeadd", {type, zhou: parseInt(e), class_id: record.class_id, week: j, class_time: i, nd: getNd()}).then(
			(res) => {
				console.log(res);
				if (res.data.code == 200) {
					message.success("操作成功");
				} else if (res.data.code == 310) {
					res.data.msg.forEach((val) => {
						message.error(val);
					});
				} else {
					res.data.msg.forEach((val) => {
						message.warning(val);
					});
				}
			}
		);
	};
	const dao = () => {
		// downLoadExcelMode
		request("/index/index/classkadd", {
			data: msg.key,
			nd: getNd(),
			zid: msg.specialty_id,
			kid: msg.department_id,
		}).then((res) => {
			console.log(res.data.data);
			const fileName = `${msg.nj}级 ${msg.department_name} ${msg.specialty_name} ${msg.class_num} 班 ${getNd()} 年度 课表`;
			const sheetData = [];
			let obj = {};
			let ss = 1;
			res.data.data.forEach((val, k) => {
				obj.jie = `${val.class_time * 2 - 1}-${val.class_time * 2}`;
				let week;
				switch (k % 5) {
					case 0:
						week = "one";
						break;
					case 1:
						week = "two";
						break;
					case 2:
						week = "three";
						break;
					case 3:
						week = "four";
						break;
					case 4:
						week = "five";
						break;
				}
				if (val.teacher_name && val.name && val.end_time) {
					obj[week] = `
					${val.name}
					${val.start_time}-${val.end_time}周[${val.class_time * 2 - 1},${val.class_time * 2}]${val.teacher_name}
					${val.classroom}
					`;
				} else {
					obj[week] = "";
				}
				if ((k + 1) / 5 == ss) {
					ss++;
					console.log(7897897, k);
					sheetData.push(obj);
					obj = {};
				}
			});
			console.log(sheetData);
			const sheetFilter = ["jie", "one", "two", "three", "four", "five"];
			const sheetHeader = ["节次/星期", "星期一", "星期二", "星期三", "星期四", "星期五"];
			const nowtime = new Date();
			const sheetName = `${nowtime.getFullYear()}-${nowtime.getMonth() + 1}-${nowtime.getDate()}`;
			console.log(sheetName);
			downLoadExcelMode(fileName, sheetData, sheetFilter, sheetHeader, sheetName);
		});
	};
	return (
		<div>
			{showTf ? (
				<div>
					<Table
						style={{
							backgroundColor: "white",
						}}
						dataSource={data}
						columns={columns}
						onChange={onChange}
						onRow={(record) => {
							return {
								onClick: (event) => {
									console.log(record);
									setmsg(() => {
										return {...record};
									});
									console.log(record.key);
									request("/index/index/classkadd", {
										data: record.key,
										nd: getNd(),
										zid: record.specialty_id,
										kid: record.department_id,
									}).then((res) => {
										console.log(res);
										let obj = [];
										for (let i = 1; i <= 6; i++) {
											obj.push({jie: i * 2 - 1 + "—" + i * 2});
											for (let j = 1; j <= 5; j++) {
												let day = "";
												switch (j) {
													case 1:
														day = "one";
														break;
													case 2:
														day = "two";
														break;
													case 3:
														day = "three";
														break;
													case 4:
														day = "four";
														break;
													case 5:
														day = "five";
														break;
												}
												let tf = true;
												res.data.data.forEach((val) => {
													if (val.week == j && val.class_time == i) {
														tf = false;
														obj[obj.length - 1][day] = (
															<div>
																<Form.Item label="课程" name={"course" + j + i}>
																	<Select
																		onChange={(e) => {
																			inponChange(0, e, res.data.ke, j, i, record);
																		}}
																		defaultValue={val.name}
																		// disabled  排课权限
																		options={res.data.ke}
																	/>
																	{/* <Input defaultValue={val.name} /> */}
																</Form.Item>
																<Form.Item label="教师" name={"teacher" + j + i}>
																	<Select
																		onChange={(e) => {
																			inponChange(1, e, res.data.teacher, j, i, record);
																		}}
																		defaultValue={val.teacher_name}
																		// disabled  排课权限
																		options={res.data.teacher}
																	/>
																</Form.Item>

																<Form.Item label="地点" name={"site" + j + i}>
																	<Input
																		defaultValue={val.classroom}
																		onBlur={(e) => {
																			onchangesit(e.target.value, j, i, record, val.classroom);
																		}}
																	/>
																</Form.Item>
																<div
																	style={{
																		display: "flex",
																	}}>
																	<Form.Item name={"start_time" + j + i}>
																		<Input
																			type="number"
																			onBlur={(e) => {
																				inpz(0, e.target.value, j, i, record);
																			}}
																			defaultValue={val.start_time}
																			style={{width: 115}}
																			addonBefore="开始周"
																		/>
																	</Form.Item>
																	<Form.Item name={"ent_time" + j + i}>
																		<Input
																			type="number"
																			onBlur={(e) => inpz(1, e.target.value, j, i, record)}
																			defaultValue={val.end_time}
																			style={{width: 115}}
																			addonBefore="结束周"
																		/>
																	</Form.Item>
																</div>
															</div>
														);
													}
												});
											}
										}
										console.log(obj);
										setmodal_dataSource(() => [...obj]);
									});
								}, // 点击行
							};
						}}
					/>
					{isModalOpen ? (
						<Modal
							style={{
								top: 0,
							}}
							width={1600}
							title={
								<div>
									{msg.nj}级 {msg.department_name} {msg.specialty_name} {msg.class_num} 班 {getNd()} 年度 课表 &emsp;
									<Button type="primary" onClick={dao}>
										导出课表
									</Button>
								</div>
							}
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}>
							<Form
								wrapperCol={{
									span: 16,
									marginButton: "10px",
								}}
								size="small"
								onFinish={onFinish}>
								<Table
									style={{
										backgroundColor: "white",
									}}
									dataSource={modal_dataSource}
									columns={modal_columns}
								/>
								<Form.Item style={{display: "none"}}>
									<Button ref={submit} type="primary" htmlType="submit">
										提交
									</Button>
								</Form.Item>
							</Form>
						</Modal>
					) : (
						false
					)}
				</div>
			) : (
				<div className={css.long_box}>
					<div className={css.box_svg}>
						<Spin indicator={antIcon} />
					</div>
				</div>
			)}
		</div>
	);
}
