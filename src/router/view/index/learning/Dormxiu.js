import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification,Popconfirm, Tag} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Dormxiu() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();
	const read=()=>{
		request("/student/index/dorm_look_all").then((res) => {
			console.log(res);
			setdataSource(() => [...res.data.data]);
			setshowTf(() => true);
		});
	}
	useEffect(() => {
		read()
	}, []);
	const confirm=(type)=>{
		const loc=JSON.parse(localStorage.getItem('user'))
		if(loc.user_id){
			request('/student/index/up_dorm_x',{id:crecord.id,type,teacher_id:loc.user_id}).then(res=>{
				if(res.data.code==200){
					read()
					message.success('修改成功');
				}
			})
		}
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
			title: "处理人",
			dataIndex: "teacher_name",
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
			title: "修改状态",
			render: () => (
				<Popconfirm placement="top" title={'请仔细确认'} onConfirm={()=>{confirm(1)}} onCancel={()=>{confirm(-1)}} okText="已处理" cancelText="报上级">
					<Button onClick={(e) => {}} type="primary"  icon={<EditOutlined />} shape="circle" size="large"></Button>
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
