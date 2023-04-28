import request from "../axios/request";

const User = () => {
	return (dispatch) => {
		request("/user/account").then((res) => {
			dispatch({type: "userId", data: res.data.profile.userId});
			request("/user/follows", {uid: res.data.profile.userId}).then((res) => {
				console.log(res);
				const arr = [];
				res.data.follow.forEach((val) => {
					arr.push(val.userId);
				});
				dispatch({type: "userSinger", data: arr});
			});
			request("/likelist", {uid: res.data.profile.userId}).then((res) => {
				dispatch({type: "userLike", data: res.data.ids});
			});
		});
	};
};

const Url = (id) => {
	console.log(id, id);
	const pinzhi = JSON.parse(localStorage.getItem("set"));
	console.log(pinzhi.level[pinzhi.levelnum]);
	return (dispatch) => {
		request("/song/url/v1", {id, level: pinzhi.level[pinzhi.levelnum]}).then((res) => {
			dispatch({type: "musiceUrl", data: res.data.data[0].url});

			dispatch({type: "runTf", data: true});
		});
	};
};
const Add = (arr, k, tf = true) => {
	console.log(arr, k);
	return (dispatch) => {
		const songName = [];
		const combination = [];
		const picUrl = [];
		const singer = [];
		arr.forEach((val, k) => {
			singer.push(val.ar[0].name);
			combination.push(val.id);
			picUrl.push(val.al.picUrl);
			songName.push(val.name);
		});
		console.log(combination, songName, singer, picUrl, k);
		dispatch({type: "combination", data: combination});
		dispatch({type: "songName", data: songName});
		dispatch({type: "singer", data: singer});
		dispatch({type: "picUrl", data: picUrl});
		dispatch({type: "Index", data: k});
		tf ? dispatch({type: "runTf", data: true}) : dispatch({type: "runTf", data: false});
		dispatch({type: "runMusice", data: combination[k]});
	};
};
const Addss = (arr, k, tf = true) => {
	return (dispatch) => {
		const songName = [];
		const combination = [];
		const picUrl = [];
		const singer = [];
		arr.forEach((val, k) => {
			singer.push(val.program.dj.nickname);
			combination.push(val.program.mainSong.id);
			picUrl.push(val.program.blurCoverUrl);
			songName.push(val.program.mainSong.name);
		});
		console.log(combination, songName, singer, picUrl, k);
		dispatch({type: "combination", data: combination});
		dispatch({type: "songName", data: songName});
		dispatch({type: "singer", data: singer});
		dispatch({type: "picUrl", data: picUrl});
		dispatch({type: "Index", data: k});
		tf ? dispatch({type: "runTf", data: true}) : dispatch({type: "runTf", data: false});
		dispatch({type: "runMusice", data: combination[k]});
	};
};

export {Url, Add, Addss, User};
