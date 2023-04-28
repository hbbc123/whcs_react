import {useState, useEffect} from "react";
import css from "./css/Distribution.module.css";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, message, Steps, Spin, Input, Form, Select, Upload, Modal,notification} from "antd";
import request from "../../../axios/request";
import request_post from "../../../axios/request_post";
import { useNavigate } from "react-router-dom";
const {Option} = Select;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
const {TextArea} = Input;
function One({fnsetdata, data, tf}) {
	const [current, setCurrent] = useState(0);
	const [department, setdepartment] = useState([]);
	const [specialty_x, setspecialty_x] = useState(0);
	const [classnum, setclassnum] = useState([]);
	const [classnum_data, setclassnum_data] = useState([]);
	const [classnum_data_x, setclassnum_data_x] = useState([]);
	const onFinish = (e) => {};
	const handleChange = (key, e) => {
		const newdata = data;
		newdata[key] = e;
		if (key == 1) {
			const arr = [];
			department[1].forEach((val) => {
				if (val.pid == e) {
					arr.push(val);
				}
			});
			setspecialty_x(() => [...arr]);
		} else if (key == 2) {
			request("/index/student/wclass", {sid: data[2], nj: parseInt(data[0])}).then((res) => {
				console.log(res);
				setclassnum(() => [...res.data.data]);
				setclassnum_data(() => [...res.data.names]);
			});
		} else if (key == 3) {
			classnum_data.forEach((val) => {
				if (val.id == e) {
					setclassnum_data_x(() => [...val.data]);
				}
			});
		}
		fnsetdata(newdata);
	};
	useEffect(() => {
		request("/index/student/chadataw").then((res) => {
			console.log(res);
			setdepartment(() => [res.data.data, res.data.sid]);
		});
	}, []);
	const steps = [
		{
			title: "选择年级",
			content: (
				<Select
					key={0}
					style={{
						width: "200px",
					}}
					defaultValue={data[0]}
					onChange={(e) => {
						handleChange(0, e);
					}}
					options={[
						{
							value: "2020",
							label: "2020级",
						},
						{
							value: "2021",
							label: "2021级",
						},
						{
							value: "2022",
							label: "2022级",
						},
					]}
				/>
			),
		},
		{
			title: "选择学院",
			content: (
				<Select
					key={1}
					style={{
						width: "200px",
					}}
					defaultValue={data[1]}
					onChange={(e) => {
						handleChange(1, e);
					}}
					options={department[0]}
				/>
			),
		},
		{
			title: "选择专业",
			content: (
				<Select
					key={2}
					style={{
						width: "200px",
					}}
					defaultValue={data[2]}
					onChange={(e) => {
						handleChange(2, e);
					}}
					options={specialty_x}
				/>
			),
		},
		{
			title: "选择班级",
			content: (
				<Select
					key={3}
					style={{
						width: "200px",
					}}
					defaultValue={data[3]}
					onChange={(e) => {
						handleChange(3, e);
					}}
					options={classnum}
				/>
			),
		},
		{
			title: "选择学生",
			content: (
				<Select
					key={4}
					style={{
						width: "200px",
					}}
					defaultValue={data[4]}
					onChange={(e) => {
						handleChange(4, e);
					}}
					options={classnum_data_x}
				/>
			),
		},
	];
	const next = () => {
		console.log(data);
		if (!data[current]) {
			message.error("请选择");
			return;
		}
		setCurrent(current + 1);
	};
	const prev = () => {
		console.log(data);
		setCurrent(current - 1);
	};
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));
	return (
		<div
			style={{
				width: "800px",
				margin: "20px auto",
			}}>
			<div
				style={{
					display: "flex",
				}}>
				<Steps
					style={{
						width: "250px",
						height: "450px",
					}}
					direction="vertical"
					current={current}
					items={items}
				/>
				<div style={{width: "600px"}} className="steps-content">
					{steps[current].content}
					<div
						style={{
							marginTop: "40px",
						}}
						className="steps-action">
						{current > 0 && (
							<Button
								style={{
									margin: "0 8px",
								}}
								onClick={() => {
									prev();
								}}>
								上一步
							</Button>
						)}
						{current < steps.length - 1 && (
							<Button type="primary" onClick={() => next()}>
								下一步
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button
								type="primary"
								onClick={() => {
									console.log(data);
									if (!data[4]) {
										message.error("请选择学生");
										return;
									}
									tf(false);
								}}>
								完成
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
const Two = ({fnstr, title}) => {
	return (
		<div>
			<Form
				style={{
					width: "600px",
					margin: "20px auto",
				}}
				initialValues={{
					title: title,
				}}
				autoComplete="off">
				<Form.Item
					label="添加标题"
					name="title"
					rules={[
						{
							required: true,
							message: "请输入标题",
						},
					]}>
					<Input
						onChange={(e) => {
							fnstr(e.target.value);
						}}
					/>
				</Form.Item>
			</Form>
		</div>
	);
};

const Three = ({fninfo, info}) => {
	return (
		<div
			style={{
				width: "900px",
				margin: "20px auto",
			}}>
			<TextArea
				onChange={(e) => {
					fninfo(e.target.value);
				}}
				value={info}
				rows={4}
				placeholder="请输入内容"
				maxLength={6}
			/>
		</div>
	);
};
const Four = ({fileList, fnfileList}) => {
	const getBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const handleCancel = () => setPreviewOpen(false);
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
	};
	const handleChange = ({fileList: newFileList}) => {
		const img = ["jpeg", "png", "jpg", "bmp", "svg"];
		const arr = newFileList[newFileList.length - 1].name.split(".");
		if (img.indexOf(arr[arr.length - 1]) == -1) {
			message.error("只能上传图片请重新选择");
			return;
		}
		newFileList.forEach((val, k) => {
			val.status = "done";
		});
		fnfileList(newFileList);
		console.log(newFileList);
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
	return (
		<div
			style={{
				padding: "25px",
			}}>
			<Upload
				action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
				listType="picture-card"
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}>
				{fileList.length >= 8 ? null : uploadButton}
			</Upload>
			<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
				<img
					alt="example"
					style={{
						width: "100%",
					}}
					src={previewImage}
				/>
			</Modal>
		</div>
	);
};

const Five = ({punishment, fnnum}) => {
	const [data, setdata] = useState([]);
	const handleChange = (e) => {
		fnnum(e)
	};
	useEffect(() => {
		request("/index/student/jing").then((res) => {
			console.log(res.data);
			setdata(() => [...res.data.data]);
		});
	}, []);
	return (
		<div
			style={{
				width: "800px",
				margin: "20px auto",
			}}>
			<h2
				style={{
					fontSize: "18px",
					textAlign: "center",
				}}>
				设置处分
			</h2>
			<Select
				key={99}
				defaultValue={punishment}
				onChange={handleChange}
				style={{
					width: "100%",
				}}>
				
				{data
					? data.map((val, k) => (
							<Option key={k} value={val.key}>
								{val.label}
							</Option>
					  ))
					: false}
			</Select>
		</div>
	);
};

export default function Punishment_add() {
	const [title, settitle] = useState("");
	const [data, setdata] = useState([]);
	const [showtf, setshowTf] = useState(false);
	const [userTf, setuserTf] = useState(true);
	const [info, setinfo] = useState("");
	const [punishment, setpunishment] = useState("");
	const [fileList, setFileList] = useState([]);
	const path=useNavigate()

	useEffect(() => {
		// request("/index/student/punishment").then((res) => {
		// 	console.log(res);
		// });
		setshowTf(() => true);
	}, []);
	const propssetpunishment = (e) => {
		console.log(e);
		setpunishment(() => e);
	};
	const propssetFileList = (e) => {
		setFileList(() => [...e]);
	};
	const propsfnsetdata = (e) => {
		setdata(() => [...e]);
	};
	const propssettitle = (e) => {
		settitle(() => e);
	};
	const propssetuserTf = (e) => {
		setuserTf(() => e);
	};
	const propssetinfo = (e) => {
		setinfo(() => e);
	};

	useEffect(() => {
		propssetuserTf(true);
	}, [data]);
	const steps = [
		{
			title: "选择学生",
			content: <One fnsetdata={propsfnsetdata} tf={propssetuserTf} data={data} />,
		},
		{
			title: "添加标题",
			content: <Two fnstr={propssettitle} title={title} />,
		},
		{
			title: "添加内容",
			content: <Three fninfo={propssetinfo} info={info} />,
		},
		{
			title: "添加附件",
			content: <Four fnfileList={propssetFileList} fileList={fileList} />,
		},
		{
			title: "行政处分",
			content: <Five fnnum={propssetpunishment} punishment={punishment} />,
		},
	];
	const [current, setCurrent] = useState(0);
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));
	const accomplish = () => {
		console.log(data, title, info, fileList);
		const loc = JSON.parse(localStorage.getItem("user"));
		if (!loc.user_id) {
			message.error("发生未知错误,请重新登陆");
			return
		}
		let dataPost = new FormData();
		fileList.forEach((val) => {
			dataPost.append("images[]", val.originFileObj);
		});
		dataPost.append("student_id", data[4]);
		dataPost.append("info", info);
		dataPost.append("title", title);
		dataPost.append("send_id", loc.user_id);
		dataPost.append("disciplinary_sanction_id", punishment);
		request_post("/index/student/addstudentw", dataPost).then((res) => {
			console.log(res);
			if(res.data.code==200){
				notification['success']({
					message: '保存成功',
				  });
				  path(-1)
			}else {
				message.error(res.data.msg)
			}
		});
	};
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
						padding: "10px 20px",
					}}>
					<Steps current={current} items={items} />
					<div className="steps-content">{steps[current].content}</div>
					<div
						className="steps-action"
						style={{
							boxSizing: "border-box",
							marginLeft: "80%",
						}}>
						{current > 0 && (
							<Button
								style={{
									margin: "0 8px",
								}}
								onClick={() => prev()}>
								上一步
							</Button>
						)}
						{current < steps.length - 1 && (
							<Button
								disabled={
									current == 0
										? userTf
											? true
											: false
										: current == 1
										? title.length > 0 && title.length <= 20
											? false
											: true
										: current == 2
										? info.length > 0 && info.length <= 500
											? false
											: true
										: current == 3
										? false
										: false
								}
								type="primary"
								onClick={() => next()}>
								下一步
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button type="primary" onClick={() => accomplish()}>
								完成
							</Button>
						)}
					</div>
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
