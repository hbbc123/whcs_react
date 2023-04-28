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
const columns_s = [
	{
		title: "入职日期",
		dataIndex: "entry_time",
	},
	{
		title: "结束日期",
		dataIndex: "end_time",
	},
	{
		title: "教职工号",
		dataIndex: "teacher_id",
	},
	{
		title: "性别",
		dataIndex: "sex",
	},
	{
		title: "地址",
		dataIndex: "site",
	},
	{
		title: "身份证号",
		dataIndex: "card",
	},
	{
		title: "出生日期",
		dataIndex: "age",
	},
	{
		title: "手机号",
		dataIndex: "iphone",
	},
];
export default function Beforestudent() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [department, setdepartment] = useState([]);
	useEffect(() => {
		request("/index/index/Beforeteacher").then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setshowTf(() => true);
		});
	}, []);

	const columns = [
		{
			title: "姓名",
			dataIndex: "teacher_name",
		},
		{
			title: "院系",
			dataIndex: "pname",
			filters: department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "原因",
			render: (e) => (e.state == 0 ? "在职" : e.state == 1 ? "退休" :e.state == 2 ?'离职':e.state == 3 ?'开除':'调转'),
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
						expandable={{
							expandedRowRender: (record) => <Table pagination={false} dataSource={[record]} columns={columns_s} />,
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
