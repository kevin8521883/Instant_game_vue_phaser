import Vue from 'vue'
import VueGtm from 'vue-gtm'
import router from "../router";

let isProduction = process.env.VUE_APP_MODE == 'product'
console.log('gtm ready' + process.env.VUE_APP_GTMID)
Vue.use(VueGtm, {
    // container id
    id: process.env.VUE_APP_GTMID,
    // enable track or not (optional)
    enabled: isProduction,
    // display console logs debugs or not (optional)
    debug: false,
    vueRouter: router,
})