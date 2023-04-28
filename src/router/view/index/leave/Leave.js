import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Tag, Select, Popconfirm} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Leave() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const path = useNavigate();
	const read = () => {
		if (loc.user_id.length == 15 && loc.group == 1) {
			request("/index/index/Leave", {id: loc.user_id}).then((res) => {
				setdataSource(() => [...res.data.data]);
				setshowTf(() => true);
			});
		}
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const confirm = () => {
		request("/index/index/leave_del", {id: crecord.id}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				read();
				message.success("删除成功");
			}
		});
	};
	const columns = [
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "类型",
			render: (e) => (e.leave_class == 0 ? "请假" : "销假"),
		},
		{
			title: "申请时间",
			dataIndex: "leave_start",
		},
		{
			title: "结束时间",
			dataIndex: "leave_end",
		},
		{
			title: "申请标题",
			dataIndex: "leave_accessory",
		},
		{
			title: "申请状态",
			render: (e) =>
				e.state == 0 ? <Tag color="processing">待审批</Tag> : e.state == 1 ? <Tag color="success">同意</Tag> : <Tag color="error">驳回</Tag>,
		},
		{
			title: "审批人",
			dataIndex: "user_name",
		},
		{
			title: "查看详情",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/Leavelook/${crecord.key}`);
					}}
					type="primary"
					icon={<EyeOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
		{
			title: "删除",
			render: () => (
				<Popconfirm placement="top" title={"确定要删除吗?"} onConfirm={confirm} okText="是" cancelText="否">
					<Button onClick={(e) => {}} type="primary" danger icon={<DeleteOutlined />} shape="circle" size="large"></Button>
				</Popconfirm>
			),
		},
	];
	return (
		<div>
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
					{useroot.leave_tf == 0 ? (
						<Button
							className={css.poa}
							onClick={() => {
								path("/home/Leaveadd");
							}}
							type="primary">
							新建申请
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							新建申请
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
