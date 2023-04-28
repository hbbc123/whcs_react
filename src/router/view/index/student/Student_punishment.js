import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message,Tag, Form, Input, Select, notification} from "antd";
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

export default function Student_punishment() {
	const [showtf, setshowTf] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [dataSource, setdataSource] = useState([]);
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();
	useEffect(() => {
		request("/student/index/student_punishment", {student_id: loc.user_id}).then((res) => {
			setdataSource(() => [...res.data.data]);
			setshowTf(true);
		});
	}, []);
	const columns = [
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "学号",
			dataIndex: "student_id",
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
			onFilter: (value, record) => record.student_id.indexOf(value) === 0,
		},
		{
			title: "院系",
			dataIndex: "pname",
		},
		{
			title: "专业",
			dataIndex: "name",
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
			title: "被处理人是否同意",
			dataIndex: "stundet_tf",
			sorter: (a, b) => a.stundet_tf - b.stundet_tf,
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
			title: "提起人",
			dataIndex: "send_name",
		},
		{
			title: "审批人",
			dataIndex: "teacher_name",
		},
		{
			title: "是否已处理",
			dataIndex: "admin_tf",
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
			sorter: (a, b) => new Date(a.add_time) - new Date(b.add_time),
		},
		{
			title: "查看详情",
			dataIndex: "end_time",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/class_punishment_x/${crecord.key}/${crecord.student_id}/false`);
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
						style={{
							backgroundColor: "white",
						}}
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
