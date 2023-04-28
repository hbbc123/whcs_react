import {useState, useEffect} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Popconfirm, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function ClssManagement() {
	const [showtf, setshowTf] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [dataSource, sedataSource] = useState([]);
	const [department, setdepartment] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	const read=()=>{
		request("/index/index/get_class_student").then((res) => {
			console.log(res);
			sedataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	}
	useEffect(() => {
		read()
	}, []);
	const confirm = () => {
		request('/index/index/del_ClssManagement',{id:crecord.key}).then(res=>{
			if(res.data.code==200){
				message.success(res.data.msg)
				read()
			}
		})
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
			title: "院系",
			dataIndex: "pname",
			filters:department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "sname",
			filters:department_specialty_s,
			onFilter: (value, record) => record.sname.startsWith(value),
		},
		{
			title: "年级",
			dataIndex: "student_class_num",
		},
		{
			title: "班级",
			dataIndex: "num",
		},
		{
			title: "人数",
			dataIndex: "zong",
		},
		{
			title: "删除班级",
			render: (e) =>
				!e.zong ? (
					<Popconfirm placement="top" title={"确定要删除吗?"} onConfirm={confirm} okText="是" cancelText="否">
						<Button type="primary" danger icon={<DeleteOutlined />} shape="circle" size="large"></Button>
					</Popconfirm>
				) : (
					<Button type="primary" danger disabled icon={<DeleteOutlined />} shape="circle" size="large"></Button>
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
					dataSource={dataSource} columns={columns} />
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
