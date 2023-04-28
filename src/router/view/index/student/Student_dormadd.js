import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Cascader, message, Steps, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import request_post from "../../../axios/request_post";
import getInform from "../../../hooks/getInform";
import { useNavigate } from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Student_dormadd({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [current, setCurrent] = useState(0);
	const [dorm_num, setdorm_num] = useState(0);
	const [title_ss, settitle_ss] = useState("");
	const [data, setdata] = useState(0);
	const [onEditorStateChange, setonEditorStateChange] = useState("");
	const [newbody, setnewbody] = useState("");
	const loc = JSON.parse(localStorage.getItem("user"));

	const [api, contextHolder] = notification.useNotification();
	const path=useNavigate()
	const openNotificationWithIcon = (type) => {
		api[type]({
		  message: '添加成功',
		});
	  };
	const onChange = (e) => {
		setdorm_num(() => [...e]);
	};
	const onChange_title = (e) => {
		settitle_ss(() => e.target.value);
	};
	const blurs = () => {
		setnewbody(draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent())));
	};
	const steps = [
		{
			title: "选择楼栋宿舍号",
			content: (
				<div
					style={{
						width: "100%",
						height: "100px",
					}}>
					<Cascader
						options={data}
						onChange={onChange}
						placeholder="请选择楼栋宿舍号"
						style={{
							left: "45%",
							top: "50%",
							width: "200px",
						}}
					/>
				</div>
			),
		},
		{
			title: "填写标题",
			content: (
				<div
					style={{
						width: "100%",
						height: "100px",
					}}>
					<Input
						style={{
							left: "30%",
							top: "50%",
							width: "600px",
						}}
						onChange={onChange_title}
						placeholder="请填写标题"
					/>
				</div>
			),
		},
		{
			title: "填写内容",
			content: (
				<div
					style={{
						width: "100%",
						height: "650px",
					}}>
					<Editor
						editorState={onEditorStateChange}
						wrapperClassName="demo-wrapper"
						editorClassName="demo-editor"
						onBlur={() => {
							blurs();
						}}
						onEditorStateChange={(e) => setonEditorStateChange(e)}
					/>
				</div>
			),
		},
	];
	const end = () => {
		const str = draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent()));
		const loc = JSON.parse(localStorage.getItem("user"));
		if (!loc.user_id) {
			message.error("请重新登录");
			return;
		}
		const data = new FormData();
		data.append("maintain_info", str);
		data.append("dorop_num", dorm_num[0]);
		data.append("accessory", dorm_num[1]);
		data.append("student_id",loc.user_id);
		data.append("title",title_ss);
		request_post("/student/index/end_dorm", data).then((res) => {
			if(res.data.code==200){
				const data = {
					sen_id: '0',
					info: `你发起了标题名为${title_ss}的的宿舍维修申请,楼栋号:${dorm_num[0]}  宿舍号:${dorm_num[1]}`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);
				openNotificationWithIcon('success')
				path(-1)
			}
		});
	};
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
	useEffect(() => {
		request("/student/index/dorm_bao_add").then((res) => {
			setdata(() => [...res.data.data]);
			setshowTf(() => true);
		});
	}, []);

	return (
		<div>
			{contextHolder}
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
						padding: "10px 20px",
					}}>
					<Steps current={current} items={items} />
					<div className="steps-content">{steps[current].content}</div>

					<div className="steps-action">
						{current > 0 && (
							<Button
								style={{
									margin: "0 8px",
								}}
								onClick={() => prev()}>
								上一步
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button type="primary" onClick={end}>
								完成
							</Button>
						)}
						{current < steps.length - 1 && (
							<Button type="primary" onClick={() => next()} disabled={current==0&&dorm_num ? false : current==1&&title_ss.length>5 ? false : true}>
								下一步
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
