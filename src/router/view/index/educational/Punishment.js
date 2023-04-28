import {useState, useEffect} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Tag} from "antd";
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

export default function Punishment() {
	const path = useNavigate();
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));

	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [crecord, setcrecord] = useState(null);
	useEffect(() => {
		request("/index/student/punishment").then((res) => {
			console.log(res.data);
			setdataSource(() => [...res.data.data]);
			setshowTf(true);
		});
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
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
						path(`/home/class_punishment_x/${crecord.key}/${crecord.student_id}/true`);
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
						position: "relative",
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
					{useroot.student_punishment == 0 ? (
						<div
							style={{
								position: "absolute",
								bottom: "15px",
								left: "20px",
							}}>
							<Button
								type="primary"
								onClick={() => {
									path("/home/class_punishment/add");
								}}>
								添加处分
							</Button>
						</div>
					) : (
						<div
							style={{
								position: "absolute",
								bottom: "15px",
								left: "20px",
							}}>
							<Button type="primary" disabled>
								添加处分
							</Button>
						</div>
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
