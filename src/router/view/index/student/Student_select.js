import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Popconfirm, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import getNd from "../../../hooks/getNd";
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

export default function Student_select({serve}) {
	const [crecord, setcrecord] = useState(null);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [crecord_s, setsetcrecord_s] = useState(null);
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [class_select, setclass_select] = useState([]);
	const [big_str, setbig_str] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const read = () => {
		request("/index/index/get_select_class", {id: loc.user_id, nd: getNd()}).then((res) => {
			console.log(res);
			const str = [];
			res.data.data.forEach((val) => {
				str.push(val.select_class_info_id);
			});
			setbig_str(() => str);
			setdataSource(() => [...res.data.data]);
			setclass_select(() => [...res.data.class]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const confirm = () => {
		console.log(crecord);
		request("/index/index/del_select_class", {id: crecord.key}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				const data = {
					sen_id: '0',
					info: `选修课:${crecord.name}-${crecord.teacher_name}  退课成功`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);
				read();
			}
		});
	};
	const columns = [
		{
			title: "年度",
			dataIndex: "nd",
		},
		{
			title: "课程",
			dataIndex: "name",
		},
		{
			title: "教师",
			dataIndex: "teacher_name",
		},
		{
			title: "详情",
			render: (e) => (
				<div>
					<div>{`星期:${e.week}`}</div>
					<div>{`节次:${e.section * 2 - 1}-${e.section * 2}`}</div>
					<div>{`地点:${e.place}  [${e.sen_time}-${e.end_time}]`}</div>
				</div>
			),
		},
		{
			title: "退课",
			render: (e) =>
				useroot.slect_class_tui == 0 ? (
					<Popconfirm placement="top" title="确定要退课吗?" onConfirm={confirm} okText="是" cancelText="否">
						<Button type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
					</Popconfirm>
				) : (
					<Button type="primary" icon={<EditOutlined />} disabled shape="circle" size="large"></Button>
				),

			// render: (e) => (
			// 	getNd()==e.nd?<Popconfirm placement="top" title="确定要退课吗?" onConfirm={confirm} okText="是" cancelText="否">
			// 	<Button type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
			// </Popconfirm>:<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
			// ),
		},
	];

	const confirm_s = () => {
		console.log(crecord_s.key);
		request("/index/index/add_select_class", {id: crecord_s.key, nd: getNd(), student: loc.user_id}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				const data = {
					sen_id: '0',
					info: `选修课:${crecord.name}-${crecord.teacher_name}  添加成功`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);
				read();
			} else {
				message.error(res.data.msg);
			}
		});
	};
	const columns_s = [
		{
			title: "课程",
			dataIndex: "name",
		},
		{
			title: "教师",
			dataIndex: "teacher_name",
		},
		{
			title: "详情",
			render: (e) => (
				<div>
					<div>{`星期:${e.week}`}</div>
					<div>{`节次:${e.section * 2 - 1}-${e.section * 2}`}</div>
					<div>{`地点:${e.place}  [${e.sen_time}-${e.end_time}]`}</div>
				</div>
			),
		},
		{
			title: "添加",
			render: (e) =>
				big_str.indexOf(e.key) != -1 ? (
					<Button disabled type="primary" icon={<PlusOutlined />} shape="circle" size="large"></Button>
				) : (
					<Popconfirm placement="top" title="确定要添加该课程吗?" onConfirm={confirm_s} okText="Yes" cancelText="No">
						<Button type="primary" icon={<PlusOutlined />} shape="circle" size="large"></Button>
					</Popconfirm>
				),
		},
	];

	return (
		<div>
			{isModalOpen ? (
				<Modal width={800} title="添加选修课" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Table
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									setsetcrecord_s(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
						dataSource={class_select}
						columns={columns_s}
					/>
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
					{useroot.select_class_xuan == 0 ? (
						<Button
							className={css.poa}
							onClick={() => {
								showModal();
							}}
							type="primary">
							新增选修课
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							新增选修课
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
