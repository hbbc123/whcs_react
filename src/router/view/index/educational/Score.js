import {useState, useEffect, useRef} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Empty, Collapse} from "antd";
import request from "../../../axios/request";
import getNd from "../../../hooks/getNd";
import store from "../../../redux/store";

const {Panel} = Collapse;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

const columns_s = [
	{
		title: "年级",
		dataIndex: "student_class_num",
	},
	{
		title: "班级",
		dataIndex: "num",
	},
];

export default function Score() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(null);
	const [department, setdepartment] = useState(null);
	const [department_specialty, setdepartment_specialty] = useState(null);
	const [department_specialty_s, setdepartment_specialty_s] = useState(null);
	const [dataSource_s, setdataSource_s] = useState(null);
	const [dataSource_s_info, setdataSource_s_info] = useState([]);
	const [crecord, setcrecord] = useState(null);
	const [crecord_s, setcrecord_s] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [student_info, setstudent_info] = useState(false);
	const [title, settitle] = useState(null);
	const [select_info, setselect_info] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));

	const showModal = (type) => {
		console.log(crecord_s, student_info, dataSource_s_info);
		if (type == 1) {
			const res = dataSource_s_info.find((val, k) => k == student_info.pid);
			settitle(() => {
				return {...res};
			});
		} else {
			const newtitle = {nd: student_info.a_nd, name: student_info.name, specialty_class_id: student_info.select_id};
			settitle(() => {
				return {...newtitle};
			});
		}
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const columns_select = [
		{
			title: "学号",
			dataIndex: "ssid",
		},
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "选修课程",
			dataIndex: "name",
		},
		{
			title: "正考成绩",
			dataIndex: "one_grade",
		},
		{
			title: "补考成绩",
			dataIndex: "two_grade",
		},
		{
			title: "修改成绩",
			render: (e) =>
				useroot.student_grade == 0 ? (
					e.teacher_id == loc.user_id ? (
						<Button
							onClick={() => {
								showModal(2);
							}}
							type="primary"
							icon={<EditOutlined />}
							shape="circle"
							size="large"></Button>
					) : (
						<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
					)
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
				),
		},
	];
	const columns_s_info = [
		{
			title: "学号",
			dataIndex: "ssid",
		},
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "正考成绩",
			dataIndex: "one_grade",
		},
		{
			title: "补考成绩",
			dataIndex: "two_grade",
		},
		{
			title: "修改成绩",
			render: (e) =>
				e.teacher_id == loc.user_id ? (
					<Button
						onClick={() => {
							showModal(2);
						}}
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				) : (
					<Button
						onClick={() => {
							showModal(2);
						}}
						disabled
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				),
		},
	];

	useEffect(() => {
		request("/index/student/score").then((res) => {
			setdataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const columns = [
		{
			title: "院系",
			dataIndex: "name",
			filters: department,
			onFilter: (value, record) => {
				return record.name.indexOf(value) === 0;
			},
		},
		{
			title: "专业",
			dataIndex: "text",
			filters: department_specialty_s,
			onFilter: (value, record) => record.text.indexOf(value) === 0,
		},
	];
	const onChange = (e, ee) => {
		console.log(ee);
		if (ee.name) {
			let str = [];
			ee.name.forEach((par) => {
				department.forEach((val, k) => {
					if (val.text == par) {
						str.push(val.id);
					}
				});
			});
			let arr = [];
			str.forEach((val) => {
				department_specialty.forEach((son) => {
					if (son.department_id == val) {
						arr.push(son);
					}
				});
			});
			setdepartment_specialty_s(() => [...arr]);
		} else {
			setdepartment_specialty_s(department_specialty);
		}
	};
	const look = () => {
		request("/index/student/lookclass", {id: crecord.sid}).then((res) => {
			setdataSource_s(() => [...res.data.data]);
		});
	};
	const lookclass = () => {
		request("/index/student/lookclass_student", {id: crecord_s.id, nd: getNd()}).then((res) => {
			console.log(res);
			setdataSource_s_info(() => [...res.data.data]);
			setselect_info(() => [...res.data.select]);
		});
	};
	const onFinish = (e) => {
		console.log(e);
		if (e.one_grade == null && e.two_grade == null) return;
		const obj = {
			one_grade: parseInt(e.one_grade),
			two_grade: e.two_grade ? parseInt(e.two_grade) : false,
			sid: title.specialty_class_id,
			class_grade_id: student_info.class_grade_id ? student_info.class_grade_id : student_info.student_class,
			student_id: student_info.ssid ? student_info.ssid : student_info.student_id,
			nd: getNd(),
		};
		request("/index/student/upgraden_s", obj).then((res) => {
			lookclass();
		});
	};

	const submit_ref = useRef(null);
	return (
		<div>
			{isModalOpen ? (
				<Modal
					title={title.nd + "年度" + "  " + title.name + "课程" + " " + student_info.student_name + "成绩"}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={{
							one_grade: student_info.one_grade,
							two_grade: student_info.two_grade,
						}}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item label="正考成绩" name="one_grade">
							<Input
								type="number"
								onChange={(e) => {
									const newstudent_info = student_info;
									newstudent_info.one_grade = e.target.value;
									setstudent_info(() => {
										return {...newstudent_info};
									});
								}}
							/>
						</Form.Item>

						<Form.Item label="补考成绩" name="two_grade">
							<Input type="number" disabled={student_info.one_grade ? (student_info.one_grade >= 60 ? true : false) : true} />
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button type="primary" ref={submit_ref} htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table
						expandable={{
							expandedRowRender: (record) => (
								<div>
									<Table
										onRow={(record) => {
											return {
												onMouseEnter: (event) => {
													setcrecord_s(() => {
														return {...record};
													});
												}, // 鼠标移入行
											};
										}}
										expandable={{
											expandedRowRender: (record) =>
												dataSource_s_info.length > 0 ? (
													<Collapse>
														{dataSource_s_info.map((val, k) => (
															<Panel header={val.name + "成绩"} key={k}>
																<Table
																	onRow={(record) => {
																		return {
																			onMouseEnter: (event) => {
																				const newrecord = record;
																				newrecord.pid = k;
																				setstudent_info(() => {
																					return {...newrecord};
																				});
																			}, // 鼠标移入行
																		};
																	}}
																	dataSource={val.sondata}
																	columns={columns_s_info}
																/>
															</Panel>
														))}
														{select_info ? (
															<Panel header={"选修课成绩"} key="sdfg">
																<Table
																	onRow={(record) => {
																		return {
																			onMouseEnter: (event) => {
																				setstudent_info(() => {
																					return {...record};
																				});
																			}, // 鼠标移入行
																		};
																	}}
																	dataSource={select_info}
																	columns={columns_select}
																/>
															</Panel>
														) : (
															false
														)}
													</Collapse>
												) : (
													<Empty />
												),
											rowExpandable: (record) => record.name !== "Not Expandable",
										}}
										onExpand={(e) => {
											if (e) {
												lookclass();
											} else {
												setdataSource_s_info(() => []);
											}
										}}
										dataSource={dataSource_s}
										columns={columns_s}
									/>
								</div>
							),
						}}
						onExpand={(e) => {
							if (e) {
								look();
							}
						}}
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									setcrecord(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
						onChange={onChange}
						dataSource={dataSource}
						columns={columns}
					/>
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
