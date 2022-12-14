import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {
    stringify
} from 'qs';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.headers['Content-Type'] =
            'application/x-www-form-urlencoded';
        config.data.app = process.env.VUE_APP_VER;
        config.data = stringify(config.data);
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
Vue.use(VueAxios, axios)