import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import {useRef} from "react";
import store from "../../../redux/store";
import getInform from "../../../hooks/getInform";

const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Member({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [crecord, setcrecord] = useState(null);
	const [dataSource, sedataSource] = useState([]);
	const [department, setdepartment] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const [member_select, setmember_select] = useState([]);
	const [department_specialty, setdepartment_specialty] = useState([]);
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [department_specialty_s, setdepartment_specialty_s] = useState([]);
	const submit_ref = useRef(null);
	const read = () => {
		request("/index/index/member").then((res) => {
			console.log(res);
			sedataSource(() => [...res.data.data]);
			setdepartment(() => [...res.data.department]);
			setmember_select(() => [...res.data.member_select]);
			setdepartment_specialty(() => [...res.data.department_specialty]);
			setdepartment_specialty_s(() => [...res.data.department_specialty]);
			setshowTf(() => true);
		});
	};
	useEffect(() => {
		read();
		store.subscribe(() => {
			setuseroot(store.getState().getIn(["useroot"]));
		});
	}, []);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		submit_ref.current.click();
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const columns = [
		{
			title: "院系",
			dataIndex: "pname",
			filters: department,
			onFilter: (value, record) => record.pname.startsWith(value),
		},
		{
			title: "专业",
			dataIndex: "sname",
			filters: department_specialty_s,
			onFilter: (value, record) => record.sname.startsWith(value),
		},
		{
			title: "年级",
			dataIndex: "nj",
		},
		{
			title: "姓名",
			dataIndex: "student_name",
		},
		{
			title: "政治面貌",
			dataIndex: "politics_name",
		},
		{
			title: "编辑",
			render: (e) =>
				useroot.student_zzmm == 0 && e.politics_name != "党员" && e.politics_name != "积极分子" ? (
					<Button
						onClick={(e) => {
							showModal();
						}}
						type="primary"
						icon={<EditOutlined />}
						shape="circle"
						size="large"></Button>
				) : (
					<Button disabled type="primary" icon={<EditOutlined />} shape="circle" size="large"></Button>
				),
		},
	];
	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", filters);
		let arrnum = [];
		if (filters.pname) {
			filters.pname.forEach((val) => {
				department.forEach((son) => {
					if (son.text == val) {
						arrnum.push(son.key);
					}
				});
			});
			let arrdata = [];
			console.log(arrnum);
			arrnum.forEach((par) => {
				department_specialty.forEach((val) => {
					if (par == val.pid) {
						arrdata.push(val);
					}
				});
			});
			setdepartment_specialty_s(() => [...arrdata]);
		} else {
			setdepartment_specialty_s(() => [...department_specialty]);
		}
	};
	const onFinish = (e) => {
		console.log(crecord,e.politics_name,member_select);
		console.log();

		if (parseInt(e.politics_name) != e.politics_name) return;
		request("/index/index/up_Member", {student_id: crecord.student_id, type: parseInt(e.politics_name)}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				let zzmm=member_select.find(val=>val.value==e.politics_name).label
				const data = {
					sen_id: '0',
					info: `你修改了  ${crecord.student_name}的政治面貌为${zzmm}`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);

				const datas = {
					sen_id: loc.user_id,
					info: `修改了  你的政治面貌为${zzmm}`,
					serve,
					accept_id:crecord.student_id,
					loop:true
				};
				getInform(datas);
				message.success(res.data.msg);
				read();
			}
		});
		setIsModalOpen(false);
	};
	return (
		<div>
			{isModalOpen ? (
				<Modal title={`${crecord.student_name}  政治面貌编辑`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={crecord}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="政治面貌"
							name="politics_name"
							rules={[
								{
									required: true,
									message: "政治面貌不能为空",
								},
							]}>
							<Select options={member_select} />
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button ref={submit_ref} type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
					<Table
						onChange={onChange}
						onRow={(record) => {
							return {
								onMouseEnter: (event) => {
									setcrecord(() => {
										return {...record};
									});
								}, // 鼠标移入行
							};
						}}
						dataSource={dataSource}
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
