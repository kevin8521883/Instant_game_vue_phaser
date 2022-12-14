import VueLazyload from 'vue-lazyload'
import Vue from 'vue'


var image_loading_waiting = 'loading-waiting.jpg';
var image_loading_error = 'loading-error.jpg';

if (process.env.VUE_APP_IMGLOADING_STYLE !== 'base') {
    image_loading_waiting = process.env.VUE_APP_IMGLOADING_STYLE + '-' + image_loading_waiting;
    image_loading_error = process.env.VUE_APP_IMGLOADING_STYLE + '-' + image_loading_error;
}

Vue.use(VueLazyload, {
    preLoad: 2.0,
    error: require('../assets/img/' + image_loading_error),
    loading: require('../assets/img/' + image_loading_waiting),
    attempt: 1
})