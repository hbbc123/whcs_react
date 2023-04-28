import {useState, useEffect} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Cascader} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";
import getNd from "../../../hooks/getNd";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Selectclass() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const [selectclass, setselectclass] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [teacher, setteacher] = useState([]);
	const [crecord, setcrecord] = useState(false);
	const [upmool, setupmool] = useState(false);
	const submit_ref = useRef(null);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
		setupmool(() => false);
	};
	const handleCancel = () => {
		setupmool(() => false);
		setIsModalOpen(false);
	};
	const read = () => {
		request("/teacher/index/selectclass", {nd: getNd()}).then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setselectclass(() => [...res.data.select]);
			setteacher(() => [...res.data.teacher]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const columns = [
		{
			title: "课程名",
			dataIndex: "name",
		},
		{
			title: "讲师",
			dataIndex: "teacher_name",
		},
		{
			title: "星期",
			dataIndex: "week",
		},
		{
			title: "节次",
			dataIndex: "section",
		},
		{
			title: "开始周",
			dataIndex: "sen_time",
		},
		{
			title: "结束周",
			dataIndex: "end_time",
		},
		{
			title: "地点",
			dataIndex: "place",
		},
		{
			title: "编辑课程",
			render: () =>
				useroot.seelct_class_change == 0 ? (
					<Button
						onClick={(e) => {
							setupmool(() => true);
							showModal();
						}}
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
				),
		},
	];
	const onFinish = (e) => {
		const obj = {
			end_time: parseInt(e.end_time),
			sen_time: parseInt(e.sen_time),
			place: e.place,
		};
		obj.select_class_id = selectclass.find((val, k) => val.label == e.name).key;
		if (typeof e.section == "string") {
			obj.section = parseInt(e.section.slice(0, 1));
		} else {
			obj.section = e.section;
		}
		if (typeof e.teacher_name == "string") {
			obj.teacher_id = crecord.teacher_id;
		} else {
			obj.teacher_id = e.teacher_name[1];
		}
		obj.week = parseInt(e.week);
		console.log(obj);
		setshowTf(() => false);
		setIsModalOpen(false);
		request("teacher/index/upselectclass", {...obj, id: crecord.key, nd: getNd(), type: upmool}).then((res) => {
			console.log(res);
			if (res.data.code == 300) {
				message.warning(res.data.msg);
			} else {
				message.success(res.data.msg);
			}
			read();
		});
	};
	return (
		<div>
			{isModalOpen ? (
				<Modal title="编辑选修课" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						initialValues={
							upmool
								? {
										...crecord,
								  }
								: false
						}
						name="basic"
						labelCol={{
							span: 6,
						}}
						wrapperCol={{
							span: 16,
						}}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="课程名"
							name="name"
							rules={[
								{
									required: true,
									message: "课程不能为空",
								},
							]}>
							<Select options={selectclass} />
						</Form.Item>

						<Form.Item
							label="讲师"
							name="teacher_name"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}>
							<Cascader options={teacher} />
						</Form.Item>
						<Form.Item
							label="星期"
							name="week"
							rules={[
								{
									required: true,
									message: "星期不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							label="节次"
							name="section"
							rules={[
								{
									required: true,
									message: "节次不能为空",
								},
							]}>
							<Select
								options={[
									{
										value: 1,
										label: "1-2节次",
									},
									{
										value: 2,
										label: "3-4节次",
									},
									{
										value: 3,
										label: "5-6节次",
									},
									{
										value: 4,
										label: "7-8节次",
									},
								]}
							/>
						</Form.Item>
						<Form.Item
							label="开始周"
							name="sen_time"
							rules={[
								{
									required: true,
									message: "开始周不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							label="结束周"
							name="end_time"
							rules={[
								{
									required: true,
									message: "结束周不能为空",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							label="上课地点"
							name="place"
							rules={[
								{
									required: true,
									message: "上课地点不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button ref={submit_ref} type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}
			{showtf ? (
				<div
					className={css.por}
					style={{
						backgroundColor: "white",
					}}>
					<Table
						dataSource={dataSource}
						columns={columns}
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									console.log(record);
									setcrecord(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
					/>
					{useroot.teacher_select_class == 0 ? (
						<Button
							className={css.poa}
							onClick={() => {
								showModal();
							}}
							type="primary">
							新增选修课程
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							新增选修课程
						</Button>
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
