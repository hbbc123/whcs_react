import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, Descriptions, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {useParams, useNavigate} from "react-router-dom";
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
export default function Leavelook() {
	const [showtf, setshowTf] = useState(false);
	const [info, setinfo] = useState([]);
	const {id} = useParams();
	useEffect(() => {
		request("/index/index/leavelook", {id}).then((res) => {
			console.log(res);
			setinfo(() => res.data.data[0]);
			setshowTf(() => true);
		});
	}, []);
	return (
		<div>
			{showtf&&info ? (
				<div>
					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title={`标题:${info.leave_accessory}`}></Descriptions>
					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title={`内容:`}></Descriptions>
					<div dangerouslySetInnerHTML={{__html: info.leave_info}} style={{backgroundColor: "white", padding: "10px 20px"}}></div>
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
