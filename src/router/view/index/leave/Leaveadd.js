import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Steps, Input, Select, DatePicker, notification} from "antd";
import request from "../../../axios/request";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import request_post from "../../../axios/request_post";
import getNd from "../../../hooks/getNd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import getInform from "../../../hooks/getInform";
import {useNavigate} from "react-router-dom";
import locale from "antd/es/date-picker/locale/zh_CN";
dayjs.extend(customParseFormat);
const {RangePicker} = DatePicker;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Leaveadd({serve}) {
	const [showtf, setshowTf] = useState(true);
	const [current, setCurrent] = useState(0);
	const [info, setinfo] = useState([]);
	const [type, settype] = useState(null);
	const [title, settitle] = useState("");
	const [user_name, setuser_name] = useState("");
	const [user_id, setuser_id] = useState("");
	const [leave_start, setleave_start] = useState("");
	const [leave_end, setleave_end] = useState("");
	const [onEditorStateChange, setonEditorStateChange] = useState("");
	const [newbody, setnewbody] = useState("");
	const [api, contextHolder] = notification.useNotification();
	const loc = JSON.parse(localStorage.getItem("user"));
	const path = useNavigate();
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const blurs = () => {
		setnewbody(draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent())));
	};
	const onchange_inp = (e, type) => {
		console.log(e, type);
		if (type == 0) {
			settype(e);
		} else if (type == 1) {
			settitle(() => e);
		}
	};
	const openNotificationWithIcon = (type) => {
		api[type]({
			message: "添加成功",
		});
	};
	useEffect(() => {
		request("/index/index/leave_add_look", {id: loc.user_id}).then((res) => {
			console.log(res);
			setinfo(() => [...res.data.data]);
		});
	}, []);
	const disabledDate = (current) => {
		// Can not select days before today and today
		return current && current < dayjs().endOf("day");
	};
	const range = (start, end) => {
		const result = [];
		for (let i = start; i < end; i++) {
			result.push(i);
		}
		return result;
	};
	const disabledRangeTime = (_, type) => {
		if (type === "start") {
			return {
				disabledHours: () => range(0, 60).splice(4, 20),
				disabledMinutes: () => range(30, 60),
				disabledSeconds: () => [55, 56],
			};
		}
		return {
			disabledHours: () => range(0, 60).splice(20, 4),
			disabledMinutes: () => range(0, 31),
			disabledSeconds: () => [55, 56],
		};
	};

	function getData(n) {
		n = new Date(n);
		return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8);
	}
	const pddate = (e) => {
		const date1 = dayjs(e[0]._d).valueOf();
		const date2 = dayjs(e[1]._d).valueOf();
		const tf = info.find((val, k) => {
			if (val.class ==type) {
				return (date2 - date1) / (1000 * 60 * 60 * 24) <= val.day;
			}
		});
		if (tf) {
			message.success("该申请将提交到" + tf.name + ":" + tf.user_name);
			setuser_id(() => tf.user_id);
			setuser_name(() => tf.user_name);
			setleave_start(()=>getData(date1))
			setleave_end(()=>getData(date2))
		} else {
			message.success("暂无该天数的申请请重新选择");
			setuser_id(() => "");
		}
	};
	const steps = [
		{
			title: "类型",
			content: (
				<div
					style={{
						width: "100%",
						height: "30px",
					}}>
					<Select
						style={{
							display: "block",
							margin: "10px auto",
							width: "500px",
						}}
						onChange={(e) => {
							onchange_inp(e, 0);
						}}
						options={[
							{
								value: 0,
								label: "请假",
							},
							{
								value: 1,
								label: "销假",
							},
						]}
					/>
				</div>
			),
		},
		{
			title: "填写请假标题及时间",
			content: (
				<Form
					style={{
						marginTop: "50px",
					}}
					name="basic"
					labelCol={{
						span: 5,
					}}
					wrapperCol={{
						span: 13,
					}}
					initialValues={{
						remember: true,
					}}
					autoComplete="off">
					<Form.Item
						label="请销假标题"
						name="title"
						rules={[
							{
								required: true,
								message: "请销假标题不能为空",
							},
						]}>
						<Input
							onChange={(e) => {
								onchange_inp(e.target.value, 1);
							}}
						/>
					</Form.Item>
					<Form.Item
						label="请销假时间"
						name="money"
						rules={[
							{
								required: true,
								message: "请销假时间不能为空",
							},
						]}>
						<RangePicker
							locale={locale}
							disabledDate={disabledDate}
							disabledTime={disabledRangeTime}
							onChange={(e) => {
								pddate(e);
							}}
							showTime={{
								hideDisabledOptions: true,
								defaultValue: [dayjs("00:00:00", "HH:mm:ss"), dayjs("11:59:59", "HH:mm:ss")],
							}}
							format="YYYY-MM-DD HH:mm:ss"
						/>
					</Form.Item>
				</Form>
			),
		},
		{
			title: "申请内容",
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
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));

	const end = () => {
		const str = draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent()));
		const data = new FormData();
		data.append("student_id", loc.user_id);
		data.append("leave_info", str);
		data.append("leave_accessory", title);
		data.append("leave_class", type);
		data.append("leave_admin", user_id);
		data.append("leave_start", leave_start);
		data.append("leave_end", leave_end);
		console.log(user_name);
		request_post("/index/index/leave_add", data).then((res) => {
			if (res.data.code == 200) {
				const data = {
					sen_id: '0',
					info: `你发起了标题为:${title}的请销假  请等待${user_name}审批`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);

				const datas = {
					sen_id: loc.user_id,
					info: `${loc.user_name}发起了标题为:${title}的请销假  请及时审批`,
					serve,
					accept_id:user_id,
					loop:true
				};
				getInform(datas);
				openNotificationWithIcon("success");
				path(-1);
			}
		});
	};
	return (
		<div>
			{contextHolder}
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
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
						{current < steps.length - 1 && (
							<Button
								dtype="primary"
								disabled={
									current == 0 && type != null ? false : current == 1 && title.length > 0 && user_id.length > 0 ? false : true
								}
								onClick={() => next()}>
								下一步
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button onClick={end} type="primary">
								提交
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
