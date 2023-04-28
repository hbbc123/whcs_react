import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Popconfirm, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Graduate() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [crecord, setcrecord] = useState();
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	const confirm = () => {
		console.log(crecord);
		request("/index/index/up_Graduate", {student_id: crecord.key,type:0}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read()
			}
		});
	};
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		let arrnum = [];
		if (filters.pname) {
			filters.pname.forEach((val) => {
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
	const columns = [
		{
			title: "年级",
			dataIndex: "nd",
		},
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "院系",
			dataIndex: "pname",
			filters:department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "name",
			filters:department_specialty_s,
			onFilter: (value, record) => record.name.startsWith(value),
		},
		{
			title: "班级",
			dataIndex: "num",
		},
		{
			title: "毕业所需学分",
			dataIndex: "graduate",
		},
		{
			title: "已修学分",
			dataIndex: "xuefen",
		},
		{
			title: "批准毕业",
			render: (e) => (
					e.biye_tf==1?   <Popconfirm placement="top" title='不可撤回,请仔细确定该操作' onConfirm={confirm} okText="是" cancelText="否">
						<Button
						type="primary"
						icon={<CheckOutlined />}
						shape="circle"
						size="large"></Button>
				  </Popconfirm>:
					<Button
					disabled
						type="primary"
						icon={<CheckOutlined />}
						shape="circle"
						size="large"></Button>
			),
		},
	];
	const read = () => {
		request("/index/index/Graduate", {nd: new Date().getFullYear()}).then((res) => {
			setdataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
	}, []);
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table
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
