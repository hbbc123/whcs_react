import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Cascader, Modal, message, Form, Input, Select, notification, Checkbox, DatePicker} from "antd";
import request from "../../../axios/request";
import json from "./beij";
import { useNavigate } from "react-router-dom";
const {Option} = Select;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function TeacherAdd() {
	const [showtf, setshowTf] = useState(false);
	const [data, setdata] = useState(false);
	const [department_specialty, setdepartment_specialty] = useState([{}]);
	const [politicsTf, setpoliticsTf] = useState([]);
	const [teacher_id_rand, setteacher_id_rand] = useState("");
	const [time, settime] = useState(["", ""]);
	const [site, setsite] = useState([]);
	const path=useNavigate()
	const onFinish = (values) => {
		values.teacher_id = teacher_id_rand;
		values.site = site[0] + site[1] + values.site;
		values.age = time[0];
		values.entry_time = time[1];

		const id =
			/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
		if (id.test(values.card) != true) {
			message.error("请输入正确的身份证号");
			return;
		}
		function isMobile(mobile) {
			return /^1[3-9]\d{9}$/.test(mobile);
		}
		if(!isMobile(values.iphone)){
			message.error("请输入正确的手机号");
			return;
		}
		console.log("Success:", values);
		request("teacher/index/teacherAddinfo", {...values}).then((res) => {
			if(res.data.code==200){
				notification.open({
					message: '保存成功',
					icon: (
						<CheckCircleOutlined
						  style={{
							color: '#259645',
						  }}
						/>
					  ),
				  });
				path(-1)
			}
		});
	};
	const rand = () => {
		const d = new Date();
		let s = parseInt(Math.random() * 1000) + "";
		if (s.length < 4) {
			for (let i = s.length; i < 4; i++) {
				s += "0";
			}
		}
		const n = d.getFullYear() + "T" + s;
		setteacher_id_rand(() => n);
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};
	const handleChange = (value) => {
		const arr = [];
		data[1].forEach((val) => {
			if (val.pid == data[0][value - 1]["key"]) {
				arr.push(val);
			}
		});
		setdepartment_specialty(() => [...arr]);
	};
	const handleChangedepartment_specialty = (e) => {
		console.log(e);
	};
	useEffect(() => {
		request("/teacher/index/teacher_add").then((res) => {
			console.log(res);
			rand();
			setdata(() => [res.data.department, res.data.department_specialty, res.data.politics, res.data.politics_post, res.data.post]);
			setshowTf(true);
		});
	}, []);
	const displayRender = (labels) => labels[labels.length - 1];
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
						boxSizing: "border-box",
						padding: "20px 100px",
					}}>
					<Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
						<div
							style={{
								display: "flex",
							}}>
							<Form.Item
								label="教职工姓名"
								name="teacher_name"
								rules={[
									{
										required: true,
										message: "Please input your username!",
									},
								]}>
								<Input />
							</Form.Item>

							<Form.Item
								label="性别"
								name="sex"
								style={{
									marginLeft: "100px",
								}}
								rules={[
									{
										required: true,
										message: "请选择性别",
									},
								]}>
								<Select
									style={{
										width: "80px",
									}}>
									<Option value="男">男</Option>
									<Option value="女">女</Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="出生日期"
								name="age"
								style={{
									marginLeft: "100px",
								}}
								rules={[
									{
										required: true,
										message: "请选择出生日期",
									},
								]}>
								<DatePicker
									onChange={(date, dateString) => {
										const newtime = time;
										newtime[0] = dateString;
										settime(() => [...newtime]);
									}}
								/>
							</Form.Item>
							<Form.Item
								label="身份证号"
								name="card"
								style={{
									marginLeft: "100px",
								}}
								rules={[
									{
										required: true,
										message: "请填写身份证号",
									},
								]}>
								<Input
									style={{
										width: "200px",
									}}
								/>
							</Form.Item>
						</div>
						<div
							style={{
								display: "flex",
							}}>
							<Form.Item
								style={{
									marginLeft: "40px",
								}}
								label="部门"
								name="department"
								rules={[
									{
										required: true,
										message: "请选择部门",
									},
								]}>
								<Select
									style={{
										width: 200,
									}}
									onChange={handleChange}
									options={data[0]}
								/>
							</Form.Item>
							<Form.Item
								style={{
									marginLeft: "110px",
								}}
								label="科室"
								name="department_specialty">
								<Select
									style={{
										width: 200,
									}}
									onChange={handleChangedepartment_specialty}
									options={department_specialty}
								/>
							</Form.Item>
							<Form.Item
								style={{
									marginLeft: "110px",
								}}
								label="行政职务"
								name="post"
								rules={[
									{
										required: true,
										message: "请选择行政职务",
									},
								]}>
								<Select
									style={{
										width: 200,
									}}
									options={data[4]}
								/>
							</Form.Item>
						</div>
						<div
							style={{
								display: "flex",
							}}>
							<Form.Item
								style={{
									marginLeft: "15px",
								}}
								rules={[
									{
										required: true,
										message: "请选择政治面貌",
									},
								]}
								label="政治面貌"
								name="politics">
								<Select
									key={8}
									onChange={(e) => {
										if (e != 1 && politicsTf[1] != undefined) {
											message.error("新增教职工政治面貌不为党员,不能设置党内职务");
											return;
										} else {
											setpoliticsTf(() => [e]);
										}
									}}
									style={{
										width: 200,
									}}
									options={data[2]}
								/>
							</Form.Item>
							<Form.Item
								style={{
									marginLeft: "85px",
								}}
								label="政治职务"
								name="politics_post">
								<Select
									key={9}
									onChange={(e) => {
										const newpoliticsTf = politicsTf;
										newpoliticsTf[1] = e;
										if (politicsTf[0]) {
											if (politicsTf[0] != 1) {
												message.error("新增教职工政治面貌不为党员,不能设置党内职务");
												return;
											}
										} else {
											message.warning("请先选择政治面貌");
										}
										setpoliticsTf(() => [...newpoliticsTf]);
									}}
									style={{
										width: 200,
									}}
									options={data[3]}
								/>
							</Form.Item>
							<Form.Item
								style={{
									marginLeft: "105px",
									display: "flex",
								}}
								label="教职工编号"
								name="teacher_id">
								<Input value={teacher_id_rand} disabled style={{width: "200px"}} />
								<Button
									type="primary"
									onClick={() => {
										rand();
									}}>
									生成编号
								</Button>
							</Form.Item>
						</div>
						<div
							style={{
								display: "flex",
							}}>
							<Form.Item
								style={{
									marginLeft: "40px",
								}}
								label="手机号"
								name="iphone">
								<Input type="number" style={{width: "200px"}} />
							</Form.Item>
							<Form.Item
								style={{
									marginLeft: "85px",
								}}
								label="入职日期"
								rules={[
									{
										required: true,
										message: "请填写入职日期",
									},
								]}
								name="entry_time">
								<DatePicker
									onChange={(date, dateString) => {
										const newtime = time;
										newtime[1] = dateString;
										settime(() => [...newtime]);
									}}
								/>
							</Form.Item>
						</div>
						<div
							style={{
								display: "flex",
							}}>
							<Form.Item
								style={{
									marginLeft: "40px",
								}}
								rules={[
									{
										required: true,
										message: "请填写地址",
									},
								]}
								label="地址"
								name="site">
								<div
									style={{
										display: "flex",
									}}>
									<Cascader
										options={json}
										onChange={(e) => {
											const newsite = site;
											newsite[0] = e[0];
											newsite[1] = e[1];
											setsite(() => [...newsite]);
										}}
										style={{
											width: "200px",
										}}
									/>
									<Input
										style={{
											width: "700px",
										}}
										onChange={(e) => {
											const newsite = site;
											newsite[2] = e.target.value;
											setsite(() => [...newsite]);
										}}
									/>
								</div>
							</Form.Item>
						</div>
						<Form.Item
							wrapperCol={{
								offset: 8,
								span: 16,
							}}>
							<Button type="primary" htmlType="submit">
								保存信息
							</Button>
						</Form.Item>
					</Form>
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
