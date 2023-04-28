import {useState, useEffect} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification, Collapse} from "antd";
import request from "../../../axios/request";
import getNd from "../../../hooks/getNd";
import {useRef} from "react";
const {Panel} = Collapse;
const loc = JSON.parse(localStorage.getItem("user"));
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

const columns = [
	{
		title: "年级",
		dataIndex: "student_class_num",
	},
	{
		title: "专业",
		dataIndex: "sname",
	},
	{
		title: "班级",
		dataIndex: "num",
	},

	{
		title: "课程",
		dataIndex: "name",
	},
];

const columns_select = [
	{
		title: "年度",
		dataIndex: "nd",
	},
	{
		title: "课程",
		dataIndex: "select_name",
	},
];
const columns_select_s = [
	{
		title: "学号",
		dataIndex: "sid",
	},
	{
		title: "姓名",
		dataIndex: "student_name",
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

const columns_s = [
	{
		title: "学号",
		dataIndex: "student_id",
	},
	{
		title: "姓名",
		dataIndex: "student_name",
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
export default function Register() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [dataSource_select, setdataSource_select] = useState([]);
	let clentime_ref = false;
	const InputOnchange = (e, type, sid, class_grade_id, student_id) => {
		clearTimeout(clentime_ref);
		clentime_ref = setTimeout(() => {
			console.log("time执行", sid, class_grade_id, student_id);
			request("/index/student/upgraden", {grade: e, type, sid, class_grade_id, student_id, nd: getNd()}).then((res) => {
				if (res.data.code == 200) {
					read();
				}
			});
			clentime_ref = false;
		}, 1000);
	};
	const fy = (newres, type) => {
		newres.forEach((val, k) => {
			val.sondata.forEach((son, j) => {
				if (son.one_grade) {
					if (son.one_grade < 60) {
						newres[k].sondata[j].two_grade = (
							<Input
								onChange={(e) => {
									InputOnchange(
										e.target.value,
										2,
										val.specialty_class_id ? val.specialty_class_id : val.select_class_id,
										son.class_grade_id,
										type == 1 ? son.key : son.sid
									);
								}}
								type="number"
								placeholder="请输入成绩"
							/>
						);
					}
					newres[k].sondata[j].one_grade = (
						<Input
							onChange={(e) => {
								InputOnchange(
									e.target.value,
									1,
									val.specialty_class_id ? val.specialty_class_id : val.select_class_id,
									son.class_grade_id,
									type == 1 ? son.key : son.sid
								);
							}}
							type="number"
							defaultValue={son.one_grade}
						/>
					);
				} else {
					newres[k].sondata[j].one_grade = (
						<Input
							onChange={(e) => {
								InputOnchange(
									e.target.value,
									1,
									val.specialty_class_id ? val.specialty_class_id : val.select_class_id,
									son.class_grade_id,
									type == 1 ? son.key : son.sid
								);
							}}
							type="number"
							placeholder="请输入成绩"
						/>
					);
				}
			});
		});
		if (type == 1) {
			setdataSource(() => [...newres]);
		} else {
			setdataSource_select(() => [...newres]);
		}
	};
	const read = () => {
		request("/index/student/register", {teacher_id: loc.user_id, nd: getNd()}).then((res) => {
			console.log(res);
			if (res.data.data) {
				if (res.data.data.class) {
					const newres = res.data.data.class;
					fy(newres, 1);
				}
				if (res.data.data.select) {
					fy(res.data.data.select, 2);
				}
				setshowTf(() => true);
			}
		});
	};
	useEffect(() => {
		if (loc.group == 0) {
			read();
		}
	}, []);
	return (
		<div>
			{showtf ? (
				<Collapse
				bordered={false}
				defaultActiveKey={dataSource.length>0?1:2}
				accordion
					style={{
						backgroundColor: "white",
					}}>
					{dataSource ? (
						<Panel header="班级成绩" key="1"> 
							<Table
								pagination={false}
								expandable={{
									expandedRowRender: (record) => <Table dataSource={record.sondata} columns={columns_s} />,
								}}
								dataSource={dataSource}
								columns={columns}
							/>
						</Panel>
					) : (
						false
					)}
					{dataSource_select ? (
						<Panel header="选修课成绩" key="2">
							<Table
								pagination={false}
								expandable={{
									expandedRowRender: (record) => <Table dataSource={record.sondata} columns={columns_select_s} />,
								}}
								dataSource={dataSource_select}
								columns={columns_select}
							/>
						</Panel>
					) : (
						false
					)}
				</Collapse>
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
