import Vue from 'vue'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    faUserSecret,
    faRedo,
    faFire,
    faFilm
} from '@fortawesome/free-solid-svg-icons'
import {
    faFacebookF,
    faFacebookSquare,
} from '@fortawesome/free-brands-svg-icons'
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faFacebookF, faFacebookSquare, faRedo, faFire, faFilm)

Vue.component('font-awesome-icon', FontAwesomeIcon)