import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api/project_name/public/index.php'
export default function request(url, params = {}) {
    return new Promise((t, f) => {
        axios({
            url,
            params
        }).then(res => t(res))
    })
}
