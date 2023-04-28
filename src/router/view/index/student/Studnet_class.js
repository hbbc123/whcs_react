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

const columns = [
	{
	  title: '姓名',
	  dataIndex: 'student_name',
	},
	{
	  title: '性别',
	  dataIndex: 'student_sex',
	},
	{
	  title: '班内职务',
	  dataIndex: 'student_post_name',
	},
  ];
export default function Studnet_class() {
	const [showtf, setshowTf] = useState(false);
	const [dataSource, setdataSource] = useState(false);
	const loc=JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
		if(loc.user_id.length==15&&loc.group==1)
        request("/student/index/getclass",{student_id:loc.user_id}).then((res) => {
            console.log(res);
			setdataSource(()=>[...res.data.data])
			setshowTf(()=>true)
        });
    }, []);
	return (
		<div>
			{showtf ? (
				<div
				style={{
					backgroundColor:'white'
				}}
				>
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
