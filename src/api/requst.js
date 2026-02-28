import axios from 'axios'
import Elmessage from 'element-plus'
const service = axios.create()
const NET_ERROR = '网络错误！！！'
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('拦截的config', config.data);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((res) => {
    console.log(res);
    const { code, data, message } = res.data
    if (code == 200) {
        return data
    } else {
        // Elmessage.error(message || NET_ERROR)
        return Promise.reject(message || NET_ERROR)
    }
});
function request(options) {
    options.method = options.method || 'get'
    return service(options)
}
export default request