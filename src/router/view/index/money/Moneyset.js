import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import getNd from "../../../hooks/getNd";
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

export default function Moneyset() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [post, setpost] = useState(null);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const submit_ref = useRef();
	const submit_ref_s = useRef();
	const read = () => {
		request("/index/index/moneyset").then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setpost(() => [...res.data.post]);
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
		submit_ref_s.current.click();
	};
	const handleCancel_s = () => {
		setIsModalOpen_s(false);
	};
	const columns = [
		{
			title: "年度",
			dataIndex: "nd",
		},
		{
			title: "部门",
			dataIndex: "name",
		},
		{
			title: "总经费",
			dataIndex: "zong",
		},
		{
			title: "已使用",
			dataIndex: "yi",
		},
		{
			title: "结余",
			dataIndex: "jie",
		},
		{
			title: "编辑经费",
			render: (e) =>
				useroot.money_change == 0 ? (
					<Button
						disabled={e.department_id ? (getNd() != e.nd ? true : false) : false}
						onClick={(e) => {
							showModal();
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
			title: "编辑权限",
			render: (e) =>
				useroot.money_root == 0 ? (
					<Button
						disabled={e.department_id ? (getNd() != e.nd ? true : e.department_id ? false : true) : false}
						onClick={(e) => {
							showModal_s();
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
	const onFinish = (e) => {
		console.log(e);
		let type;
		if (crecord.department_id) {
			type = 1;
		} else {
			type = 2;
		}
		request("/index/index/up_money", {id: crecord.id, nd: getNd(), type, money: parseInt(e.zong)}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
				setIsModalOpen(false);
			}
		});
	};
	const onFinish_S = ({department_root, department_root_big}) => {
		request("/index/index/up_money_root", {id: crecord.id, nd: getNd(), department_root, department_root_big}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
				setIsModalOpen_s(false);
			}
		});
	};

	return (
		<div>
			{isModalOpen_s ? (
				<Modal title={crecord.name + getNd() + "年度" + "经费权限设置"} open={isModalOpen_s} onOk={handleOk_s} onCancel={handleCancel_s}>
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={crecord}
						onFinish={onFinish_S}
						autoComplete="off">
						<Form.Item label="提示" name="提示">
							默认设置为当前年度
						</Form.Item>
						<Form.Item
							label="申请权限"
							name="department_root"
							rules={[
								{
									required: true,
									message: "申请权限不能为空",
								},
							]}>
							<Select defaultValue="lucy" options={post} />
						</Form.Item>
						<Form.Item
							label="审批权限"
							name="department_root_big"
							rules={[
								{
									required: true,
									message: "审批权限不能为空",
								},
							]}>
							<Select defaultValue="lucy" options={post} />
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button ref={submit_ref_s} type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}
			{isModalOpen ? (
				<Modal title={crecord.name + getNd() + "年度" + "经费设置"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={crecord}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item label="提示" name="提示">
							默认设置为当前年度
						</Form.Item>
						<Form.Item
							label="总经费"
							name="zong"
							rules={[
								{
									required: true,
									message: "经费不能为空",
								},
							]}>
							<Input />
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
