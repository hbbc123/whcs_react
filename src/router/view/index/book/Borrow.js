import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Tag, Popconfirm} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";
import store from "../../../redux/store";
import getInform from "../../../hooks/getInform";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Punishment({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [department, setdepartment] = useState();
	const [info, setinfo] = useState();
	const [nian, setnian] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bookname, setbookname] = useState(false);
	const [crecord, setcrecord] = useState(false);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const loc = JSON.parse(localStorage.getItem("user"));
	const submit = useRef(null);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const confirm = () => {
		console.log(crecord);
		request("/index/book/book_gui", {id: crecord.id, book_id: crecord.book_id}).then((res) => {
			if (res.data.code == 200) {
				message.success("归还成功");
				const data = {
					sen_id: '0',
					info: `你已归还了书籍${crecord.library_name}`,
					serve,
					accept_id:crecord.user_id,
					loop:true
				};
				getInform(data);
				rand();
			} else {
				message.error("归还失败");
			}
		});
	};
	const columns = [
		{
			title: "姓名",
			dataIndex: "user_name",
		},
		{
			title: "身份类别",
			dataIndex: "value",
			filters: [
				{
					text: "教职工",
					value: "教职工",
				},
				{
					text: "学生",
					value: "学生",
				},
			],
			onFilter: (value, record) => record.value.startsWith(value),
		},
		{
			title: "院系/部门",
			dataIndex: "department",
			filters: department,
			onFilter: (value, record) => record.department.startsWith(value),
		},
		{
			title: "借阅书籍",
			dataIndex: "library_name",
		},
		{
			title: "书籍剩余数量",
			dataIndex: "borrow",
		},
		{
			title: "借阅时间",
			dataIndex: "lend_start",
			filters: nian,
			onFilter: (value, record) => record.lend_start.startsWith(value),
		},
		{
			title: "归还时间",
			dataIndex: "lend_end",
		},
		{
			title: "状态",
			dataIndex: "lend_state",
			sorter: (a, b) => a.lend_state - b.lend_state,
			render: (e) =>
				e == 1 ? (
					<Popconfirm placement="top" title="是否归还" onConfirm={confirm} okText="Yes" cancelText="No">
						<Tag color="success">进行中</Tag>
					</Popconfirm>
				) : (
					<Tag color="default">已结束</Tag>
				),
		},
	];
	const rand = () => {
		request("/index/Book/borrow").then((res) => {
			console.log(res);
			const arr = [];
			res.data.bookname.forEach((val) => {
				arr.push({value: val.value, label: val.value, key: val.key});
			});
			setbookname(() => [...arr]);
			setinfo(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setnian(() => [...res.data.nian]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		rand();
		store.subscribe(() => {
            setuseroot(store.getState().getIn(["useroot"]))
        })
	}, []);
	const onFinish = (e) => {
		console.log(e);
		if (e.user_id.length == 15 || e.user_id.length == 9) {
			let str = null;
			bookname.forEach((val) => {
				console.log(val);
				if (val.value == e.password) {
					str = parseInt(val.key);
				}
			});
			console.log(str);

			request("/index/book/add_jie_book", {user_id: e.user_id, book_id: str}).then((res) => {
				console.log(res);
				if (res.data.code == 310) {
					message.error(res.data.msg);
				} else {
					message.success(res.data.msg);
					rand();
					setIsModalOpen(false);
				}
			});
		} else {
			message.error("请输入正确的教职工号/学号");
			return;
		}
	};

	return (
		<div>
			{showtf ? (
				<div
					className={css.por}
					style={{
						backgroundColor: "white",
					}}>
					<Modal title="添加借阅" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
						<Form
							name="basic"
							labelCol={{
								span: 6,
							}}
							onFinish={onFinish}
							autoComplete="off">
							<Form.Item
								label="教职工号/学号"
								name="user_id"
								rules={[
									{
										required: true,
										message: "请输入教职工号/学号",
									},
								]}>
								<Input />
							</Form.Item>

							<Form.Item
								label="书籍"
								name="password"
								rules={[
									{
										required: true,
										message: "请选择书籍",
									},
								]}>
								<Select
									style={{
										width: 350,
									}}
									options={bookname}
								/>
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
						rowKey={"id"}
						style={{
							borderRightColor: "white",
						}}
						dataSource={info}
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
					{useroot.book_jie == 0 ? (
						<Button
							className={css.poa}
							onClick={() => {
								showModal();
							}}
							type="primary">
							添加借阅
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							添加借阅
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
