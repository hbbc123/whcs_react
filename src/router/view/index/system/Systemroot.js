import {useState, useEffect, useRef} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Switch, Modal,Skeleton , Popconfirm, TreeSelect, message, Collapse, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
const {Panel} = Collapse;
const {SHOW_PARENT} = TreeSelect;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Systemroot({serve}) {
	const [showtf, setshowTf] = useState(false);
	const [department, setdepartment] = useState([]);
	const [department_id, setdepartment_id] = useState(null);
	const [post_id, setpost_id] = useState(null);
	const [str, setstr] = useState(null);
	const [postAll, setpostAll] = useState(null);
	const submit_ref = useRef(null);
	const [crecord, setcrecord] = useState(null);
	const [dataSource, setdataSource] = useState([]);
	const [post, setpost] = useState([]);
	const [treeData, setreeData] = useState([]);
	const [time, settime] = useState(false);
	useEffect(() => {
		request("/index/index/Systemroot").then((res) => {
			console.log(res);
			setdepartment(() => [...res.data.data]);
			setshowTf(() => true);
		});
		request("/index/index/get_post_Systemroot_all_bsd").then((res) => {
			console.log(res);
			setreeData(() => [...res.data.data]);
		});
	}, []);
	const onChange = (key) => {
		settime(()=>false)
		if(key=='789'){
			request('/index/index/Systemroot_post_student').then(res=>{
				setdataSource(()=>[...res.data.data])
				setstr(()=>[...res.data.str])
				
			})
			return 
		}
		
		if (key) {
			setdepartment_id(() => key);
			request("/index/index/Systemroot_post", {id: parseInt(key)}).then((res) => {
				console.log(res);
				setpost(() => [...res.data.data]);
				request("/index/index/get_Systemroot_post").then((son) => {
					const arr = [];
					res.data.data.forEach((val) => {
						arr.push(val.name);
					});
					const newpostAll = son.data.data;
					console.log(arr);
					newpostAll.forEach((val, k) => {
						if (arr.indexOf(val.label) != -1) {
							newpostAll[k].disabled = true;
						} else {
							newpostAll[k].disabled = false;
						}
						if (department[parseInt(key) - 1].name != "党政办公室" && (val.label == "校长" || val.label == "副校长")) {
							newpostAll[k].disabled = true;
						}
						if (
							department[parseInt(key) - 1].id >= 11 &&
							(val.label == "院长" || val.label == "副院长" || val.label == "辅导员" || val.label == "班主任" || val.label == "讲师")
						) {
							newpostAll[k].disabled = true;
						}
					});

					setpostAll(() => [...newpostAll]);
				});
			});
		} else {
			setpost(() => []);
			setdepartment_id(() => null);
		}
	};
	const onChange_s = (key) => {
		if (key) {
			setpost_id(() => key);
			request("/index/index/Systemroot_info", {pid: parseInt(department_id), sid: parseInt(key)}).then((res) => {
				if (dataSource.length == 0) {
					setdataSource(() => [...res.data.data]);
				}
				setstr(() => [...res.data.str]);
				setTimeout(()=>{
					settime(()=>true)
				},200)
			});
		} else {
			setstr(() => []);
			setpost_id(() => null);
			setdataSource(() => []);
			settime(()=>false)
		}
	};
	const onChange_Switch = (e,type) => {
		console.log(e, department_id, post_id, crecord,type);
		if(type==1){
			request("/index/index/up_Systemroot", {pid: department_id, sid: post_id, root_info_id: crecord.id, type: e}).then((res) => {
				console.log(res);
				if (res.data.code == 200) {
					message.success(res.data.msg);
					request("/index/index/Systemroot_info", {pid: parseInt(department_id), sid: parseInt(post_id)}).then((res) => {
						console.log(res);
						if (dataSource.length == 0) {
							setdataSource(() => [...res.data.data]);
						}
						setstr(() => [...res.data.str]);
					});
				}
			});
		}else {
			request("/index/index/up_Systemroot_student",{type:e,id:crecord.id} ).then(res=>{
				if(res.data.code==200){
					message.success(res.data.msg)
					request('/index/index/Systemroot_post_student').then(res=>{
						setdataSource(()=>[...res.data.data])
						setstr(()=>[...res.data.str])
					})
				}
			})
		}
		serve.send(JSON.stringify({constructor:10, data: {hh:'哈哈哈'}}));
		
	};
	const columns = [
		{
			title: "页面",
			render: (e) => (e.father == "false" ? e.remark : e.father + "/" + e.remark),
		},
		{
			title: "路径",
			dataIndex: "site",
		},
		{
			title: "是否开启",
			render: (e) =>
				e.site == "/home/head" ? (
					<Switch defaultChecked disabled />
				) : (
					<Switch defaultChecked={str.indexOf(e.site) != -1 ? true : false} onChange={(e)=>{department_id?onChange_Switch(e,1):onChange_Switch(e,2)}} />
				),
		},
	];
	const confirm = () => {
		request("/index/index/del_Systemroot", {pid: parseInt(department_id), sid: parseInt(post_id)}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				request("/index/index/Systemroot_post", {id: parseInt(department_id)}).then((res) => {
					console.log(res);
					setpost(() => [...res.data.data]);
					request("/index/index/get_Systemroot_post").then((res) => {
						const arr = [];
						post.forEach((val) => {
							arr.push(val.name);
						});
						const newpostAll = res.data.data;
						newpostAll.forEach((val, k) => {
							if (arr.indexOf(val.label) != -1) {
								newpostAll[k].disabled = false;
							} else {
								newpostAll[k].disabled = true;
							}
						});
						console.log(newpostAll);
						setpostAll(() => [...newpostAll]);
					});
				});
			}
		});
	};
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
	const onFinish = ({post_id, sdf}) => {
		request("/index/index/add_Systemroot", {pid: parseInt(department_id), sid: post_id, data: sdf}).then((res) => {
			if (res.data.code == 200) {
				message.success(res.data.msg);
				request("/index/index/Systemroot_post", {id: parseInt(department_id)}).then((res) => {
					console.log(res);
					setpost(() => [...res.data.data]);
					request("/index/index/get_Systemroot_post").then((res) => {
						const arr = [];
						post.forEach((val) => {
							arr.push(val.name);
						});
						const newpostAll = res.data.data;
						newpostAll.forEach((val, k) => {
							if (arr.indexOf(val.label) != -1) {
								newpostAll[k].disabled = false;
							} else {
								newpostAll[k].disabled = true;
							}
						});
						console.log(newpostAll);
						setpostAll(() => [...newpostAll]);
					});
				});
			}
		});

		setIsModalOpen(false);
	};
	const [value_tProps, setvalue_tProps] = useState([]);
	const onChange_duo = (newValue) => {
		console.log(newValue);
		console.log("onChange ", value_tProps);
		setvalue_tProps(newValue);
	};

	return (
		<div>
			{isModalOpen ? (
				<Modal title={department[parseInt(department_id)].name + "  新增职务权限"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={{
							remember: true,
						}}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="职务"
							name="post_id"
							rules={[
								{
									required: true,
									message: "职务不能为空",
								},
							]}>
							<Select options={postAll} />
						</Form.Item>
						<Form.Item
							label="页面权限"
							name="sdf"
							rules={[
								{
									required: true,
									message: "页面权限不能为空",
								},
							]}>
							<TreeSelect
								showSearch
								style={{
									width: "100%",
								}}
								value={value_tProps}
								dropdownStyle={{
									maxHeight: 400,
									overflow: "auto",
								}}
								placeholder="首页必选"
								allowClear
								multiple
								treeDefaultExpandAll
								onChange={onChange_duo}
								treeData={treeData}
							/>
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
					<Collapse accordion onChange={onChange}>
						{department.map((val, k) => (
							<Panel header={val.name} key={val.key}>
								{post.map((val, k) => (
									<Collapse accordion onChange={onChange_s}>
										<Panel header={val.name} key={val.post_id} className={css.por}>
											{dataSource&&time? (
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
													dataSource={dataSource}
													columns={columns}
												/>
											) : (
												<Skeleton />
											)}
											{dataSource ? (
												<Popconfirm
													placement="top"
													title="请仔细确定是否执行该操作"
													onConfirm={confirm}
													okText="Yes"
													cancelText="No">
													<Button danger className={css.poa} type="primary">
														删除该职务
													</Button>
												</Popconfirm>
											) : (
												false
											)}
										</Panel>
									</Collapse>
								))}
								<Button
									style={{
										marginTop: "20px",
									}}
									onClick={showModal}
									type="primary">
									新增职务
								</Button>
							</Panel>
						))}
						<Panel header="学生路由权限设置" key="789">
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
								dataSource={dataSource}
								columns={columns}
							/>
						</Panel>
					</Collapse>
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
