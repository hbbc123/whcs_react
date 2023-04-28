import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form,Steps , Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import request_post from "../../../axios/request_post";
import getNd from "../../../hooks/getNd";
import { useNavigate } from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Moneyadd() {
	const [showtf, setshowTf] = useState(true);
	const [current, setCurrent] = useState(0);
	const [money, setmoney] = useState(0);
	const [title, settitle] = useState(0);
	const [onEditorStateChange, setonEditorStateChange] = useState("");
	const [newbody, setnewbody] = useState("");
	const [api, contextHolder] = notification.useNotification();
	const path=useNavigate()
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const blurs = () => {
		setnewbody(draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent())));
	};
	const onchange_inp=(e,type)=>{
		if(type==1){
			settitle(()=>e)
		}else {
			setmoney(()=>e)
		}
	}
	const openNotificationWithIcon = (type) => {
		api[type]({
		  message: '添加成功',
		});
	  };
	const steps  = [
		{
			title: "填写标题及金额",
			content:<Form
			style={{
				marginTop:'50px'
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
		
			autoComplete="off"
		  >
			<Form.Item
			  label="申请标题"
			  name="title"
			  rules={[
				{
				  required: true,
				  message: '标题不能为空',
				},
			  ]}
			>
			  <Input onChange={(e)=>{onchange_inp(e.target.value,1);}}/>
			</Form.Item>
			<Form.Item
			  label="申请金额"
			  name="money"
			  rules={[
				{
				  required: true,
				  message: '申请金额不能为空',
				},
			  ]}
			>
			  <Input type="number"  onChange={(e)=>{onchange_inp(e.target.value,2);}}/>
			</Form.Item>

		  </Form>
		},
		{
			title: "申请内容",
			content:<div
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
		</div> ,
		},
	
	];
	const items = steps.map((item) => ({
		key: item.title,
		title: item.title,
	}));

	const end=()=>{
		const loc=JSON.parse(localStorage.getItem('user'))
		const str = draftToHtml(convertToRaw(onEditorStateChange.getCurrentContent()));
		const data = new FormData();
		data.append("maintain_info", str);
		data.append("add_money",money);
		data.append("title",title);
		data.append('applicant_id',loc.user_id)
		data.append('nd',getNd())
		request_post('/index/index/Moneyadd',data).then(res=>{
			if(res.data.code==200){
				openNotificationWithIcon('success')
				path(-1)
			}
		})
	}
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
							<Button  disabled={current==0?money>0&&title.length?false:true:false} type="primary"  onClick={() => next()}>
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
