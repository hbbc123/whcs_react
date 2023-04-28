import {useState, useEffect, useRef} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Popconfirm, notification} from "antd";
import request from "../../../axios/request";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Book() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpen_s, setIsModalOpen_s] = useState(false);
	const [crecord, setcrecord] = useState(false);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const submit = useRef(null);
	const submit_s = useRef(null);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const showModal_s = () => {
		setIsModalOpen_s(true);
	};
	const handleOk_s = () => {
		submit_s.current.click();
	};
	const handleCancel_s = () => {
		setIsModalOpen_s(false);
	};
	const columns = [
		{
			title: "书籍名",
			dataIndex: "library_name",
			filters: dataSource,
			filterMode: "tree",
			filterSearch: true,
			onFilter: (value, record) => record.library_name.startsWith(value),
		},
		{
			title: "作者",
			dataIndex: "zuozhe",
		},
		{
			title: "添加时间",
			dataIndex: "add_time",
		},
		{
			title: "总数量",
			dataIndex: "book_num",
		},
		{
			title: "借阅数量",
			dataIndex: "lend_num",
		},
		{
			title: "存放地点",
			dataIndex: "site",
		},
		{
			title: "编辑书籍",
			render: () =>
				useroot.book_change == 0 ? (
					<Button
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
	const rand = () => {
		request("/index/Book/index").then((res) => {
			setdataSource(() => [...res.data.data]);
			console.log(res);
			setshowTf(true);
		});
	};
	useEffect(() => {
		rand();
		store.subscribe(() => {
            setuseroot(store.getState().getIn(["useroot"]))
        })
	}, []);
	const onFinish = (values) => {
		console.log("Success:", values);
		request("/index/Book/addbook", {...values}).then((res) => {
			if (res.data.code == 200) {
				notification.open({
					message: "添加成功",
					icon: (
						<CheckCircleOutlined
							style={{
								color: "#259645",
							}}
						/>
					),
				});
				rand();
				setIsModalOpen(false);
			}
		});
	};
	const onFinish_s = (e) => {
		console.log(e);
		request("/index/Book/bookup", {...e}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
			} else {
				message.error(res.data.msg);
			}
			rand();
			setIsModalOpen_s(false);
		});
	};
	const confirm = () => {
		request("/index/Book/bookdel", {id: crecord.id}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				message.success(res.data.msg);
			} else if (res.data.code == 300) {
				message.warning(res.data.msg);
			} else {
				message.error(res.data.msg);
			}
		});
	};
	return (
		<div>
			{showtf ? (
				<div
					className={css.por}
					style={{
						backgroundColor: "white",
					}}>
					{isModalOpen_s ? (
						<Modal
							title={
								<div>
									{`编辑书籍:${crecord.library_name}`}
									<Popconfirm placement="bottom" title="是否删除该书籍" onConfirm={confirm} okText="是" cancelText="否">
										<Button
											style={{
												marginLeft: "30px",
											}}
											type="primary"
											danger>
											删除书籍
										</Button>
									</Popconfirm>
								</div>
							}
							open={isModalOpen_s}
							onOk={handleOk_s}
							onCancel={handleCancel_s}>
							<Form
								name="bookup"
								labelCol={{
									span: 6,
								}}
								wrapperCol={{
									span: 16,
								}}
								initialValues={crecord}
								onFinish={onFinish_s}
								autoComplete="off">
								<Form.Item
									label="ID"
									name="id"
									style={{
										display: "none",
									}}>
									<Input />
								</Form.Item>
								<Form.Item
									label="书籍名"
									name="library_name"
									rules={[
										{
											required: true,
											message: "请填写书籍名",
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="作者"
									name="zuozhe"
									rules={[
										{
											required: true,
											message: "请填写作者",
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="书籍数量"
									name="book_num"
									rules={[
										{
											required: true,
											message: "请填写书籍数量",
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									label="存放地点"
									name="site"
									rules={[
										{
											required: true,
											message: "请填写书籍书籍存放地点",
										},
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									style={{
										display: "none",
									}}>
									<Button ref={submit_s} type="primary" htmlType="submit">
										Submit
									</Button>
								</Form.Item>
							</Form>
						</Modal>
					) : (
						false
					)}
					<Modal title="添加书籍" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
						<Form
							labelCol={{
								span: 4,
							}}
							name="basic"
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							autoComplete="off">
							<Form.Item
								label="书籍名"
								name="book_name"
								rules={[
									{
										required: true,
										message: "请填写书籍名",
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="作者"
								name="zuozhe"
								rules={[
									{
										required: true,
										message: "请填写作者",
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="书籍数量"
								name="book_num"
								rules={[
									{
										required: true,
										message: "请填写书籍数量",
									},
								]}>
								<Input type="number" />
							</Form.Item>
							<Form.Item
								label="存放地点"
								name="site"
								rules={[
									{
										required: true,
										message: "请填写书籍书籍存放地点",
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								style={{
									display: "none",
								}}>
								<Button ref={submit} type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</Modal>
					<Table
						dataSource={dataSource}
						columns={columns}
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
					{useroot.book_add == 0 ? (
						<Button className={css.poa} onClick={showModal} type="primary">
							添加书籍
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							添加书籍
						</Button>
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
