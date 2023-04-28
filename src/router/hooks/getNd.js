export default function getNd(){
    const date = new Date()
    const month = date.getMonth()+1
    const year = (date.getFullYear()+'').slice(2);
    let dateTime;
    if(month>=8||month<=2){
        dateTime=2
    }else {
        dateTime=1
    }
    return parseInt(222)
}