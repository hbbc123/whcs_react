import {useState, useEffect} from "react";
import css from "../educational/css/Distribution.module.css";
import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons";
import {Table, Spin, Button, Modal, message, Form, Input, Select, notification} from "antd";
import request from "../../../axios/request";
import Overviewcss from "./css/Overviewcss.module.css";
import {useRef} from "react";
import * as echarts from "echarts/core";
import {TitleComponent, TooltipComponent, LegendComponent} from "echarts/components";
import {PieChart} from "echarts/charts";
import {LabelLayout} from "echarts/features";
import {CanvasRenderer} from "echarts/renderers";
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
		}}
		spin
	/>
);
const select_data=[
	{
		value: 0,
		label: "学校部门人数总览图",
	},
	{
		value: 1,
		label: "学校教职工性别统计图",
	},
	{
		value: 2,
		label: "学校教职工工龄",
	},
]
const option = {
	title: {
		text: '',
		subtext: "Fake Data",
		left: "center",
	},
	tooltip: {
		trigger: "item",
	},
	series: [
		{
			name: "",
			type: "pie",
			radius: "50%",
			data:[],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: "rgba(0, 0, 0, 0.5)",
				},
			},
		},
	],
};
export default function Overview() {
	const [showtf, setshowTf] = useState(true);
	const [select, setselect] = useState(0);
	const department_num_box_ref = useRef(null);
	const handleChange = (e) => {
		setselect(()=>e)
		read(e)
	};

	const read=(type)=>{
		const myChart = echarts.init(department_num_box_ref.current);
		request("/index/index/overview_department",{id:type}).then((res) => {
			console.log(res);
			console.log(select_data[type]);
			option.title.text=select_data[type].label
			option.title.subtext = "总人数" + res.data.zong[0].zong + "人";
			option.series[0].data = res.data.data;
			option.series[0].name =select_data[type].label ;
			option && myChart.setOption(option);
		});
	}
	useEffect(() => {
		read(select)
	}, []);
	return (
		<div>
			{showtf ? (
				<div
					style={{
						backgroundColor: "white",
					}}>
							<Select
							defaultValue={0}
							onChange={handleChange}
							options={select_data}
						/>
					<div ref={department_num_box_ref} className={Overviewcss.department_num_box}></div>
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
