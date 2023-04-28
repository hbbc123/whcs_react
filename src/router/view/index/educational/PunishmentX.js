import {useState, useEffect, useRef} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone, PlusOutlined} from "@ant-design/icons";
import {Popconfirm, Spin, Button, Modal, message, Form, Input, Select, Descriptions, Tag, Upload} from "antd";
import request from "../../../axios/request";
import request_post from "../../../axios/request_post";
import {useParams, useNavigate} from "react-router-dom";
import store from "../../../redux/store";
import getInform from "../../../hooks/getInform";

const {TextArea} = Input;
const {Option} = Select;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

export default function PunishmentX({serve}) {
	const path = useNavigate();
	const [showtf, setshowTf] = useState(false);
	const {id, student_id} = useParams();
	const {tf, sttf} = useParams();
	const [student_info, setstudent_info] = useState(null);
	const [baotai, setbaotai] = useState(store.getState().getIn(["baotai"]));
	const [root, setroot] = useState(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const [student_title, setstudent_title] = useState(null);
	const [userTf, setuserTf] = useState(false);
	const [userjing, setuserjing] = useState(null);
	const submit = useRef();
	const loc = JSON.parse(localStorage.getItem("user"));

	const handleCancel_s = () => setPreviewOpen(false);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
	};
	const handleChange = ({fileList: newFileList}) => {
		console.log(newFileList);
		const newstudent_info = student_info;
		if (newstudent_info.fujian.length > newFileList.length) {
			const arr = [];
			newFileList.forEach((val) => {
				const min = val.url.split("/");
				arr.push(min[min.length - 1]);
			});
			const newarr = arr.join(",");
			request("/index/student/changeimg", {data: newarr, id: student_info.key}).then((res) => {
				console.log(res);
			});
		}
		newstudent_info.fujian = newFileList;

		setstudent_info(() => {
			return {...newstudent_info};
		});
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8,
				}}>
				Upload
			</div>
		</div>
	);

	const read = () => {
		console.log(id);
		request("/index/student/punishmentx", {id, student_id}).then((res) => {
			request("/enter/code/root").then((ress) => {
				request("/index/student/jing").then((res) => {
					console.log(res);
					setuserjing(res.data.data);
				});
				const minroot = ress.data.data[ress.data.data.length - 1];
				console.log(root);
				setroot(() => parseInt(minroot));
				const newdata = res.data.data;
				newdata.fujian = res.data.data.fujian.split(",");
				for (let index = 0; index < newdata.fujian.length; index++) {
					const url = baotai + "/file/student_w/" + newdata.fujian[index];
					newdata.fujian[index] = {
						uid: index,
						name: "image.png",
						status: "done",
						url,
					};
				}
				if (newdata.fujian.length > 1) {
					newdata.fujian.splice(newdata.fujian.length - 1, 1);
				}
				console.log(newdata.fujian);
				const loc = JSON.parse(localStorage.getItem("user"));
				if (loc.user_id) {
					if (loc.user_id == newdata.sen_id) {
						setuserTf(true);
					}
				}
				console.log(newdata);
				setstudent_info(() => {
					return {...newdata};
				});
				setstudent_title(() => [newdata.title, newdata.info]);

				setshowTf(true);
			});
		});
	};
	useEffect(() => {
		read();
		
	}, []);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		const loc = JSON.parse(localStorage.getItem("user"));
		if (!loc.user_id) {
			message.error("缺少必要信息,请重新登录");
			return;
		}
		if (student_title[0].length > 20) {
			message.error("标题应该少于二十字");
			return;
		}
		console.log(userjing);

		request("index/student/upstudentw", {
			id: student_info.key,
			title: student_title[0],
			info: student_title[1],
			aid: loc.user_id,
			root: student_title[2] ? student_title[2] : 0,
		}).then((res) => {
			setshowTf(() => false);
			read();
		});

		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setstudent_title(() => [student_info.title, student_info.info]);
		setIsModalOpen(false);
	};

	const onFinish = (e) => {
		console.log(e);
	};
	const postimg = (e) => {
		console.log(e);
		let data = new FormData();
		data.append("file", e.file);
		data.append("student", student_info.student_id);
		data.append("id", student_info.key);
		request_post("/index/student/postimg", data).then((res) => {
			e.onSuccess();
		});
	};
	const beforeUpload = (file) => {
		console.debug("file type:", file.type);
		const allowFormat = file.type === "image/jpeg" || file.type === "image/png";
		if (!allowFormat) {
			message.error("只允许 JPG/PNG 文件!", 1000);
			return;
		}
		const fileSize = file.size / 1024 / 1024 < 5;
		if (!fileSize) {
			message.error("图片应当小于5MB!", 1000);
			return;
		}
		return allowFormat && fileSize;
	};
	const confirm = () =>
		new Promise((resolve) => {
			setTimeout(() => {
				request("index/student/delstudentw", {id: student_info.key}).then((res) => {
					if (res.data.code == 200) {
						resolve(null);
						message.success("删除成功");
						path(-1);
					} else {
						message.error("发生未知错误请联系管理员");
					}
				});
			}, 1000);
		});

	const confirm_s = (tpye) => {
		if (student_title[2]) {
			for (let i = 0; i < userjing.length; i++) {
				if (userjing[i].key == student_title[2]) {
					if (root < userjing.root) {
						message.error("权限不够请请联系上级");
						return;
					}
				}
			}
		}
		const loc = JSON.parse(localStorage.getItem("user"));
		if (loc.user_id) {
			request("/index/student/changestudentw", {id: student_info.key, state: tpye, admin: loc.user_id}).then((res) => {
				if (res.data.code === 200) {
					message.success(res.data.msg);
					read();
				} else if (res.data.code == 300) {
					message.warning(res.data.msg);
				} else {
					message.error(res.data.msg);
				}
			});
		} else {
			message.error("缺少必要信息,请重新登录");
			path("/ent");
		}
	};
	const handleChanges = (e) => {
		const nesstudent_title = student_title;
		nesstudent_title[2] = e;
		setstudent_title(() => [...nesstudent_title]);
		console.log(e);
	};
	const confirm_s_tf = (type) => {
		console.log(student_info);
		request("/student/index/student_puntf", {student_id: id, type}).then((res) => {
			let str='同意'
			if(type==-1){
				str='拒绝'
			}
			const datas = {
				sen_id: '0',
				info: `你已${str}了,${student_info.send_name}提起标题为${student_info.title}的处分`,
				serve,
				accept_id:loc.user_id,
				loop:false
			};
			getInform(datas);
			const data = {
				sen_id: student_info.student_id,
				info: `已${str}了,你提起标题为${student_info.title}的处分`,
				serve,
				accept_id:student_info.sendid,
				loop:true
			};
			getInform(data);
			read();
		});
	};
	return (
		<div>
			{showtf ? (
				<div>
					{userjing ? (
						<Modal width="1000px" title="修改信息" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
							<Form
								name="basic"
								labelCol={{
									span: 4,
								}}
								wrapperCol={{
									span: 16,
								}}
								initialValues={{
									remember: true,
								}}
								onFinish={onFinish}
								autoComplete="off">
								<Form.Item label="标题">
									<Input
										placeholder="请输入标题"
										value={student_title[0]}
										onChange={(e) => {
											const newstudent_info = student_title;
											newstudent_info[0] = e.target.value;
											setstudent_title(() => [...newstudent_info]);
										}}
									/>
								</Form.Item>
								<Form.Item label="行政处分">
									<Select onChange={handleChanges} defaultValue={student_info.sciplinary_name}>
										{userjing.map((val, k) => (
											<Option key={k} value={val.key}>
												{val.vuale}
											</Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item label="内容">
									<TextArea
										rows={7}
										placeholder="请输入内容"
										value={student_title[1]}
										onChange={(e) => {
											const newstudent_info = student_title;
											newstudent_info[1] = e.target.value;
											setstudent_title(() => [...student_title]);
										}}
									/>
								</Form.Item>
								<Form.Item label="附件">
									<Upload
										customRequest={(e) => {
											postimg(e);
										}}
										beforeUpload={beforeUpload}
										// action={"/api/index/student/postimg"}
										listType="picture-card"
										fileList={student_info.fujian}
										onPreview={handlePreview}
										onChange={handleChange}>
										{student_info.fujian.length >= 8 ? null : uploadButton}
									</Upload>
								</Form.Item>
							</Form>
							<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel_s}>
								<img
									alt="example"
									style={{
										width: "100%",
									}}
									src={previewImage}
								/>
							</Modal>
						</Modal>
					) : (
						false
					)}

					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title="学生信息">
						<Descriptions.Item label="姓名">{student_info.student_name}</Descriptions.Item>
						<Descriptions.Item label="性别">{student_info.student_sex}</Descriptions.Item>
						<Descriptions.Item label="院系">{student_info.pname}</Descriptions.Item>
						<Descriptions.Item label="专业">{student_info.name}</Descriptions.Item>
						<Descriptions.Item label="班级">{student_info.num}班</Descriptions.Item>
						<Descriptions.Item label="年级">{student_info.student_class_num}</Descriptions.Item>
						<Descriptions.Item label="辅导员">{student_info.fname}</Descriptions.Item>
						<Descriptions.Item label="班主任">{student_info.bname}</Descriptions.Item>
						<Descriptions.Item label="出生日期">{student_info.student_age}</Descriptions.Item>
						<Descriptions.Item label="地址">{student_info.student_site}</Descriptions.Item>
						<Descriptions.Item label="身份证号">{student_info.student_card}</Descriptions.Item>
						<Descriptions.Item label="身份证手机号">{student_info.iphone}</Descriptions.Item>
					</Descriptions>
					<Descriptions
						title="违规详情"
						style={{
							backgroundColor: "white",
							padding: "0 20px",
						}}>
						<Descriptions.Item label="标题">{student_info.title}</Descriptions.Item>
						<Descriptions.Item label="提起人">{student_info.send_name}</Descriptions.Item>
						<Descriptions.Item label="行政处分">{student_info.sciplinary_name}</Descriptions.Item>
						<Descriptions.Item label="添加时间">{student_info.add_time}</Descriptions.Item>
						<Descriptions.Item label="被处理人是否同意">
							{tf == "true" ? (
								student_info.stundet_tf == 1 ? (
									<Tag color="success">同意</Tag>
								) : student_info.stundet_tf == 0 ? (
									<Tag color="warning">待处理</Tag>
								) : (
									<Tag color="error">驳回</Tag>
								)
							) : student_info.stundet_tf == 1 ? (
								<Tag color="success">同意</Tag>
							) : student_info.stundet_tf == 0 ? (
								<Popconfirm
									title="请仔细选择确认后无法更改"
									okText="同意"
									onCancel={() => {
										confirm_s_tf(-1);
									}}
									onConfirm={() => {
										confirm_s_tf(1);
									}}
									cancelText="反驳">
									<Button size="small" type="primary">
										待处理
									</Button>
								</Popconfirm>
							) : (
								<Tag color="error">反驳</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批人">{student_info.teacher_name}</Descriptions.Item>
						<Descriptions.Item label="审批状态">
							{student_info.admin_tf == 1 ? (
								<Tag color="success">同意</Tag>
							) : student_info.admin_tf == 0 ? (
								<Tag color="warning">待处理</Tag>
							) : (
								<Tag color="error">驳回</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批时间">{student_info.end_time}</Descriptions.Item>
						<Descriptions.Item label="修改信息">
							<Button onClick={showModal} disabled={root < 3 ? false : userTf ? false : true} size="small" type="primary">
								修改信息
							</Button>
						</Descriptions.Item>
						<Descriptions.Item label="删除违规">
							{root < 3 ? (
								<Popconfirm placement="top" title="请仔细确定是否删除" onConfirm={confirm} okText="确定" cancelText="取消">
									<Button
										onClick={() => {
											// request("/index/student/sys", {id:student_info.key}).then((res) => {
											// 	console.log(res);
											// });
										}}
										disabled={root > 3}
										danger
										size="small"
										type="primary">
										删除违规
									</Button>
								</Popconfirm>
							) : (
								<Button
									onClick={() => {
										// request("/index/student/sys", {id:student_info.key}).then((res) => {
										// 	console.log(res);
										// });
									}}
									disabled={root > 3}
									danger
									size="small"
									type="primary">
									删除违规
								</Button>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="审批">
							{root < 3 ? (
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
									<Button disabled={root > 3} size="small" type="primary">
										{student_info.admin_tf == 1 ? "已审批" : student_info.admin_tf == 0 ? "待审批" : "驳回"}
									</Button>
								</Popconfirm>
							) : (
								<Button disabled={root > 3} size="small" type="primary">
									{student_info.admin_tf == 1 ? "已审批" : student_info.admin_tf == 0 ? "待审批" : "驳回"}
								</Button>
							)}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "0 20px",
						}}
						title="违规内容">
						<Descriptions.Item label="内容">{student_info.info}</Descriptions.Item>
					</Descriptions>
					{student_info.fujian.length > 0 ? (
						<div
							style={{
								backgroundColor: "white",
							}}>
							<Descriptions
								style={{
									backgroundColor: "white",
									padding: "0 20px",
									marginBottom: "10px",
								}}
								title="附件"></Descriptions>
							{student_info.fujian.map((val, k) => (
								<div key={k}>
									<img
										style={{
											display: "block",
											margin: "0 auto",
											minWidth: "492px",
											height: "689px",
										}}
										src={val.url}
									/>
								</div>
							))}
						</div>
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
