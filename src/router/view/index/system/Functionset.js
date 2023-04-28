import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, Switch,message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Functionset({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [dataSource, setdataSource] = useState([]);
	const onChange=(e)=>{
		request('/index/index/up_Functionset',{type:e,name:crecord.key}).then(res=>{
			if(res.data.code==200){
				message.success(res.data.msg)
				read()
				serve.send(JSON.stringify({constructor: 6, data: {type:1}}));
			}
		})
	}
	const read=()=>{
		request("/index/index/get_root_name").then((res) => {
			const arr = res.data.data[0];
			const arr1 = res.data.data[1];
			const datarr = [];
			for (let a in arr) {
				if(a=='id'||a=='key'){
				}else {
					datarr.push({title: arr[a], state: parseInt(arr1[a]), key: a});
				}
			}
			setdataSource(() => [...datarr]);
			setshowTf(() => true);
		});
	}
	useEffect(() => {
		read()
	}, []);
	const columns = [
		{
			title: "选项",
			dataIndex: "title",
		},
		{
			title: "是否开启",
			render: (e) => <Switch defaultChecked={e.state == 0 ? true : false} onChange={onChange} />,
		},
	];
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table 
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									setcrecord(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
					dataSource={dataSource} columns={columns} />
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
