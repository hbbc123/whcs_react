import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Student_grade() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	useEffect(() => {
		request("/index/index/student_grade", {id: loc.user_id}).then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setshowTf(() => true);
		});
	}, []);
	const columns = [
		{
			title: "年度",
			dataIndex: "semester",
		},
		{
			title: "课程",
			dataIndex: "name",
		},
		{
			title: "正考成绩",
			dataIndex: "one_grade",
		},
		{
			title: "补考成绩",
			dataIndex: "two_grade",
		},
	];
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table dataSource={dataSource} columns={columns} />
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
