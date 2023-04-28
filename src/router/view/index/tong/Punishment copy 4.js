import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);


export default function Punishment() {
	const [showtf, setshowTf] = useState(false);
	
    useEffect(() => {
        request("/teacher/index/teacher_clen").then((res) => {
        });
    }, []);
	return (
		<div>
			{showtf ? (
				<div></div>
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
