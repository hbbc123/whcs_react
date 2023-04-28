import {Table, Button, Spin, Modal, Input, Form, Select, message} from "antd";
import {LoadingOutlined, SearchOutlined, EditOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import request from "../../../axios/request";
import css from "./css/Distribution.module.css";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function Coach() {
	const [class_info, setclass_info] = useState(null);
	const [department, setdepartment] = useState(null);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [sciplinary, setsciplinary] = useState(null);
	const [sciplinary_c, setsciplinary_c] = useState(null);
	const [showTf, setshowTf] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [selectData, setselectData] = useState([[], []]);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		read();
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		read();
		setIsModalOpen(false);
	};

	const read = (tf) => {
		request("/index/student").then((res) => {
			if (res.data.code == 200) {
				setclass_info(() => [...res.data.data]);
				setsciplinary(() => [...res.data.zyNot]);
				if (tf) {
					setsciplinary_c(() => [...res.data.zyNot]);
				}
				setdepartment(() => [...res.data.department]);
				setshowTf(true);
			} else {
				//请求失败
			}
		});
	};
	useEffect(() => {
		read(true);
		store.subscribe(() => {
            setuseroot(store.getState().getIn(["useroot"]))
        })
	}, []);

	const onChange = (e, ee) => {
		console.log(ee);
		if (ee.pname) {
			let str = [];
			ee.pname.forEach((par) => {
				department.forEach((val, k) => {
					if (val.text == par) {
						str.push(val.key);
					}
				});
			});
			let arr = [];
			str.forEach((val) => {
				sciplinary.forEach((son) => {
					if (son.pid == val) {
						arr.push(son);
					}
				});
			});
			setsciplinary_c(() => [...arr]);
		} else {
			setsciplinary_c(() => [...sciplinary]);
		}
	};

	const columns = [
		{
			title: "年级",
			dataIndex: "student_class_num",
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
				let str = record.student_class_num + "";
				return str.indexOf(value) != -1;
			},
		},
		{
			title: "院系",
			dataIndex: "pname",
			filters: department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "kname",
			filters: sciplinary_c,
			onFilter: (value, record) => record.kname.startsWith(value),
		},
		{
			title: "班级",
			dataIndex: "num",
		},

		{
			title: "辅导员",
			dataIndex: "teacher_name",
		},
		{
			title: "班主任",
			dataIndex: "ban_name",
		},
		{
			title: "编辑班级",
			render: () => (
				useroot.teacher_class_post==0?<Button
				onClick={(e) => {
					request("/index/student/teacherclass", {
						department_id: crecord.department_id,
					}).then((res) => {
						console.log(res);
						setselectData(() => [[...res.data.teacher], [...res.data.ban]]);
					});
					showModal();
				}}
				type="primary"
				icon={<EditOutlined />}
				shape="circle"
				size="large"></Button>:<Button
				disabled
				type="primary"
				icon={<EditOutlined />}
				shape="circle"
				size="large"></Button>
			),
		},
	];

	const onFinish = (values) => {
		console.log("Success:", values);
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};
	const SelectonChange = (type, e) => {
		let teacher_id = null;
		console.log(e);
		if (type == 0) {
			selectData[0].forEach((val) => {
				if (val.label == e) {
					teacher_id = val.teacher_id;
				}
			});
		} else {
			selectData[1].forEach((val) => {
				if (val.label == e) {
					teacher_id = val.teacher_id;
				}
			});
		}
		request("/index/student/classteacher", {
			type,
			teacher_id,
			class_id: crecord.id,
		}).then((res) => {
			message.success(res.data.msg);
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
						dataSource={class_info}
						columns={columns}
						onChange={onChange}
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
					{isModalOpen ? (
						<Modal
							title={
								crecord.student_class_num +
								"级 " +
								crecord.pname +
								"  " +
								crecord.kname +
								" " +
								crecord.num +
								"班 " +
								" 修改信息"
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
								<Form.Item label="辅导员">
									<Select
										onChange={(e) => {
											SelectonChange(0, e);
										}}
										defaultValue={crecord.teacher_name}
										options={selectData[0]}
									/>
								</Form.Item>
								<Form.Item label="班主任">
									<Select
										onChange={(e) => {
											SelectonChange(1, e);
										}}
										defaultValue={crecord.ban_name}
										options={selectData[1]}
									/>
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
