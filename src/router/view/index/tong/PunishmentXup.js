import {useState, useEffect, Component, useRef} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {Table, Popconfirm, Spin, Button, Steps, Cascader, message, Form, Input, Select, PlusOutlined, Descriptions, notification, Tag} from "antd";
import request from "../../../axios/request";
import {useParams, useNavigate} from "react-router-dom";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import request_post from "../../../axios/request_post";
import request_postS from "../../../axios/request_postS";
import getInform from "../../../hooks/getInform";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Punishment({serve}) {
	const {id, setid} = useParams();
	const [datainfo, setdatainfo] = useState({
		teacher_id: null,
		teacher_name: null,
		info: null,
		clan_sanction_id: -1,
		clan_name: null,
		disciplinary_sanction_id: null,
		sciplinary_name: null,
		title: "",
		pid: null,
	});
	const [userTf, setuserTf] = useState(false);
	const [select_class, setselect_class] = useState([]);
	const [current, setCurrent] = useState(0);
	const path = useNavigate();
	const loc = JSON.parse(localStorage.getItem("user"));

	const [onEditorStateChange, setonEditorStateChange] = useState("");
	const [newbody, setnewbody] = useState("");
	const [zzTf, setzzTf] = useState(true);
	const onChange = (value) => {
		const newdatainfo = datainfo;
		newdatainfo.teacher_id = value[1];
		select_class[2][value[0] - 1].children.forEach((val) => {
			if (val.key == value[1]) {
				newdatainfo.teacher_name = val.label;
			}
		});
		request("/teacher/index/chazz", {id: value[1]}).then((res) => {
			if (res.data.politics_name) {
				if (res.data.politics_name == "党员") {
					setzzTf(true);
				} else {
					setzzTf(false);
				}
			}
		});
		setdatainfo(() => {
			return {...newdatainfo};
		});
	};

	// Just show the latest item.
	const displayRender = (labels) => labels[labels.length - 1];
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const fntitle = (e) => {
		const newdatainfo = datainfo;
		newdatainfo.title = e;
		setdatainfo(() => {
			return {...newdatainfo};
		});
	};

	const blurs = () => {
		setnewbody(draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent())));
	};

	const steps = [
		{
			title: "选择被处分人",
			content: (
				<Cascader
					style={{
						width: "400px",
						display: "block",
						margin: "30px auto",
					}}
					options={select_class[2]}
					expandTrigger="hover"
					displayRender={displayRender}
					onChange={onChange}
					defaultValue={[datainfo.pid, datainfo.teacher_name]}
				/>
			),
		},
		{
			title: "填写标题",
			content: (
				<Input
					value={datainfo.title}
					onChange={(e) => fntitle(e.target.value)}
					placeholder="请输入标题"
					style={{
						width: "400px",
						display: "block",
						margin: "30px auto",
					}}
				/>
			),
		},
		{
			title: "填写内容",
			content: (
				<div>
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
		{
			title: "设置行政处分",
			content: (
				<div>
					<Select
						key={2}
						style={{
							width: "400px",
							display: "block",
							margin: "30px auto",
						}}
						onChange={(e) => {
							const newdatainfo = datainfo;
							newdatainfo.disciplinary_sanction_id = e;
							select_class[0].forEach((val) => {
								if (val.value == e) {
									newdatainfo.sciplinary_name = val.label;
								}
							});
							setdatainfo(() => {
								return {...newdatainfo};
							});
						}}
						defaultValue={datainfo.sciplinary_name}
						options={select_class[0]}
					/>
				</div>
			),
		},
		{
			title: "设置党纪处分",
			content: (
				<div>
					<Select
						disabled={!zzTf}
						key={3}
						style={{
							width: "400px",
							display: "block",
							margin: "30px auto",
						}}
						onChange={(e) => {
							const newdatainfo = datainfo;
							newdatainfo.clan_sanction_id = e;
							select_class[1].forEach((val) => {
								if (val.value == e) {
									newdatainfo.clan_name = val.label;
								}
							});
							setdatainfo(() => {
								return {...newdatainfo};
							});
						}}
						defaultValue={datainfo.clan_name}
						options={select_class[1]}
					/>
				</div>
			),
		},
	];
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));
	useEffect(() => {
		if (id != 0) {
			request("/teacher/index/teacher_clenX", {id: parseInt(id)}).then((res) => {
				if (res.data.data.length > 0) {
					const data = res.data.data[0];
					setdatainfo(() => {
						return {
							teacher_id: data.beid,
							teacher_name: data.beiname,
							info: data.info,
							clan_sanction_id: data.clan_sanction_id,
							clan_name: data.clan_name,
							disciplinary_sanction_id: data.disciplinary_sanction_id,
							sciplinary_name: data.sciplinary_name,
							title: data.title,
							pid: data.pidss,
						};
					});
					const contentBlock = htmlToDraft(data.info);
					console.log(contentBlock);
					if (contentBlock) {
						const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
						const editorState = EditorState.createWithContent(contentState);
						setonEditorStateChange(editorState);
					}
				}
				const loc = JSON.parse(localStorage.getItem("user"));
				if (loc.user_id) {
					if (loc.user_id == res.data.data[0].send_id) {
						setuserTf(true);
					} else {
						message.error("您不是发起人无法更改内容请联系对方");
						path(-1);
					}
				}
				setselect_class(() => [res.data.x, res.data.d, res.data.t]);
			});
		} else {
			request("/teacher/index/fu_teacher_clenX").then((res) => {
				console.log(res);
				setselect_class(() => [res.data.x, res.data.d, res.data.t]);
			});
		}
	}, []);

	const end_hou = (e) => {
		const str = draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent()));
		const {clan_sanction_id, disciplinary_sanction_id, info, teacher_id, title} = datainfo;
		const loc = JSON.parse(localStorage.getItem("user"));
		if (!loc.user_id) {
			message.error("请重新登录");
			return;
		}
		console.log(datainfo);
		const data = new FormData();
		data.append("clan_sanction_id", clan_sanction_id);
		data.append("disciplinary_sanction_id", disciplinary_sanction_id);
		data.append("info", str);
		data.append("teacher_id", teacher_id);
		data.append("title", title);
		data.append("id", id);
		data.append("send_id", loc.user_id);
		request_post("/teacher/index/send_teacherw", data).then((res) => {
			console.log(res);
			if(res.data.code==200){
			const data = {
				sen_id: '0',
				info: `你发起了:标题为${datainfo.title}的处分   被处理人${datainfo.teacher_name}  `,
				serve,
				accept_id:loc.user_id,
				loop:false
			};
			getInform(data);

			const datas = {
				sen_id: loc.user_id,
				info: `对你发起了:标题为${datainfo.title}的处分   请及时受理`,
				serve,
				accept_id:datainfo.teacher_id,
				loop:true
			};
			getInform(datas);
				notification.open({
					message: '保存成功',
					icon: (
						<CheckCircleOutlined
						  style={{
							color: '#259645',
						  }}
						/>
					  ),
				  });
				path(-1)
			}
		});
	};
	return (
		<div>
			{select_class.length == 3 ? (
				<div
					style={{
						backgroundColor: "white",
						padding: "30px ",
					}}>
					<Steps current={current} items={items} />
					<div className="steps-content">{steps[current].content}</div>
					<div
						className="steps-action"
						style={{
							marginLeft: "85%",
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
								type="primary"
								disabled={
									current == 0
										? datainfo.teacher_id
											? false
											: true
										: current == 1
										? datainfo.title.length > 0
											? false
											: true
										: current == 2
										? false
										: current == 3
										? datainfo.disciplinary_sanction_id != null
											? false
											: true
										: false
								}
								onClick={() => {
									console.log(current + 1);
									next();
								}}>
								下一步
							</Button>
						)}
						{current === steps.length - 1 && (
							<Button type="primary" onClick={() => end_hou()}>
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
