import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification, Card} from "antd";
import request from "../../../axios/request";
import store from "../../../redux/store";
import getInform from "../../../hooks/getInform";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Tong({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [clenData, setclenData] = useState();
	const [selectData, setselectData] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [crecord, setcrecord] = useState();
	const [department, setdepartment] = useState();
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const loc = JSON.parse(localStorage.getItem("user"));
	const [info, setinfo] = useState();
	const showModal = () => {
		request("/teacher/index/clen_politics_info", {id: crecord.key}).then((res) => {
			console.log(res);
			setinfo(() => {
				return {...res.data.data};
			});
			setIsModalOpen(true);
		});
		console.log(crecord);
	};
	const handleOk = () => {
		read();
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		read();
		setIsModalOpen(false);
	};
	const read = () => {
		request("/teacher/index/clen_politics").then((res) => {
			console.log(res);
			setclenData(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setselectData(() => [res.data.politics, res.data.politics_post]);
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
			title: "姓名",
			dataIndex: "name",
		},
		{
			title: "类别",
			dataIndex: "class",
			filters: [
				{
					text: "教职工",
					value: "教职工",
				},
				{
					text: "学生",
					value: "学生",
				},
			],
			filterMode: "tree",
			filterSearch: true,
			onFilter: (value, record) => record.class.indexOf(value) === 0,
		},
		{
			title: "部门",
			dataIndex: "department_name",
			filters: department,
			onFilter: (value, record) => record.department_name.indexOf(value) === 0,
		},
		{
			title: "政治面貌",
			dataIndex: "politics_name",
		},
		{
			title: "党内职务",
			dataIndex: "politics_post_name",
		},
		{
			title: "编辑",
			dataIndex: "end_time",
			render: () =>
				useroot.zzmm_teacher == 0 ? (
					<Button
						onClick={(e) => {
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
	const handleChange = (e, type) => {
		let lei = 1;
		if (crecord.key.length == 9) {
			lei = 0;
		}
		request("/teacher/index/clen_updata", {id: e, type, lei, user_id: crecord.key}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				message.success(res.data.msg);
				let info = "";
				if (type == 0) {
					let zz=selectData[0].find((val) => val.key == e).label
					info = `你已修改${crecord.class}:${crecord.name}的政治面貌为${zz}`;
				} else {
					let zz=selectData[1].find((val) => val.key == e).label
					info = `你已修改${crecord.class}:${crecord.name}的政治职务为${zz}`;
				}
				const data = {
					sen_id: "0",
					serve,
					accept_id: loc.user_id,
					loop: false,
				};
				data.info = info;
				getInform(data);
				if (type == 0) {
					let zz=selectData[0].find((val) => val.key == e).label
					info = `已修改你的政治面貌为${zz}`;
				} else {
					let zz=selectData[1].find((val) => val.key == e).label
					info = `已修改你的政治职务为${zz}`;
				}
				const datas = {
					sen_id: loc.user_id,
					serve,
					accept_id: crecord.key,
					loop: true,
				};
				datas.info = info;
				console.log(datas);
				getInform(datas);
			}
		});
	};

	return (
		<div>
			{showtf ? (
				<div style={{backgroundColor: "#ffffff"}}>
					{isModalOpen ? (
						<Modal title={`${crecord.name} ${crecord.class}`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
							<Card
								title={false}
								bordered={false}
								style={{
									marginTop: "-20px",
									width: "100%",
								}}>
								{info.student_site ? <p>{`${crecord.key.slice(0, 4)}级`}</p> : false}
								<p>
									部门:{info.name} &emsp; 科室:{info.son_name}
								</p>
								<p>
									性别:{info.sex ? info.sex : info.student_sex}&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;手机号:
									{info.iphone ? info.iphone : info.student_iphone}&emsp;&emsp;出生日期:{info.age ? info.age : info.student_age}
								</p>
								<p>地址:{info.site ? info.site : info.student_site}</p>
							</Card>
							<Form
								initialValues={{
									remember: true,
								}}
								autoComplete="off">
								<Form.Item label="政治面貌" name="miao">
									<Select
										defaultValue={crecord.politics_name}
										style={{
											width: 400,
											display: "block",
											margin: "0 auto",
										}}
										onChange={(e) => {
											handleChange(e, 0);
										}}
										options={selectData[0]}
									/>
								</Form.Item>
								{crecord.key.length <= 9 ? (
									<Form.Item label="党内职务" name="zhi">
										<Select
											defaultValue={crecord.politics_post_name}
											style={{
												width: 400,
												display: "block",
												margin: "0 auto",
											}}
											onChange={(e) => {
												handleChange(e, 1);
											}}
											options={selectData[1]}
										/>
									</Form.Item>
								) : (
									false
								)}
							</Form>
						</Modal>
					) : (
						false
					)}

					<Table
						rowKey={"key"}
						dataSource={clenData}
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
