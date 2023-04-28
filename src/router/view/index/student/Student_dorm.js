import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification,Popconfirm, Tag} from "antd";
import request from "../../../axios/request";
import getInform from "../../../hooks/getInform";
import {useNavigate} from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Student_dorm({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();
	const read=()=>{
		request("/student/index/dorm_look", {student_id: loc.user_id}).then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setshowTf(() => true);
		});
	}
	useEffect(() => {
		read()
	}, []);
	const confirm=()=>{
		console.log(crecord);
		request('/student/index/del_dorm_x',{id:crecord.id}).then(res=>{
			console.log(res);
			if(res.data.code==200){
				const data = {
					sen_id: '0',
					info: `你已删除了,标题为${crecord.title}的宿舍报修申请`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);
				read()
				message.success('删除成功');

			}
		})
	}
	const columns = [
		{
			title: "发起人",
			dataIndex: "student_name",
		},
		{
			title: "楼栋",
			dataIndex: "dorop_num",
		},
		{
			title: "宿舍号",
			dataIndex: "accessory",
		},
		{
			title: "标题",
			dataIndex: "title",
		},
		{
			title: "添加时间",
			dataIndex: "sen_time",
		},
		{
			title: "是否已处理",
			render: (data) => {
				return data.state == 1 ? (
					<Tag color="success">已处理</Tag>
				) : data.state == 0 ? (
					<Tag color="warning">待处理</Tag>
				) : (
					<Tag color="error">报上级</Tag>
				);
			},
		},
		{
			title: "处理时间",
			dataIndex: "end_time",
		},
		{
			title: "查看详情",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/Dormwrite/${crecord.id}/false`);
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
				<Popconfirm placement="top" title={'确定要删除吗?'} onConfirm={confirm} okText="是" cancelText="否">
					<Button onClick={(e) => {}} type="primary" danger icon={<DeleteOutlined />} shape="circle" size="large"></Button>
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
					<Button
						className={css.poa}
						onClick={() => {
							path("/home/Student_dormadd");
						}}
						type="primary">
						新增报修
					</Button>
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
