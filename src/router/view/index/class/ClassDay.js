import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Empty, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
import {downLoadExcelMode} from "../../../hooks/excel";
import getNd from "../../../hooks/getNd";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function ClassDay() {
	const [showtf, setshowTf] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [mpty, setmpty] = useState(false);
	const [dataSource, setdataSource] = useState();
	const [msg, setmsg] = useState();
	const path = useNavigate();
	const dao=()=>{
		const fileName = `${msg.student_class_num}级 ${msg.pname} ${msg.sname} ${msg.num} 班 ${getNd()} 年度 课表`;
		const sheetData = [];
		let obj = {};
		let ss=1
		msg.sondata.forEach((val, k) => {
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
			if (((k+1) /5)==ss) {
				ss++
				console.log(7897897,k);
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
	}
	useEffect(() => {
		if (loc.user_id) {
			request("/teacher/index/class_day", {teacher_id: loc.user_id}).then((res) => {
				if (res.data.data) {
					const newdata = res.data.data;
					newdata.forEach((val, k) => {
						let s = 0;
						val.sondata.forEach((son) => {
							if (son.classroom && son.class_time && son.teacher_id && son.start_time && son.end_time) {
								s++;
							}
						});
						newdata[k].ke = s + "节课";
					});
					console.log(newdata);
					setdataSource(() => [...newdata]);
				} else {
					setmpty(() => true);
				}
				setshowTf(() => true);
			});
		} else {
			message.error("缺少必要信息,请重新登录");
			path("ent");
		}
	}, []);
	const columns = [
		{
			title: "年级",
			dataIndex: "student_class_num",
		},
		{
			title: "院系",
			dataIndex: "pname",
		},
		{
			title: "专业",
			dataIndex: "sname",
		},
		{
			title: "辅导员",
			dataIndex: "instructor_name",
		},
		{
			title: "班主任",
			dataIndex: "director_name",
		},
		{
			title: "课时",
			dataIndex: "ke",
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
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					{mpty ? (
						<div
							style={{
								paddingTop: "300px",
							}}>
							<Empty />
						</div>
					) : (
						<div className={css.por}>
							<Table
								// onRow={(record) => {
								// 	return {
								// 		onMouseEnter: (event) => {
								// 			console.log(record);
								// 		}, // 鼠标移入行
								// 	};
								// }}
								onExpand={(e,record) => {
									setmsg(()=>{return {...record}})
									console.log(e,record);
								}}
								expandable={{
									expandedRowRender: (record) => {
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
												record.sondata.forEach((val) => {
													if (val.week == j && val.class_time == i) {
														tf = false;
														obj[obj.length - 1][day] = (
															<div>
																<Form.Item label="课程" name={"course" + j + i}>
																	<Select
																		disabled
																		defaultValue={val.name}
																		// disabled  排课权限
																	/>
																</Form.Item>
																<Form.Item label="教师" name={"teacher" + j + i}>
																	<Select disabled defaultValue={val.teacher_name} />
																</Form.Item>

																<Form.Item label="地点" name={"site" + j + i}>
																	<Input disabled defaultValue={val.classroom} />
																</Form.Item>
																<div
																	style={{
																		display: "flex",
																	}}>
																	<Form.Item name={"start_time" + j + i}>
																		<Input
																			disabled
																			type="number"
																			defaultValue={val.start_time}
																			style={{width: 115}}
																			addonBefore="开始周"
																		/>
																	</Form.Item>
																	<Form.Item name={"ent_time" + j + i}>
																		<Input
																			disabled
																			type="number"
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
										return (
											<div>
												<Table dataSource={obj} columns={modal_columns} />
												<div className={css.poa}>
													<Button onClick={dao} type="primary">导出课表到Excel</Button>
												</div>
											</div>
										);
									},
								}}
								rowKey={"id"}
								dataSource={dataSource}
								columns={columns}
							/>
						</div>
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
