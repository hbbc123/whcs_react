import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Tag, Form, Input, Popconfirm, notification} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
import store from "../../../redux/store";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Moneyapply() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));

	const read = () => {
		if (loc.user_id) {
			request("/index/index/Moneyapply", {teacher_id: loc.user_id}).then((res) => {
				console.log(res);
				setdataSource(() => [...res.data.data]);
				setshowTf(() => true);
			});
		}
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const confirm_del = () => {
		request("/index/index/del_moeny", {id: crecord.id}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				read();
			}
		});
	};

	const columns = [
		{
			title: "申请人",
			dataIndex: "applicant_name",
		},
		{
			title: "申请时间",
			dataIndex: "apply_time",
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
			title: "删除",
			render: () => (
				<Popconfirm placement="top" title="确定要删除吗?" onConfirm={confirm_del} okText="Yes" cancelText="No">
					<Button danger type="primary" icon={<DeleteOutlined />} shape="circle" size="large"></Button>
				</Popconfirm>
			),
		},
	];

	return (
		<div>
			{showtf ? (
				<div
					className={css.por}
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
					{useroot.department_expenditure == 0 ? (
						<Button
							className={css.poa}
							onClick={() => {
								path("/home/Moneyadd");
							}}
							type="primary">
							新建申请
						</Button>
					) : (
						<Button className={css.poa} disabled type="primary">
							新建申请
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
