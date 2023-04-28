import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Popconfirm} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Course() {
	const [showtf, setshowTf] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [updata, setupdata] = useState(false);
	const [dataSource, sedataSource] = useState([]);
	const [department, setdepartment] = useState([]);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [class_type, setclass_type] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	const submit_ref = useRef(null);
	const read = () => {
		request("/index/index/Course").then((res) => {
			console.log(res);
			sedataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = (tpye) => {
		setupdata(() => tpye);
		console.log(updata);
		if (tpye) {
			setclass_type(() => crecord.type);
		}
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const onchange_select = (e) => {
		const key = department.find((val) => e == val.value).key;
		const arr = [];
		department_specialty.forEach((val) => {
			if (val.pid == key) {
				console.log(val);
				arr.push(val);
			}
		});
		setdepartment_specialty_s(() => [...arr]);
	};
	const confirm = () => {
		let type = crecord.type == "专业课" ? "a" : crecord.type == "公共课" ? "b" : "c";
		request("/index/index/del_Course", {id: crecord.id, type}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
			}
		});
	};
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		let arrnum = [];
		if (filters.pname) {
			filters.pname.forEach((val) => {
				department.forEach((son) => {
					if (son.text == val) {
						arrnum.push(son.key);
					}
				});
			});
			let arrdata = [];
			console.log(arrnum);
			arrnum.forEach((par) => {
				department_specialty.forEach((val) => {
					if (par == val.pid) {
						arrdata.push(val);
					}
				});
			});
			setdepartment_specialty_s(() => [...arrdata]);
		} else {
			setdepartment_specialty_s(() => [...department_specialty]);
		}
	};
	const columns = [
		{
			title: "类型",
			dataIndex: "type",
		},
		{
			title: "院系",
			dataIndex: "pname",
			filters: department,
			onFilter: (value, record) => {
				const str = record.pname ? record.pname : "你会取这样的名字吗?";
				return str.startsWith(value);
			},
		},
		{
			title: "专业",
			dataIndex: "sname",
			filters: department_specialty_s,
			onFilter: (value, record) => {
				const str = record.sname ? record.sname : "你会取这样的名字吗?";
				return str.startsWith(value);
			},
		},
		{
			title: "课程名",
			dataIndex: "name",
		},
		{
			title: "学时",
			dataIndex: "time",
		},
		{
			title: "学分",
			dataIndex: "grade",
		},
		{
			title: "编辑",
			render: (e) =>
				useroot.ke_class == 0 ? (
					<Button
						onClick={(e) => {
							showModal(true);
						}}
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
				),
		},
		{
			title: "删除",
			render: () =>
				useroot.ket_class_del == 0 ? (
					<Popconfirm placement="top" title={"确定要删除吗?"} onConfirm={confirm} okText="是" cancelText="否">
						<Button onClick={(e) => {}} type="primary" danger icon={<DeleteOutlined />} shape="circle" size="large"></Button>
					</Popconfirm>
				) : (
					<Button onClick={(e) => {}} type="primary" danger icon={<DeleteOutlined />} disabled shape="circle" size="large"></Button>
				),
		},
	];
	const onFinish = (e) => {
		console.log(e);
		let pname = 0,
			sname = 0;
		if (e.type == "专业课") {
			pname = department.find((val) => val.value == e.pname).key;
			sname = department_specialty.find((val) => val.value == e.sname).sid;
		}
		let type = e.type == "专业课" ? "a" : e.type == "公共课" ? "b" : "c";
		request("/index/index/up_Course", {
			pid: pname,
			sid: sname,
			id: crecord.id,
			name: e.name,
			type: type,
			time: parseInt(e.time),
			grade: parseInt(e.grade),
			updata: updata,
		}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
				setIsModalOpen(() => false);
			}
			setIsModalOpen(false);
		});
	};
	const handleChange = (e) => {
		setclass_type(() => e);
	};
	return (
		<div>
			{isModalOpen ? (
				<Modal title={updata ? "编辑课程" : "新增课程"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={updata ? crecord : false}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="课程类型"
							name="type"
							rules={[
								{
									required: true,
									message: "课程类型不能为空",
								},
							]}>
							<Select
								onChange={handleChange}
								options={[
									{
										value: "专业课",
										label: "专业课",
									},
									{
										value: "公共课",
										label: "公共课",
									},
									{
										value: "选修课",
										label: "选修课",
									},
								]}
								disabled={updata ? true : false}
							/>
						</Form.Item>
						{class_type == "专业课" ? (
							<Form.Item
								label="院系"
								name="pname"
								rules={[
									{
										required: true,
										message: "院系不能为空",
									},
								]}>
								<Select onChange={onchange_select} options={department} />
							</Form.Item>
						) : (
							false
						)}
						{class_type == "专业课" ? (
							<Form.Item
								label="专业"
								name="sname"
								rules={[
									{
										required: true,
										message: "专业不能为空",
									},
								]}>
								<Select options={department_specialty_s} />
							</Form.Item>
						) : (
							false
						)}
						<Form.Item
							label="课程名称"
							name="name"
							rules={[
								{
									required: true,
									message: "课程名称不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="学时"
							name="time"
							rules={[
								{
									required: true,
									message: "学时不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							label="学分"
							name="grade"
							rules={[
								{
									required: true,
									message: "学分不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button ref={submit_ref} type="primary" htmlType="submit">
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
					className={css.por}
					style={{
						backgroundColor: "white",
					}}>
					<Table
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
						dataSource={dataSource}
						columns={columns}
					/>
					<Button
						className={css.poa}
						onClick={() => {
							showModal(false);
						}}
						type="primary">
						新增课程
					</Button>
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
