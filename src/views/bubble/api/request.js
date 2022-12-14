import axios from 'axios';
import {
    stringify
} from 'qs';



// 讀取相關的 api
const apiRequest = axios.create({
    baseURL:"https://api.com/"
});


function interceptors(config) {
    if (config.method === 'post') {
        config.headers['Content-Type'] =
            'application/x-www-form-urlencoded';
        config.data = stringify(config.data);
    }
    return config

}
apiRequest.interceptors.request.use(interceptors, (error) => {
    return Promise.reject(error)
})


export const getLevel = data => apiRequest.post('/v1/get/level', data);
export const gameRecord = data => apiRequest.post('/v1/game/record', data);
