import {useState, useEffect, useRef} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Popconfirm, Spin, Button, Modal, message, Form, Input, Select, PlusOutlined, Descriptions, notification, Tag} from "antd";
import request from "../../../axios/request";
import getInform from "../../../hooks/getInform";
import {useParams, useNavigate} from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function PunishmentX({serve}) {
	const [showtf, setshowTf] = useState(false);
	const {id, student_id} = useParams();
	const {tf, settf} = useParams();
	const [datainfo, setdatainfo] = useState(null);
	const [root, setroot] = useState(null);
	const [politics, setpolitics] = useState();
	const [userTf, setuserTf] = useState(false);
	const [select_class, setselect_class] = useState();
	const path = useNavigate();
	const loc = JSON.parse(localStorage.getItem("user"));
	const refzhan = useRef(null);
	const read = () => {
		request("/teacher/index/teacher_clenX", {id: parseInt(id)}).then((res) => {
			request("/enter/code/root").then((rs) => {
				if (res.data.data.length > 0) {
					setdatainfo(() => res.data.data[0]);
				}
				const minroot = rs.data.data[rs.data.data.length - 1];
				console.log(minroot);
				const loc = JSON.parse(localStorage.getItem("user"));
				if (loc.user_id) {
					request("teacher/index/teacher_politics", {id: loc.user_id}).then((res) => {
						console.log(res);
						if (res.data.code == 200) {
							setpolitics(() => res.data.data);
						} else {
							message.error("信息不全发生故障,请联系后台管理员");
							path("/ent");
						}
					});
					if (loc.user_id == res.data.data[0].sen_id) {
						setuserTf(true);
					}
				}
				setselect_class(() => [res.data.x, res.data.d]);
				setshowTf(() => true);
				setroot(() => parseInt(minroot));
			});
		});
	};
	useEffect(() => {
		read();
	}, []);
	const showModal = () => {
		if (loc.user_id) {
			if (loc.user_id == datainfo.send_id) {
				path(`/home/tong_PunishmentX_up/${datainfo.id}`);
			} else {
				message.error("请联系发起者进行更改");
			}
		} else {
			message.error("请重新登陆");
		}
	};
	const confirm = () =>
		new Promise((resolve) => {
			setTimeout(() => {
				request("teacher/index/teacher_wdel", {id: datainfo.id}).then((res) => {
					if (res.data.code == 200) {
						resolve(null);
						message.success("删除成功");
						path(-1);
					} else {
						message.error("发生未知错误请联系管理员");
					}
				});
			}, 500);
		});

	const confirm_s = (tpye) => {
		console.log(datainfo);
		if (datainfo.teacher_tf == 0) {
			message.warning("请等待被处理人同意");
			return;
		} else if (datainfo.teacher_tf == -1) {
			message.error("被处理人不同意该处分,请联系被处理人");
			return;
		}
		const oo = [parseInt(datainfo.clan_root[0]), parseInt(datainfo.clan_root[1])];
		if (root > oo[0]) {
			message.error("您的行政职务不符合审批人要求,请跟换审批人");
			return;
		} else if (politics == 0 || politics > oo[1]) {
			message.error("您的党内职务不符合审批人要求,请跟换审批人");
			return;
		} else {
			console.log(datainfo);
			request("/teacher/index/teacher_wshen", {id: datainfo.id, admin_id: loc.user_id, admin_tf: tpye}).then((res) => {
				let str='驳回'
				if(tpye==1){
					str='同意'
				}
				const data = {
					sen_id: '0',
					info: `你${str}了 ${datainfo.send_name}对${datainfo.beiname}发起的 标题为${datainfo.title}的处分`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);

				const datas = {
					sen_id: loc.user_id,
					info: `${str}了 你对${datainfo.beiname}发起的 标题为${datainfo.title}的处分`,
					serve,
					accept_id:datainfo.send_idid,
					loop:true
				};
				getInform(datas);

				const datass = {
					sen_id: loc.user_id,
					info: `${str}了 ${datainfo.beiname}对你发起的 标题为${datainfo.title}的处分`,
					serve,
					accept_id:datainfo.teacher_id,
					loop:true
				};
				getInform(datass);
				read();
			});
		}
	};
	const teacher_tf = (type) => {
		console.log(datainfo);
		request('/teacher/index/teacher_punishment_tf',{id,type}).then(res=>{
			if(res.data.code==200){
				let str='反驳'
				if(type=='T'){
					str='同意'
				}
				const data = {
					sen_id: '0',
					info: `你${str}了 ${datainfo.send_name}发起的标题为${datainfo.title}的处分`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);

				const datas = {
					sen_id: loc.user_id,
					info: `${str}了 你发起的标题为${datainfo.title}的处分`,
					serve,
					accept_id:datainfo.send_idid,
					loop:true
				};
				getInform(datas);
				read();
			}
		})
	  };
	return (
		<div>
			{showtf ? (
				<div>
					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title="被处理人信息">
						<Descriptions.Item label="姓名">{datainfo.beiname}</Descriptions.Item>
						<Descriptions.Item label="性别">{datainfo.sex}</Descriptions.Item>
						<Descriptions.Item label="部门">{datainfo.pname}</Descriptions.Item>
						<Descriptions.Item label="行政职务">{datainfo.post_name}</Descriptions.Item>
						<Descriptions.Item label="政治面貌">{datainfo.politics_name}</Descriptions.Item>
						<Descriptions.Item label="政治职务">{datainfo.politics_post_name}</Descriptions.Item>
						<Descriptions.Item label="入职时间">{datainfo.beid.slice(0, 4)}年</Descriptions.Item>
						<Descriptions.Item label="出生日期">{datainfo.age}</Descriptions.Item>
						<Descriptions.Item label="地址">{datainfo.site}</Descriptions.Item>
						<Descriptions.Item label="身份证号">{datainfo.card}</Descriptions.Item>
						<Descriptions.Item label="手机号">{datainfo.iphone}</Descriptions.Item>
					</Descriptions>
					<Descriptions
						title="处分详情"
						style={{
							backgroundColor: "white",
							padding: "0 20px",
						}}>
						<Descriptions.Item label="标题">{datainfo.title}</Descriptions.Item>
						<Descriptions.Item label="提起人">{datainfo.send_name}</Descriptions.Item>
						<Descriptions.Item label="行政处分">{datainfo.sciplinary_name}</Descriptions.Item>
						<Descriptions.Item label="党纪处分">{datainfo.clan_name}</Descriptions.Item>
						<Descriptions.Item label="添加时间">{datainfo.add_time}</Descriptions.Item>
						<Descriptions.Item label="被处理人是否同意">
							{datainfo.teacher_tf == 1 ? (
								<Tag color="success">同意</Tag>
							) : datainfo.teacher_tf == 0 ? (
								tf == "false" ? (
									<Popconfirm
										title="请仔细选择确认后不可更改"
										onConfirm={()=>{teacher_tf('T')}}
										onCancel={()=>{teacher_tf('F')}}
										okText="同意"
										cancelText="反驳">
										<Button size="small" type="primary">
											待处理
										</Button>
									</Popconfirm>
								) : (
									<Tag color="success">待处理</Tag>
								)
							) : (
								<Tag color="error">驳回</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批人">{datainfo.admin_name}</Descriptions.Item>
						<Descriptions.Item label="审批状态">
							{datainfo.admin_tf == 1 ? (
								<Tag color="success">同意</Tag>
							) : datainfo.admin_tf == 0 ? (
								<Tag color="warning">待处理</Tag>
							) : (
								<Tag color="error">驳回</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批时间">{datainfo.end_time}</Descriptions.Item>
						<Descriptions.Item label="修改信息">
							<Button
								onClick={showModal}
								disabled={tf == "true" ? (root < 3 ? false : userTf ? false : true) : true}
								size="small"
								type="primary">
								修改信息
							</Button>
						</Descriptions.Item>
						<Descriptions.Item label="删除违规">
							{root == 0 && tf == "true" ? (
								<Popconfirm placement="top" title="请仔细确定是否删除" onConfirm={confirm} okText="确定" cancelText="取消">
									<Button
										onClick={() => {
											// request("/index/student/sys", {id:datainfo.key}).then((res) => {
											// 	console.log(res);
											// });
										}}
										disabled={tf == "true" ? root != 0 : true}
										danger
										size="small"
										type="primary">
										删除违规
									</Button>
								</Popconfirm>
							) : (
								<Button
									onClick={() => {
										// request("/index/student/sys", {id:datainfo.key}).then((res) => {
										// 	console.log(res);
										// });
									}}
									disabled={tf == "true" ? root != 0 : true}
									danger
									size="small"
									type="primary">
									删除违规
								</Button>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批">
							{root < 3 && tf == "true" ? (
								<Popconfirm
									title="进行审批"
									okText="同意"
									onCancel={() => {
										confirm_s(-1);
									}}
									onConfirm={() => {
										confirm_s(1);
									}}
									cancelText="驳回">
									<Button disabled={tf == "true" ? (root < 3 ? false : true) : true} size="small" type="primary">
										{datainfo.admin_tf == 1 ? "已审批" : datainfo.admin_tf == 0 ? "待审批" : "驳回"}
									</Button>
								</Popconfirm>
							) : (
								<Button disabled={tf == "true" ? (root < 3 ? false : true) : true} size="small" type="primary">
									{datainfo.admin_tf == 1 ? "已审批" : datainfo.admin_tf == 0 ? "待审批" : "驳回"}
								</Button>
							)}
						</Descriptions.Item>
					</Descriptions>
					<div
						dangerouslySetInnerHTML={{__html: datainfo.info}}
						className="Wenxian"
						style={{backgroundColor: "white", padding: "20px 100px"}}></div>
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
