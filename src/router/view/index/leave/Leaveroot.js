import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EyeOutlined,EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Tag,Form, Input, Select, notification,Popconfirm} from "antd";
import request from "../../../axios/request";
import {useNavigate} from "react-router-dom";
import getInform from "../../../hooks/getInform";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Leaveroot({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [crecord, setcrecord] = useState(null);
	const path = useNavigate();

	const read=()=>{
		if (loc.user_id) {
			request("/index/index/leaverootindex", {id: loc.user_id}).then((res) => {
				console.log(res);
				setdataSource(() => [...res.data.data]);
				setshowTf(() => true);
			});
		}
	}
	useEffect(() => {
		read()
	}, []);
	const confirm=(type)=>{
		console.log(crecord);
		request('/index/index/root_reave',{id:crecord.key,type}).then(res=>{
			if(res.data.code==200){
				let str='同意'
				if(type==-1){
					str='驳回'
				}
				const data = {
					sen_id: '0',
					info: `你${str}了  ${crecord.student_name}标题为${crecord.leave_accessory}的请销假申请`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);

				const datas = {
					sen_id: loc.user_id,
					info: `${str}了 你标题为${crecord.leave_accessory}的请销假申请`,
					serve,
					accept_id:crecord.student_id_id,
					loop:true
				};
				getInform(datas);


				message.success(res.data.msg)
				read()
			}
		})
	}
	const columns = [
		{
			title: "姓名",
			dataIndex: "student_name",
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
			title: "年级",
			dataIndex: "student_class_num",
		},
		{
			title: "班级",
			dataIndex: "num",
		},
		{
			title: "类型",
			render:(e)=>e.leave_class==0?'请假':'销假'
		},
		{
			title: "开始时间",
			dataIndex: "leave_start",
		},
		{
			title: "结束时间",
			dataIndex: "leave_end",
		},
		{
			title: "申请状态",
			render: (e) =>
				e.state == 0 ? <Tag color="processing">待审批</Tag> : e.state == 1 ? <Tag color="success">同意</Tag> : <Tag color="error">驳回</Tag>,
		},
		{
			title: "查看详情",
			render: () => (
				<Button
					onClick={(e) => {
						path(`/home/Leavelook/${crecord.key}`);
					}}
					type="primary"
					icon={<EyeOutlined />}
					shape="circle"
					size="large"></Button>
			),
		},
		{
			title: "审批",
			render: () => (
				<Popconfirm placement="top" title={'请仔细确认'} onConfirm={()=>{confirm(1)}} onCancel={()=>{confirm(-1)}} okText="同意" cancelText="驳回">
					<Button onClick={(e) => {}} type="primary"  icon={<EditOutlined />} shape="circle" size="large"></Button>
				</Popconfirm>
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
