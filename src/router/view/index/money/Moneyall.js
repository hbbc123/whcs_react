import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Tag, Popconfirm, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
import getNd from "../../../hooks/getNd";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Moneyall() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [crecord, setcrecord] = useState(null);
	const [root, setroot] = useState(null);
	const [department, setdepartment] = useState(null);
	const path = useNavigate();

	const read = () => {
		if (loc.user_id) {
			request("/index/index/Moneyall", {nd: getNd()}).then((res) => {
				request("/index/index/getdepartment", {id: loc.user_id}).then((ress) => {
					console.log(ress);
					setdepartment(() => ress.data.data[0].department_id);
					setroot(() => ress.data.data[0].root);
					setdataSource(() => [...res.data.data]);
					setshowTf(() => true);
				});
			});
		}
	};

	useEffect(() => {
		read();
	}, []);
	const confirm = (type) => {
		request("/index/index/moneytf", {id: crecord.key, type,teacher_id:loc.user_id,department:department,nd:getNd()}).then((res) => {
			if (res.data.code == 200) {
				message.success('审批成功')
				read();
			}
		});
	};

	const columns = [
		{
			title: "部门",
			dataIndex: "name",
		},
		{
			title: "总经费",
			dataIndex: "zong",
		},
		{
			title: "结余",
			dataIndex: "jie",
		},
		{
			title: "申请人",
			dataIndex: "applicant_name",
		},
		{
			title: "申请时间",
			dataIndex: "admin_time",
		},
		{
			title: "申请金额",
			dataIndex: "add_money",
		},
		{
			title: "标题",
			dataIndex: "moeny_accessory",
		},
		{
			title: "处理状态",
			dataIndex: "moeny_state",
			render: (moeny_state) => {
				return moeny_state == 1 ? (
					<Tag color="success">同意</Tag>
				) : moeny_state == 0 ? (
					<Tag color="warning">待处理</Tag>
				) : (
					<Tag color="error">反驳</Tag>
				);
			},
		},
		{
			title: "处理人",
			dataIndex: "applicant_name",
		},
		{
			title: "处理时间",
			dataIndex: "admin_time",
		},
		{
			title: "查看详情",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/Moneywrite/${crecord.key}`);
					}}
					type="primary"
					icon={<EyeOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
		{
			title: "修改状态",
			render: (e) =>
				department == e.department_id && root <= e.department_root_big ? (
					<Popconfirm
						placement="top"
						title={"请仔细确认"}
						onConfirm={() => {
							confirm(1);
						}}
						onCancel={() => {
							confirm(-1);
						}}
						okText="同意"
						cancelText="驳回">
						<Button onClick={(e) => {}} type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
					</Popconfirm>
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
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
