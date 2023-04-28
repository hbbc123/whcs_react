import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import React, {useEffect, useState, useRef} from "react";
import request from "../../../axios/request";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function Dormfen() {
	//分配班级页
	const [student_data, setstudent_data] = useState([]);
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_f, setdepartment_specialty_f] = useState([]);
	const [showTf, setshowTf] = useState(false);
	const [department_specialty_f_s, setdepartment_specialty_f_s] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [modata, setmodata] = useState([[], []]);

	const louArr = [];
	const sheArr = [];
	for (let i = 1; i <= 22; i++) {
		louArr.push({lable: i + "栋", value: i, text: i + "栋"});
	}
	for (let j = 2; j <= 7; j++) {
		for (let k = 1; k <= 40; k++) {
			let newshe = k + "";
			if (newshe < 10) {
				newshe = "0" + newshe;
			}
			sheArr.push({lable: j + newshe, value: j + newshe});
		}
	}
	const onFinish = (values, e) => {
		console.log("Success:", values, e);
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		let newstr = str;
		let newstr2 = str2;
		if (!newstr) {
			newstr = crecord.dorm_id;
		}
		if (!newstr2) {
			newstr2 = crecord.dorm_num_id;
		}
		console.log(str, str2);
		request("/index/student/updorm", {student_id: crecord.student_id, dorm_id: newstr, dorm_num_id: newstr2}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
				setIsModalOpen(false);
				setstr(() => "");
				setstr2(() => "");
			} else {
				message.error(res.data.msg);
			}
		});
	};
	const handleCancel = () => {
		read();
		setstr(() => "");
		setstr2(() => "");
		setIsModalOpen(false);
	};
	const addlook = (dorm_id, tf) => {
		if(dorm_id!=null){
			request("/index/student/chalooporm", {dorm_id}).then((res) => {
				if (res.data.code == 310) {
					message.error(res.data.msg);
				}
				if (res.data.data) {
					setmodata(() => [...res.data.data]);
				}
				
			});
		}
		if (tf) {
			showModal();
		}
	
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
		{
			title: "楼栋",
			dataIndex: "dorm_id",
			filters: louArr,
			onFilter: (value, record) => (record.dorm_id + "").indexOf(value + "") === 0,
		},
		{
			title: "宿舍号",
			dataIndex: "dorm_num_id",
			sorter: (a, b) => a.dorm_num_id - b.dorm_num_id,
		},
		{
			title: "修改信息",
			render: () => (
				<Button
					onClick={(e) => {
						addlook(crecord.dorm_id, true);
					}}
					type="primary"
					icon={<EditOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);

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
	}, []);
	const [str, setstr] = useState(null);
	const [str2, setstr2] = useState(null);
	const SelectonChange = (type, data) => {
		if (type == 0) {
			setstr(() => data);
			addlook(data, false);
		} else {
			setstr2(() => data);
		}
		console.log(str, str2);
	};

	const columns_m = [
		{
			title: "宿舍",
			dataIndex: "name",
			key: "key",
		},
		{
			title: "剩余床铺",
			dataIndex: "sheng",
		},
	];
	const delstudent = () => {
		let newstr = str;
		let newstr2 = str2;
		if (!newstr) {
			newstr = crecord.dorm_id;
		}
		if (!newstr2) {
			newstr2 = crecord.dorm_num_id;
		}
		console.log(newstr, newstr2);
		request("/index/student/deldorm", {student_id: crecord.student_id, dorm_id: newstr, dorm_num_id: newstr2}).then((res) => {
			console.log(res);
		});
	};

	return (
		<div>
			{showTf ? (
				<div className={css.por}>
					{isModalOpen ? (
						<Modal
							width={600}
							title={
								crecord.student_id.slice(0, 4) +
								"级 " +
								crecord.department +
								"  " +
								crecord.specialty_name +
								" " +
								crecord.class +
								"班 " +
								" " +
								crecord.student_name +
								" 修改宿舍"
							}
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}>
							<Form
								name="basic"
								labelCol={{
									span: 6,
								}}
								wrapperCol={{
									span: 16,
								}}
								initialValues={{
									remember: true,
								}}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								autoComplete="off">
								<Form.Item label="楼栋号">
									<Select
										onChange={(e) => {
											SelectonChange(0, e);
										}}
										defaultValue={crecord.dorm_id}
										options={louArr}
									/>
								</Form.Item>
								<Form.Item label="宿舍号">
									<Select
										options={sheArr}
										defaultValue={crecord.dorm_num_id}
										onChange={(e) => {
											SelectonChange(1, e);
										}}
									/>
								</Form.Item>
							</Form>
							<Form.Item
								wrapperCol={{
									offset: 8,
									span: 12,
								}}>
								<Button onClick={delstudent} size="large" type="primary" danger>
									删除该学生的住宿信息
								</Button>
							</Form.Item>
							<Table dataSource={modata} columns={columns_m} />
						</Modal>
					) : (
						false
					)}

					<Table
					style={{
						backgroundColor: "white",
					  }}
						columns={columns}
						onChange={onChange}
						dataSource={student_data}
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									setcrecord(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
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
