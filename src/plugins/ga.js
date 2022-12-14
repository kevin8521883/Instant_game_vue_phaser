import VueAnalytics from 'vue-analytics'
import Vue from 'vue'
import router from '../router'

var isProduction = process.env.VUE_APP_MODE == 'product'
console.log('ga ready')

Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_GTAGID,
    router,
    debug: {
        enabled: !isProduction,
        sendHitTask: isProduction
    },
    autoTracking: {
        pageviewOnLoad: false
    }
})