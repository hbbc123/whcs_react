import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, Empty} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Class() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const [mpty, setmpty] = useState(false);
	const [crecord, setcrecord] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [post, setpost] = useState();
	const Select_ref = useRef(null);
	const showModal = () => {
		console.log(crecord);
		console.log(dataSource);
		setIsModalOpen(true);
	};
	const handleOk = () => {
		rand();
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const loc = JSON.parse(localStorage.getItem("user"));

	const rand = () => {
		if (loc.user_id) {
			request("/teacher/index/class_look", {user_id: loc.user_id}).then((res) => {
				console.log(res);
				if (res.data.data) {
					setdataSource(() => [...res.data.data]);
					const newpost = res.data.post;
					newpost.push({value: "无", label: "无", key: -1});
					setpost(() => [...newpost]);
				} else {
					console.log(454);
					setmpty(() => true);
				}
				setshowTf(() => true);
			});
		}
	};
	useEffect(() => {
		rand();
	}, []);

	const columns = [
		{
			title: "年级",
			dataIndex: "student_class_num",
		},
		{
			title: "院系",
			dataIndex: "pname",
		},
		{
			title: "专业",
			dataIndex: "sname",
		},
		{
			title: "班级",
			dataIndex: "class_num",
		},
		{
			title: "班长",
			dataIndex: "banname",
		},
		{
			title: "副班长",
			dataIndex: "fubanname",
		},
		{
			title: "团支书",
			dataIndex: "tuanname",
		},
	];

	const columns_s = [
		{
			title: "学号",
			dataIndex: "stid",
		},
		{
			title: "姓名",
			dataIndex: "stname",
		},
		{
			title: "职务",
			dataIndex: "student_post_name",
		},
		{
			title: "编辑班内职务",
			render: () => (
				<Button
					onClick={(e) => {
						showModal();
					}}
					type="primary"
					icon={<EditOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
	];
	const onFinish = (e) => {
		console.log(e);
	};
	const handleChange = (e) => {
		console.log(crecord);
		let i = true;
		let type = 1;
		if (e == "无") {
			type = 0;
		}
		dataSource.forEach((val) => {
			if (val.id == crecord.class_grade_id) {
				val.sondata.forEach((son) => {
					if (crecord.student_id != son.student_id && e == son.student_post_name) {
						message.warning("该班级已有" + e + "请重新选择");
						i = false;
					}
				});
			}
		});
		let cao = null;
		post.forEach((val) => {
			if (val.value == e) {
				cao = val.key;
			}
		});
		if (i) {
			request("/teacher/index/class_post", {student_id: crecord.stid, type, class_id: crecord.class_grade_id, cao}).then((res) => {
				if (res.data.code == 200) {
					message.success(res.data.msg);
				}
			});
		}
	};
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					{mpty ? (
						<div style={{
							paddingTop:'300px'
						}}>
							<Empty />
						</div>
					) : (
						<Table
							expandable={{
								expandedRowRender: (record) => {
									return (
										<Table
											onRow={(record) => {
												return {
													onMouseEnter: (event) => {
														setcrecord(() => {
															return {...record};
														});
													}, // 鼠标移入行
												};
											}}
											style={{
												backgroundColor: "#fbfbfb ",
											}}
											dataSource={record.sondata}
											columns={columns_s}
										/>
									);
								},
							}}
							dataSource={dataSource}
							columns={columns}
						/>
					)}

					{isModalOpen ? (
						<Modal
							title={
								crecord.student_class_num +
								"级" +
								" " +
								crecord.pname +
								" " +
								crecord.sname +
								" " +
								crecord.class_num +
								" " +
								crecord.stname
							}
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}>
							<Form
								name="basic"
								labelCol={{
									span: 6,
								}}
								wrapperCol={{
									span: 15,
								}}
								initialValues={crecord}
								onFinish={onFinish}
								autoComplete="off">
								<Form.Item label="职务" name="student_post_name">
									<Select ref={Select_ref} onChange={handleChange} options={post} />
								</Form.Item>
							</Form>
						</Modal>
					) : (
						false
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
