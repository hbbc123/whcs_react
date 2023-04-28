import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined} from "@ant-design/icons";
import {Table, Spin, Button,Tag, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Mypunishment() {
	const [showtf, setshowTf] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [teacher_data, setteacher_data] = useState(null);
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();
	useEffect(() => {
		if (loc.user_id.length == 9 && loc.group == 0) {
			request("/teacher/index/teacherpunishment", {teacher_id: loc.user_id}).then((res) => {
				if(res.data.data.length>0){
					console.log(res);
					setteacher_data(() => [...res.data.data]);
					setshowTf(()=>true)
				}
			});
		}
	}, []);

	const columns = [
		{
			title: "被处理人姓名",
			dataIndex: "beiname",
		},
		{
			title: "被处理人职务",
			dataIndex: "post_name",
		},
		{
			title: "部门",
			dataIndex: "pname",
		},
		{
			title: "被处理人是否同意",
			dataIndex: "teacher_tf",
			sorter: (a, b) => a.teacher_tf - b.teacher_tf,
			render: (teacher_tf) => {
				return teacher_tf == 1 ? (
					<Tag color="success">同意</Tag>
				) : teacher_tf == 0 ? (
					<Tag color="warning">待处理</Tag>
				) : (
					<Tag color="error">反驳</Tag>
				);
			},
		},
		{
			title: "标题",
			dataIndex: "title",
		},
		{
			title: "行政处分",
			dataIndex: "sciplinary_name",
		},
		{
			title: "党纪处分",
			dataIndex: "clan_name",
		},
		{
			title: "发起人",
			dataIndex: "send_name",
		},
		{
			title: "审批人",
			dataIndex: "admin_name",
		},
		{
			title: "是否已处理",
			dataIndex: "admin_tf",
			sorter: (a, b) => a.admin_tf - b.admin_tf,
			render: (admin_tf) => {
				return admin_tf == 1 ? (
					<Tag color="success">同意</Tag>
				) : admin_tf == 0 ? (
					<Tag color="warning">待处理</Tag>
				) : (
					<Tag color="error">反驳</Tag>
				);
			},
		},
		{
			title: "添加时间",
			dataIndex: "add_time",
			sorter: (a, b) => new Date(a.add_time) - new Date(b.add_time),
		},
		{
			title: "处理时间",
			dataIndex: "end_time",
			sorter: (a, b) => new Date(a.end_time) - new Date(b.end_time),
		},
		{
			title: "查看详情",
			dataIndex: "end_time",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/tong_PunishmentX/${crecord.id}/false`);
					}}
					type="primary"
					icon={<EyeOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
	];
	return (
		<div>
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
						dataSource={teacher_data}
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
