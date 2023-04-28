import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Popconfirm} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";
import {downLoadExcelMode} from "../../../hooks/excel";
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
		title: "入学日期",
		dataIndex: "student_time",
	},
	{
		title: "学号",
		dataIndex: "student_id",
	},
	{
		title: "政治面貌",
		render: (e) => (e.student_politics == 1 ? "党员" : e.student_politics == 2 ? "团员" : e.student_politics == 3 ? "群众" : "积极分子"),
	},
	{
		title: "性别",
		dataIndex: "student_sex",
	},
	{
		title: "地址",
		dataIndex: "student_site",
	},
	{
		title: "身份证号",
		dataIndex: "student_card",
	},
	{
		title: "出生日期",
		dataIndex: "student_age",
	},
	{
		title: "手机号",
		dataIndex: "student_iphone",
	},
];
export default function Management() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	const [crecord, setcrecord] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const submit_ref = useRef(null);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const [isModalOpen_s, setIsModalOpen_s] = useState(false);
	const showModal_s = () => {
		setIsModalOpen_s(true);
	};
	const handleOk_s = () => {
		request('/index/index/up_Graduate',{student_id:crecord.key,tpye:1}).then(res=>{
			if(res.data.code==200){
				message.success(res.data.msg)
				setIsModalOpen_s(false);
				setIsModalOpen(false);
				read()
			}
		})
	};
	const handleCancel_s = () => {
		setIsModalOpen_s(false);
	};
	const read = () => {
		request("/index/index/Management").then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
	}, []);
	const columns = [
		{
			title: "姓名",
			dataIndex: "student_name",
		},

		{
			title: "年级",
			dataIndex: "nj",
			filters: [
				{
					text: new Date().getFullYear(),
					value: new Date().getFullYear(),
				},
				{
					text: new Date().getFullYear() - 1,
					value: new Date().getFullYear() - 1,
				},
				{
					text: new Date().getFullYear() - 2,
					value: new Date().getFullYear() - 2,
				},
			],
			onFilter: (value, record) => record.nj.startsWith(value),
		},
		{
			title: "院系",
			dataIndex: "name",
			filters: department,
			onFilter: (value, record) => record.name.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "sname",
			filters: department_specialty_s,
			onFilter: (value, record) => record.sname.startsWith(value),
		},
		{
			title: "编辑信息",
			render: () => (
				<Button
					onClick={(e) => {
						showModal();
					}}
					type="primary"
					icon={<EditOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
	];
	const onFinish = ({student_iphone, student_name, student_sex, student_site}) => {
		request("/index/index/up_Management", {
			student_iphone: parseInt(student_iphone),
			student_name,
			student_sex,
			student_site,
			student_id: crecord.key,
		}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
			}
		});
		setIsModalOpen(false);
	};
	const dao = () => {
		const arr = {
			key: "学号",
			name: "院系",
			sname: "专业",
			nj: "年级",
			student_time: "入学时间",
			student_sex: "性别",
			student_age: "出生日期",
			student_card: "身份证号",
			student_site: "地址",
			student_iphone: "手机号",
		};
		const sheetData = [];
		dataSource.forEach((val, k) => {
			const obj = {};
			for (let j in val) {
				obj[j] = val[j];
			}
			sheetData.push(obj);
		});
		const fileName = "学生总览表";
		const sheetHeader = [];
		const sheetFilter = [];
		const nowtime = new Date();
		const sheetName = `${nowtime.getFullYear()}-${nowtime.getMonth() + 1}-${nowtime.getDate()}`;
		console.log(sheetName);
		for (let s in arr) {
			sheetHeader.push(arr[s]);
			sheetFilter.push(s);
		}
		downLoadExcelMode(fileName, sheetData, sheetFilter, sheetHeader, sheetName);
	};
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		let arrnum = [];
		if (filters.name) {
			filters.name.forEach((val) => {
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
	const confirm_del = () => {
		showModal_s()
	};
	return (
		<div>
			{isModalOpen_s ? <Modal title={false} open={isModalOpen_s} onOk={handleOk_s} onCancel={handleCancel_s}>
				<div>请再次确认该操作</div>
			</Modal> : false}
			{isModalOpen ? (
				<Modal title={crecord.student_name + "的信息编辑"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={crecord}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="姓名"
							name="student_name"
							rules={[
								{
									required: true,
									message: "姓名不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="性别"
							name="student_sex"
							rules={[
								{
									required: true,
									message: "性别不能为空",
								},
							]}>
							<Select
								options={[
									{
										value: "男",
										label: "男",
									},
									{
										value: "女",
										label: "女",
									},
								]}
							/>
						</Form.Item>
						<Form.Item
							label="地址"
							name="student_site"
							rules={[
								{
									required: true,
									message: "地址不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="手机号"
							name="student_iphone"
							rules={[
								{
									required: true,
									message: "手机号不能为空",
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
					<div
						style={{
							paddingLeft: "80px",
						}}>
						<Popconfirm placement="top" title="请仔细确定,该操作不可撤回" onConfirm={confirm_del} okText="是" cancelText="否">
							<Button type="link" danger>
								开除该学生
							</Button>
						</Popconfirm>
					</div>
				</Modal>
			) : (
				false
			)}
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
						position: "relative",
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
						expandable={{
							expandedRowRender: (record) => <Table pagination={false} dataSource={[record]} columns={columns_s} />,
						}}
						columns={columns}
						dataSource={dataSource}
					/>
					<Button
						style={{
							position: "absolute",
							bottom: "15px",
							left: "20px",
						}}
						type="primary"
						onClick={() => {
							dao();
						}}>
						导出信息到Excel
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
