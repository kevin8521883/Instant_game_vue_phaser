import axios from 'axios';
import {
    stringify
} from 'qs';



// 讀取相關的 api
const readRequest = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});
// 寫入資料相關的 api
const writeRequest = axios.create({
    baseURL: process.env.VUE_APP_API_URL_W
});

function interceptors(config) {
    if (config.method === 'post') {
        config.headers['Content-Type'] =
            'application/x-www-form-urlencoded';
        config.data.app = process.env.VUE_APP_VER;
        config.data = stringify(config.data);
    }
    return config
}
readRequest.interceptors.request.use(interceptors, (error) => {
    return Promise.reject(error)
})

writeRequest.interceptors.request.use(interceptors, (error) => {
    return Promise.reject(error)
})


export const apiUserLogin = data => writeRequest.post('/v1/player/reg', data);
export const apiGameList = data => readRequest.post('/v1/play/load', data);