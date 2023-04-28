import request from "../../../axios/request";
import logo from './img/640.gif'
export default function Head() {
	console.log();
	return (
		<div
			style={{
				backgroundColor: "white",
			}}>
			<img src={logo}
			style={{
				display:'block',
				white:'20vw',
				height:'20vh',
				marginTop:'20vh'
			}}
			/>
		</div>
	);
}
