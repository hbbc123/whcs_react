import {useState, useEffect, useRef} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined,DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal,Popconfirm, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Leaveset() {
	const [showtf, setshowTf] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [dataSource, setdataSource] = useState(false);
	const [post, setpost] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [type, settype] = useState(0);
	const submit_ref = useRef(null);
	const showModal = (type) => {
		if(type!=0){
			settype(() => crecord.key);
		}else {
			settype(() =>type);
		}
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const onFinish = (e) => {
		console.log(e);
		request("/index/index/add_leave_day", {type, class: e.class, day: parseInt(e.day), leave_root: e.leave_root}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
				setIsModalOpen(false);
			}
		});
	};
	const confirm=()=>{
		request('/index/index/del_leave_del',{id:crecord.key}).then(res=>{
			console.log(res);
			if(res.data.code==200){
				read()
				message.success('删除成功');
			}
		})
	}
	const columns = [
		{
			title: "类型",
			render: (e) => (e.class == 0 ? "请假" : "销假"),
			filters: [
				{
					text: "请假",
					value: "请假",
				},
				{
					text: "销假",
					value: "销假",
				},
			],
			onFilter: (value, record) => {
				const str = record.class == 0 ? "请假" : "销假";
				return str.indexOf(value) === 0;
			},
		},
		{
			title: "时间",
			render: (e) => e.day + "天",
		},
		{
			title: "审批权限",
			dataIndex: "name",
		},
		{
			title: "修改",
			render: () => (
				<Button
					onClick={(e) => {
						showModal(1);
					}}
					type="primary"
					icon={<EditOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
		{
			title: "删除",
			render: () => (
				<Popconfirm placement="top" title={'确定要删除吗?'} onConfirm={confirm} okText="是" cancelText="否">
					<Button onClick={(e) => {}} type="primary" danger icon={<DeleteOutlined />} shape="circle" size="large"></Button>
				</Popconfirm>
			),
		},
	];

	const read = () => {
		request("/index/index/Leaveset").then((res) => {
			const newpost = res.data.post;
			newpost.push({
				label: "班长",
				value: 0,
			});
			setpost(() => [...newpost]);
			setdataSource(() => res.data.data);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
	}, []);
	return (
		<div>
			{isModalOpen ? (
				<Modal title={type != 0 ? "编辑权限" : "新建请销假"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={type != 0 ? crecord : false}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="类型"
							name="class"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Select
								options={[
									{
										value: 0,
										label: "请假",
									},
									{
										value: 1,
										label: "销假",
									},
								]}
							/>
						</Form.Item>
						<Form.Item
							label="天数"
							name="day"
							rules={[
								{
									required: true,
									message: "请销假天数不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>

						<Form.Item
							label="审批权限"
							name="leave_root"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Select options={post} />
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
							showModal(0)
						}}
						type="primary">
						新增
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
