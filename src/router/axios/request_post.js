import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api/project_name/public/index.php";
export default function request_post(
	url,
	data = {},
) {
	return new Promise((t, f) => {
		axios({
			method: "POST",
			url,
			data,
			headers: {"Content-Type": "application/x-www-form-urlencoded"},
		}).then((res) => t(res));
	});
}
