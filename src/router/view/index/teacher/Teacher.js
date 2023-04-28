import {Table, Spin, Button, Input, Space, Modal, Form, Select, DatePicker} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {LoadingOutlined, SearchOutlined, EditOutlined} from "@ant-design/icons";
import moment from "moment";
import request from "../../../axios/request";
import css from "./css/Teacher.module.css";
import Highlighter from "react-highlight-words";
import {downLoadExcelMode} from "../../../hooks/excel";
import {useNavigate} from "react-router-dom";
import store from "../../../redux/store";
import getInform from "../../../hooks/getInform";

const {Option} = Select;
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);

export default function Teacher({serve}) {
	const path = useNavigate();
	const [useroot, setuseroot] = useState(store.getState().getIn(["useroot"]));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [teacher, setteacher] = useState([]);
	const [showTf, setshowTf] = useState(false);
	const [filters, setfilters] = useState(null);
	const [filters_z, setfilters_z] = useState(null);
	const [newdb_z, setnewdb_z] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [updata, setipdata] = useState(null);
	const [crecord, setcrecord] = useState(null);
	const [msgdata, setmsgdata] = useState(false);
	const [msgdke, setmsgdke] = useState([]);
	const [postarr, setpostarr] = useState([]);
	const loc = JSON.parse(localStorage.getItem("user"));
	const searchInput = useRef(null);
	const [isModalOpen_s, setIsModalOpen_s] = useState(false);
	const showModal_s = () => {
		setIsModalOpen_s(true);
	};
	const handleOk_s = () => {
		submit_s_ref.current.click();
	};
	const handleCancel_s = () => {
		setIsModalOpen_s(false);
	};
	const submit_s_ref = useRef(null);
	const dao = () => {
		const arr = {
			admin_post: "行政职务",
			age: "年龄",
			card: "身份证号",
			department: "部门",
			entry_time: "入职时间",
			iphone: "手机号",
			key: "教职工号",
			name: "姓名",
			politics_post: "政治职务",
			room: "科室",
			sex: "性别",
			site: "地址",
			state: "在职状态",
		};
		const sheetData = [];
		teacher.forEach((val, k) => {
			const obj = {};
			for (let j in val) {
				if (j == "description") {
					for (let s in val.description[0]) {
						if (s != "teacher_id") {
							obj[s] = val.description[0][s];
						}
					}
				} else {
					obj[j] = val[j];
				}
			}
			sheetData.push(obj);
		});
		const fileName = "教职工总览表";
		const sheetHeader = [];
		const sheetFilter = [];
		const nowtime = new Date();
		const sheetName = `${nowtime.getFullYear()}-${nowtime.getMonth() + 1}-${nowtime.getDate()}`;
		console.log(sheetName);
		for (let s in arr) {
			sheetHeader.push(arr[s]);
			sheetFilter.push(s);
		}
		downLoadExcelMode(fileName, sheetData, sheetFilter, sheetHeader, sheetName);
	};
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
			<div
				style={{
					padding: 8,
				}}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}>
						搜索
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{
							width: 90,
						}}>
						重置
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1890ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
		let arr = [];
		if (filters.department) {
			filters.department.forEach((val) => {
				newdb_z.forEach((item) => {
					if (item.bname == val) {
						item.childer.forEach((son) => {
							arr.push({text: son.bname, value: son.bname});
						});
					}
				});
			});
			setfilters_z([...arr]);
		} else {
			newdb_z.forEach((item) => {
				if (item.childer) {
					item.childer.forEach((son) => {
						arr.push({text: son.bname, value: son.bname});
					});
				}
			});
			setfilters_z([...arr]);
		}
	};
	function revome(data) {
		let db_z = [];
		data.forEach((val, key) => {
			if (val.childer) {
				if (val.childer.length > 0) {
					val.childer.forEach((itme) => {
						if (db_z.indexOf(itme.bname) == -1) {
							db_z.push(itme.bname);
						}
					});
				}
			}
		});
		let newdb_z = [];
		db_z.forEach((val) => {
			newdb_z.push({text: val, value: val});
		});
		setfilters_z(() => [...newdb_z]);
	}

	const req = () => {
		request("/index").then((res) => {
			console.log(res);
			setteacher(() => [...res.data.data]);
			let dp = [],
				msgparr = [];
			res.data.department.forEach((val, key) => {
				dp.push({text: val.bname, value: val.bname, key: val.bid});
			});
			setfilters(() => [...dp]);
			setnewdb_z(() => [...res.data.department]);
			revome(res.data.department);
			setshowTf(() => true);
			let addnwe = res.data.zz;
			addnwe.push({id: null, politics_post_name: "无"});
			let post = [res.data.xz, addnwe];
			setpostarr(() => [...post]);
		});
	};
	useEffect(() => {
		req();
	}, []);
	const columns = [
		{
			title: "性别",
			dataIndex: "sex",
			render: (text) => <a>{text}</a>,
		},
		{
			title: "地址",
			dataIndex: "site",
		},
		{
			title: "电话",
			dataIndex: "iphone",
		},
		{
			title: "教职工号",
			dataIndex: "teacher_id",
		},
		{
			title: "入职时间",
			dataIndex: "entry_time",
		},
		{
			title: "年龄",
			dataIndex: "age",
		},
		{
			title: "修改",
			dataIndex: "updata",
			render: () =>
				useroot.teacher_info == 0 ? (
					<Button
						onClick={(e) => {
							teacher.forEach((val, k) => {
								if (val.key == updata) {
									console.log(val);
									setmsgdata(() => val);
									showModal();
								}
							});
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

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = (e) => {
		submit.current.click();
		// setIsModalOpen(false);
		// setmsgdata(() => false)
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setmsgdata(() => false);
	};
	const onFinish = (e) => {
		let newe = e;
		postarr[0].forEach((val, k) => {
			if (val.name == e.admin_post) {
				newe.admin_post = val.id;
			}
		});
		filters.forEach((val) => {
			if (val.text == e.department) {
				newe.department = val.key;
			}
		});
		postarr[1].forEach((val) => {
			if (val.politics_post_name == e.politics_post) {
				newe.politics_post = val.id;
			}
		});
		if (e.room != "无") {
			newdb_z.forEach((val) => {
				if (val.bid == newe.department) {
					val.childer.forEach((son) => {
						if (son.bname == e.room) {
							newe.room = son.zid;
						}
					});
				}
			});
		} else {
			newe.room = 0;
		}
		console.log(msgdata);
		request("/index/index/updata", {data: newe}).then((res) => {
			if ((res.data.code = 200)) {
					const data = {
					sen_id: '0',
					info: `你更改了 ${msgdata.name}的个人信息`,
					serve,
					accept_id:loc.user_id,
					loop:false
				};
				getInform(data);
				const datas = {
					sen_id: loc.user_id,
					info: `更改了 你的个人信息`,
					serve,
					accept_id:msgdata.description[0].key,
					loop:true
				};
				getInform(datas);

				req();
				setIsModalOpen(false);
			}
		});
	};
	const submit = useRef(null);
	const onFinish_s = (e) => {
		if (e.state == 0) return;
		console.log(msgdata);
		request("/index/index/del_teacher_id", {teacher_id: msgdata.key, type: e.state}).then((res) => {
			console.log(res);
			if (res.data.code == 200) {
				setIsModalOpen_s(false);
				setIsModalOpen(false);
				req();
			}
		});
	};
	return (
		<div>
			{isModalOpen_s ? (
				<Modal title="教职工在校状态设置" open={isModalOpen_s} onOk={handleOk_s} onCancel={handleCancel_s}>
					<Form
						name="sdf"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 16,
						}}
						initialValues={{
							state: 0,
						}}
						onFinish={onFinish_s}
						autoComplete="off">
						<Form.Item label="是否在职" name="state">
							<Select
								options={[
									{
										value: 0,
										label: "在职",
									},
									{
										value: 1,
										label: "退休",
									},
									{
										value: 2,
										label: "离职",
									},
									{
										value: 3,
										label: "开除",
									},
									{
										value: 4,
										label: "调转",
									},
								]}
							/>
						</Form.Item>
						<Form.Item style={{display: "none"}}>
							<Button ref={submit_s_ref} type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}
			{isModalOpen ? (
				<Modal title={msgdata.name + ":基本信息"} width={800} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 19,
						}}
						initialValues={{
							name: msgdata.name,
							sex: msgdata.sex,
							admin_post: msgdata.admin_post,
							department: msgdata.department,
							politics_post: msgdata.politics_post,
							entry_time: msgdata.entry_time,
							iphone: msgdata.iphone,
							site: msgdata.site,
							card: msgdata.card,
							room: msgdata.room,
							teacher_id: msgdata.description[0].teacher_id,
						}}
						onFinish={onFinish}
						autoComplete="off">
						<Form.Item
							label="ID"
							name="teacher_id"
							rules={[
								{
									required: true,
									message: "教职工ID不能为空",
								},
							]}>
							<Input disabled={true} />
						</Form.Item>

						<Form.Item
							label="性别"
							name="sex"
							rules={[
								{
									required: true,
									message: "性别不能为空",
								},
							]}>
							<Select defaultValue="sex">
								<Option value="男">男</Option>
								<Option value="女">女</Option>
							</Select>
						</Form.Item>

						<Form.Item
							label="部门"
							name="department"
							rules={[
								{
									required: true,
									message: "部门不能为空",
								},
							]}>
							<Select
								defaultValue="请选择部门"
								onChange={(e) => {
									let arr = [];
									newdb_z.forEach((val) => {
										if (val.bname == e) {
											val.childer.forEach((son) => {
												arr.push({zid: son.zid, val: son.bname});
											});
										}
									});
									arr.push({zid: null, val: "无"});
									setmsgdke(() => [...arr]);
								}}>
								{filters.map((val, k) => (
									<Option key={val.text} value={val.text}>
										{val.text}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="科室" name="room">
							<Select
								defaultValue="无"
								onChange={(e) => {
									let newmsgdata = msgdata;
									newmsgdata.room = e;
									setmsgdata(() => {
										return {...newmsgdata};
									});
								}}>
								{msgdke.map((val, k) => (
									<Option key={val.val} value={val.val}>
										{val.val}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="行政职务" name="admin_post">
							<Select
								defaultValue="请选择职务"
								onChange={(e) => {
									let newmsgdata = msgdata;
									newmsgdata.admin_post = e;
									setmsgdata(() => {
										return {...newmsgdata};
									});
								}}>
								{postarr[0].map((val, k) => (
									<Option key={val.name} value={val.name}>
										{val.name}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="政治职务" name="politics_post">
							<Select
								disabled
								defaultValue="请选择政治职务"
								onChange={(e) => {
									let newmsgdata = msgdata;
									newmsgdata.politics_post = e;
									setmsgdata(() => {
										return {...newmsgdata};
									});
								}}>
								{postarr[1].map((val, k) => (
									<Option key={val.politics_post_name} value={val.politics_post_name}>
										{val.politics_post_name}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="入职时间"
							name="entry_time"
							// rules={[
							//     {
							//         required: true,
							//     },
							// ]}
						>
							<Space direction="vertical">
								<DatePicker
									disabled={true}
									onChange={(e) => {
										console.log(e._i);
										let newmsgdata = msgdata;
										newmsgdata.entry_time = e._i;
										setmsgdata(() => {
											return {...newmsgdata};
										});
									}}
									defaultValue={moment(msgdata.entry_time, "YYYY-MM-DD")}
									defaultPickerValue={moment(msgdata.entry_time, "YYYY-MM-DD")}
								/>
							</Space>
						</Form.Item>
						<Form.Item
							label="电话"
							name="iphone"
							rules={[
								{
									required: true,
									message: "请输入数字",
								},
							]}>
							<Input type="number" />
						</Form.Item>
						<Form.Item
							label="身份证号"
							name="card"
							rules={[
								{
									required: true,
									message: "身份证号不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="地址"
							name="site"
							rules={[
								{
									required: true,
									message: "地址不能为空",
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item label="高级">
							<Button onClick={showModal_s}>高级设置</Button>
						</Form.Item>
						<Form.Item
							style={{
								display: "none",
							}}>
							<Button ref={submit} size="large" type="primary" htmlType="submit"></Button>
						</Form.Item>
					</Form>
				</Modal>
			) : (
				false
			)}

			{showTf ? (
				<div
					style={{
						position: "relative",
					}}>
					<Table
						style={{
							backgroundColor: "white",
						}}
						rowKey="name"
						expandable={{
							expandedRowRender: (record) => (
								<Table
									rowKey="card"
									columns={columns}
									dataSource={record.description}
									pagination={false}
									onRow={(record) => {
										setcrecord(()=>record)
										return {
											onMouseEnter: (event) => {
												console.log(newdb_z);
												setipdata(() => record.key);
												let arr = [],
													str = "";
												teacher.forEach((val) => {
													if (val.description[0].teacher_id == record.key) {
														str = val.department;
													}
												});
												newdb_z.forEach((val, k) => {
													if (val.bname == str) {
														val.childer.forEach((son) => {
															arr.push({pid: son.zbid, zid: son.zid, val: son.bname});
														});
													}
												});
												arr.push({pid: null, zid: null, val: "无"});
												setmsgdke(() => [...arr]);
											}, // 点击行
										};
									}}
								/>
							),
							rowExpandable: (record) => record.name !== "Not Expandable",
						}}
						columns={[
							{
								title: "姓名",
								dataIndex: "name",
								width: "20%",
								filterMode: "tree",
								...getColumnSearchProps("name"),
							},
							{
								title: "部门",
								dataIndex: "department",
								filters: filters,
								filterMode: "tree",
								sorter: (a, b) => a.department.localeCompare(b.department),
								onFilter: (value, record) => record.department.startsWith(value),
								width: "20%",
							},
							{
								title: "科室",
								dataIndex: "room",
								filters: filters_z,
								filterMode: "tree",
								onFilter: (value, record) => record.room.startsWith(value),
								width: "20%",
							},
							{
								title: "行政职务职务",
								dataIndex: "admin_post",
								width: "20%",
							},
							{
								title: "政治职务职务",
								dataIndex: "politics_post",
								width: "20%",
							},
						]}
						dataSource={teacher}
						onChange={onChange}
					/>
					<Button
						style={{
							position: "absolute",
							bottom: "15px",
							left: "20px",
						}}
						type="primary"
						onClick={() => {
							dao();
						}}>
						导出信息到Excel
					</Button>
					{useroot.teacher_add == 0 ? (
						<Button
							style={{
								position: "absolute",
								bottom: "15px",
								left: "200px",
							}}
							type="primary"
							onClick={() => {
								path("/home/teacherAdd");
							}}>
							新增教职工
						</Button>
					) : (
						<Button
							style={{
								position: "absolute",
								bottom: "15px",
								left: "200px",
							}}
							type="primary"
							disabled>
							新增教职工
						</Button>
					)}
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
