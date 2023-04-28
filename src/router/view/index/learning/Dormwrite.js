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
export default function Dormwrite() {
	const [showtf, setshowTf] = useState(false);
	const [info, setinfo] = useState(false);
	const {id, tf} = useParams();
	useEffect(() => {
		request("/student/index/dorm_weix",{id}).then((res) => {
			setinfo(()=>res.data.data[0])
			setshowTf(()=>true)
		});
	}, []);
	return (
		<div>
			{showtf ? (
				<div>
					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title={`标题:${info.title}`}>
					</Descriptions>

					<Descriptions
						style={{
							backgroundColor: "white",
							padding: "10px 20px",
						}}
						title={`内容:`}>
					</Descriptions>
					<div
						dangerouslySetInnerHTML={{__html: info.maintain_info}}
						style={{backgroundColor: "white", padding: "10px 20px"}}
					>

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
