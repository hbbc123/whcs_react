import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import React, {useEffect, useState, useRef} from "react";
import request from "../../../axios/request";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Distribution() {
	//分配班级页
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [student_data, setstudent_data] = useState([]);
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_f, setdepartment_specialty_f] = useState([]);
	const [showTf, setshowTf] = useState(false);
	const [department_specialty_f_s, setdepartment_specialty_f_s] = useState([]);
	const [batch, setbatch] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpen_s, setIsModalOpen_s] = useState(false);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [msg, setmsg] = useState(null);
	const [affirm, setaffirm] = useState(null);
	const onSelectChange = (newSelectedRowKeys) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const openNotification = () => {
		notification.open({
			message: "操作成功",
			description: false,
			icon: <CheckCircleTwoTone style={{color: "#108ee9"}} />,
		});
	};
	const columns_s_s = [
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "学号",
			dataIndex: "student_id",
		},

		{
			title: "原院系",
			dataIndex: "department_name",
		},
		{
			title: "原专业",
			dataIndex: "specialty_name",
		},
		{
			title: "原班级",
			dataIndex: "class_num",
		},
	];
	const data_s_s = [
		{
			student_name: "张三",
			student_id: "4556",
			class_grade_id: 1,
		},
	];
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		btn.current.click();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const showModal_s = () => {
		setIsModalOpen_s(true);
	};
	const handleOk_s = () => {
		let newbatch = batch;
		newbatch.nj = batch.student_id.slice(0, 4);
		request("/index/index/addclass", {data: selectedRowKeys, t: parseInt(msg.code == 200 || msg.code == 400 ? 0 : 1), batch: newbatch}).then(
			(res) => {
				console.log(res);
				if (res.data.code == 200) {
					setbatch(() => null);
					handleCancel();
					handleCancel_s();
					read(false);
					openNotification();
				} else {
					message.error("操作失败请联系管理员");
				}
			}
		);
	};

	const handleCancel_s = () => {
		setIsModalOpen_s(false);
	};
	const columns = [
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "学号",
			dataIndex: "student_id",
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
			onFilter: (value, record) => record.student_id.indexOf(value) === 0,
		},
		{
			title: "院系",
			dataIndex: "department",
			filters: department,
			onFilter: (value, record) => record.department.indexOf(value) === 0,
		},
		{
			title: "专业",
			dataIndex: "specialty_name",
			filters: department_specialty_f_s,
			onFilter: (value, record) => record.specialty_name.indexOf(value) === 0,
		},
		{
			title: "班级",
			dataIndex: "class",
			sorter: (a, b) => a.class - b.class,
		},
	];

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,

		selections: [
			Table.SELECTION_ALL,
			Table.SELECTION_INVERT,
			Table.SELECTION_NONE,
			{
				key: "odd",
				text: "选择单数",
				onSelect: (changableRowKeys) => {
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return false;
						}
						return true;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
			{
				key: "even",
				text: "选择偶数",
				onSelect: (changableRowKeys) => {
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return true;
						}
						return false;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
		],
	};
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		setSelectedRowKeys(() => []);
		let arrnum = [];
		if (filters.department) {
			filters.department.forEach((val) => {
				department.forEach((son) => {
					if (son.text == val) {
						arrnum.push(son.key);
					}
				});
			});
			let arrdata = [];
			arrnum.forEach((par) => {
				department_specialty.forEach((val) => {
					if (par == val.pid) {
						arrdata.push(val);
					}
				});
			});
			setdepartment_specialty_f_s(() => [...arrdata]);
		} else {
			setdepartment_specialty_f_s(() => [...department_specialty_f]);
		}
	};
	const read = (tf) => {
		request("/index/index/studentedu").then((res) => {
			console.log(res);
			setstudent_data(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_f(() => [...res.data.department_specialty_f]);
			if (tf) {
				setdepartment_specialty_f_s(() => [...res.data.department_specialty_f]);
			}
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read(true);
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const tong = () => {
		console.log(selectedRowKeys);
		let arr = [0, 0, 0],
			k = 0;
		selectedRowKeys.forEach((val) => {
			console.log(val.slice(0, 3));
			if (val.slice(0, 4).indexOf("2021") == -1) {
				arr[0]++;
			} else if (val.slice(0, 4).indexOf("2022") == -1) {
				arr[1]++;
			} else if (val.slice(0, 4).indexOf("2020") == -1) {
				arr[2]++;
			}
		});
		arr.forEach((val) => {
			if (val == 0) {
				k++;
			}
		});
		console.log(arr);
		if (k == 2) {
			request("index/index/selectedRowKeys", {data: selectedRowKeys}).then((res) => {
				if (res.data.code == 404) {
					message.error(res.data.msg);
				} else {
					setbatch(() => {
						return {...res.data.data[0]};
					});
					showModal();
				}
			});
		} else {
			message.error("不是同一届,无法操作");
		}
	};
	const onFinish = (e) => {
		if (parseInt(batch.class_num) <= 0) {
			message.error("班级编号必须大于零");
		} else {
			console.log(parseInt(batch.student_id.slice(0, 4)));
			let arr = {
				department_id: batch.department_id,
				specialty_id: batch.specialty_id,
				class_num: parseInt(batch.class_num),
				grden: parseInt(batch.student_id.slice(0, 4)),
				// student_arr: selectedRowKeys
			};
			request("/index/index/classrep", {res: arr}).then((res) => {
				switch (res.data.code) {
					case 404:
						message.error(res.data.msg);
						break;
					case 400:
					case 200:
					case 202:
						setmsg(() => {
							return {...res.data};
						});
						console.log(batch);
						setIsModalOpen_s(true);
						request("/index/index/addstuendclass", {data: selectedRowKeys}).then((res) => {
							setaffirm(() => res.data);
						});
						break;
					case 303:
						message.error(res.data.msg + "新建班级应为 " + res.data.data);
						break;
				}
			});
		}
	};
	const btn = useRef(null);
	return (
		<div>
			{showTf ? (
				<div className={css.por}>
					<Table
						style={{
							backgroundColor: "white",
						}}
						rowSelection={rowSelection}
						columns={columns}
						onChange={onChange}
						dataSource={student_data}
						onRow={(record) => {
							return {
								onClick: (event) => {
									console.log(record);
								}, // 点击行
							};
						}}
					/>
					<Button
						className={css.poa}
						onClick={() => {
							tong();
						}}
						disabled={useroot.student_class == 0 ? (selectedRowKeys.length > 0 ? false : true) : true}
						type="primary">
						批量操作
					</Button>
					{batch ? (
						<Modal
							title={batch.student_id.slice(0, 4) + "  " + batch.department_name + "  " + batch.specialty_name}
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}>
							{isModalOpen_s ? (
								<Modal
									style={{top: 0}}
									width={800}
									title={
										<div>
											{batch.student_id.slice(0, 4) +
												"  " +
												batch.department_name +
												"  " +
												batch.specialty_name +
												msg.data +
												"班 "}
											{msg.code == 200 || msg.code == 400 ? "新建班级" : "添加学生"}
										</div>
									}
									open={isModalOpen_s}
									onOk={handleOk_s}
									onCancel={handleCancel_s}>
									<Table columns={columns_s_s} dataSource={affirm} />
								</Modal>
							) : (
								false
							)}

							<Form
								name="basic"
								labelCol={{
									span: 5,
								}}
								wrapperCol={{
									span: 19,
								}}
								initialValues={{
									department: batch.department_id,
									specialty: batch.specialty_id,
									class: batch.class_num,
								}}
								onFinish={onFinish}
								autoComplete="off">
								<Form.Item
									label="院系"
									name="department"
									rules={[
										{
											required: true,
											message: "院系不能为空",
										},
									]}>
									<Select
										defaultValue={batch.department_id}
										onChange={(e) => {
											let newpatch = batch;
											department.forEach((val) => {
												if (val.key == e) {
													newpatch.department_name = val.text;
												}
											});
											newpatch.department_id = e;
											newpatch.specialty_id = null;
											newpatch.specialty_name = null;
											setbatch(() => {
												return {...newpatch};
											});
											console.log(batch);
										}}>
										{department.map((val, k) => (
											<Select.Option key={k} value={val.key}>
												{val.text}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item
									label="专业"
									name="specialty"
									rules={[
										{
											required: true,
											message: "专业不能为空",
										},
									]}>
									<Select
										defaultValue={batch.specialty_name}
										onChange={(e) => {
											console.log(e);
											let newpatch = batch;
											newpatch.specialty_id = e;
											department_specialty_f.forEach((val) => {
												if (val.key == e) {
													newpatch.specialty_name = val.text;
												}
											});
											setbatch(() => {
												return {...newpatch};
											});
											console.log(batch);
										}}>
										{department_specialty_f.map((val, k) =>
											val.pid == batch.department_id ? (
												<Select.Option key={k} value={val.key}>
													{val.text}
												</Select.Option>
											) : (
												false
											)
										)}
									</Select>
								</Form.Item>
								<Form.Item label="班级" name="class">
									<Input
										type="number"
										onChange={(e) => {
											let newpatch = batch;
											newpatch.class_num = e.target.value;
											setbatch(() => {
												return {...newpatch};
											});
											console.log(batch);
										}}
										style={{width: 100 + "px"}}
									/>
									班
								</Form.Item>
								<Form.Item
									style={{
										display: "none",
									}}
									wrapperCol={{
										offset: 10,
										span: 12,
									}}>
									<Button ref={btn} size="large" type="primary" htmlType="submit">
										登录
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
