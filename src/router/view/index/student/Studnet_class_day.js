import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import getNd from "../../../hooks/getNd";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Studnet_class_day() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const loc = JSON.parse(localStorage.getItem("user"));
	useEffect(() => {
		request("/student/index/getclass_day", {student_id: loc.user_id, nd: getNd()}).then(({data}) => {
			let arr=[]
			if(data.data.length>0){
				arr=fy(data,1,arr)
			}
			if(data.select.length>0){
				arr=fy(data,2,arr)
			}
			setdataSource(()=>[...arr])
			setshowTf(() => true);
		});
	}, []);
	const fy = (data, type, arr) => {
		for (let i = 1; i <= 6; i++) {
			let obj = {};
			obj.jie = `${i * 2 - 1}-${i * 2}节`;
			for (let j = 1; j <= 5; j++) {
				let day = "";
				switch (j) {
					case 1:
						day = "one";
						break;
					case 2:
						day = "two";
						break;
					case 3:
						day = "three";
						break;
					case 4:
						day = "four";
						break;
					case 5:
						day = "five";
						break;
					default:
						break;
				}
				obj.key = i * 1020 + Math.random();
				let son = null;
				if (type == 1) {
					son = data.data.find((val) => val.week === i && val.class_time == j);
				} else {
					son = data.select.find((val) => val.week === i && val.section == j);
				}

				console.log(son);
				if (son) {
					if (type == 1) {
						obj[day] = (
							<div>
								<div>{son.pname}</div>
								<div>{son.sname + son.num + "班"}</div>
								<div>{son.k_name + "[" + son.start_time + "-" + son.end_time + "]"}</div>
								<div>{son.classroom+son.teacher_name}</div>
							</div>
						);
					} else {
						console.log(45545);
						arr[i][day] = (
							<div>
								<div>选修课</div>
								<div>{son.name + "[" + son.sen_time + "-" + son.end_time + "]"}</div>
								<div>{son.place}{son.teacher_name}</div>
							</div>
						);
					}
				}
			}
			if (type == 1) {
				arr.push(obj);
			}
		}
		return arr;
	};

	const columns = [
		{
			title: "节次",
			dataIndex: "jie",
		},
		{
			title: "星期一",
			dataIndex: "one",
		},
		{
			title: "星期二",
			dataIndex: "two",
		},
		{
			title: "星期三",
			dataIndex: "three",
		},
		{
			title: "星期四",
			dataIndex: "four",
		},
		{
			title: "星期五",
			dataIndex: "five",
		},
	];
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table dataSource={dataSource} columns={columns} />
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
