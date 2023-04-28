import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, List, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Inform({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const close_tong = (e) => {
		try {
			const newdata = JSON.parse(e.data);
			console.log(newdata);
			if (newdata.type == "inform_info") {
				setdataSource(() => [...newdata.data]);
				serve.send(JSON.stringify({constructor: 8, data: {root: loc.group, user_id: loc.user_id}}));
			}
		} catch (e) {}

		setshowTf(() => true);
	};

	useEffect(() => {
		console.log(1);
		serve.websocket.addEventListener("message", close_tong, false);
		serve.send(JSON.stringify({constructor: 7, data: {root: loc.group, user_id: loc.user_id}}));
		return () => {
			serve.websocket.removeEventListener("message", close_tong, false);
		};
	}, []);

	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
						padding:'20px'
					}}>
					<List header={false} footer={false}>
						{
							dataSource.length>0?
								dataSource.map((val,k)=><List.Item key={val.id}>{val.sen_change_name+':'+val.info}</List.Item>)
							:false
						}
					</List>
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
