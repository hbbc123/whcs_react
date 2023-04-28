import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input,Tag, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);


export default function Student_book() {
	const [showtf, setshowTf] = useState(false);
    const loc = JSON.parse(localStorage.getItem("user"));
	const [info, setinfo] = useState();
	useEffect(() => {
        request("/student/index/student_book",{student_id:loc.user_id}).then((res) => {
			setinfo(() => [...res.data.data]);
			setshowTf(true);
        });
    }, []);
	const columns = [
		{
			title: "姓名",
			dataIndex: "user_name",
		},
		{
			title: "借阅书籍",
			dataIndex: "library_name",
		},
		{
			title: "借阅时间",
			dataIndex: "lend_start",
		},
		{
			title: "归还时间",
			dataIndex: "lend_end",
		},
		{
			title: "状态",
			dataIndex: "lend_state",
			sorter: (a, b) => a.lend_state - b.lend_state,
			render: (e) =>
				e == 1 ? (
						<Tag color="success">进行中</Tag>
				) : (
					<Tag color="default">已结束</Tag>
				),
		},
	];
	return (
		<div>
			{showtf ? (
				<div
				style={{
					backgroundColor:'white'
				}}
				>
					<Table
						rowKey={"id"}
						style={{
							borderRightColor: "white",
						}}
						dataSource={info}
						columns={columns}
					
					/>
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
