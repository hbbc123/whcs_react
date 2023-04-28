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

export default function Beforestudent() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [crecord, setcrecord] = useState();
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	useEffect(() => {
		request("/index/index/Beforestudent").then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	}, []);
	const columns_s = [
		{
			title: "入学日期",
			dataIndex: "student_time",
		},
		{
			title: "学号",
			dataIndex: "student_id",
		},
		{
			title: "政治面貌",
			render: (e) => (e.student_politics == 1 ? "党员" : e.student_politics == 2 ? "团员" : e.student_politics == 3 ? "群众" : "积极分子"),
		},
		{
			title: "性别",
			dataIndex: "student_sex",
		},
		{
			title: "地址",
			dataIndex: "student_site",
		},
		{
			title: "身份证号",
			dataIndex: "student_card",
		},
		{
			title: "出生日期",
			dataIndex: "student_age",
		},
		{
			title: "手机号",
			dataIndex: "student_iphone",
		},
	];
	const columns = [
		{
			title: "年级",
			dataIndex: "year",
		},
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "院系",
			dataIndex: "pname",
			filters: department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "sname",
			filters: department_specialty_s,
			onFilter: (value, record) => record.name.startsWith(value),
		},
		{
			title: "原因",
			render: (e) => (e.student_state == 0 ? "毕业" : e.student_state == 1 ? "开除" : "休学"),
		},
	];
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		let arrnum = [];
		if (filters.name) {
			filters.name.forEach((val) => {
				department.forEach((son) => {
					if (son.text == val) {
						arrnum.push(son.key);
					}
				});
			});
			let arrdata = [];
			console.log(arrnum);
			arrnum.forEach((par) => {
				department_specialty.forEach((val) => {
					if (par == val.pid) {
						arrdata.push(val);
					}
				});
			});
			setdepartment_specialty_s(() => [...arrdata]);
		} else {
			setdepartment_specialty_s(() => [...department_specialty]);
		}
	};
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
						onChange={onChange}
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
