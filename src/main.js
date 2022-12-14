import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import "./bootstrap";
import "./assets/funfunquiz/common.scss";
import "./assets/funfunquiz/navbar.scss";
import "./assets/theme.scss";

import "./plugins/axios.js";
import "./plugins/fortawesome.js";
import "./plugins/loading.js";
import { MyMixins } from "./mixins/index.js";

window.imageCache = [];
Vue.directive("imgUrl", function(el, binding) {
  let fetch_url = binding.value;
  let caches = window.imageCache;
  let len = window.imageCache.length;
  let cache_URL = false;
  for (let i = 0; i < len; i++) {
    // console.log(url + "=> " + caches[i].url);
    if (caches[i].url && fetch_url == caches[i].url) {
      cache_URL = caches[i].cache_url;
      break;
    }
  }
  if (cache_URL) {
    el.src = cache_URL;
    return;
  }

  fetch(fetch_url)
    .then((response) => {
      return response.blob();
    })
    .then((myBlob) => {
      if (myBlob.size <= 0) {
        el.src = "loading-sq.png";
        return;
      }
      let url = URL.createObjectURL(myBlob);
      el.src = url;
      window.imageCache.push({
        url: fetch_url,
        cache_url: url,
      });
    })
    .catch(() => {
      el.src = "loading-sq.png";
    });
});

Vue.mixin(MyMixins);
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
