import request from "../axios/request";
import timestampToTime from "./gettime";
const loc = JSON.parse(localStorage.getItem("user"));
export default function getInform({sen_id,info,serve,accept_id,loop}){
    console.log(sen_id,info,serve);
	request('/index/index/set_inform',{
        sen_id,
        accept_id,
        info,
        sen_time: timestampToTime(new Date().valueOf()),
    }).then(res=>{
        if(loop){
            serve.send(JSON.stringify({constructor: 9, data: {root: loc.group, user_id:accept_id}}));
        }else {
            serve.send(JSON.stringify({constructor: 8, data: {root: loc.group, user_id:loc.user_id}}));
        }
    })
}