import Vue from 'vue'
import {
    NavbarPlugin,
    ModalPlugin,
    IconsPlugin
} from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Install BootstrapVue
Vue.use(NavbarPlugin)
Vue.use(ModalPlugin)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)