import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Init",
    component: () => import(/* webpackChunkName: "Play" */ "../views/Init.vue"),
    meta: {
      title: "初始化遊戲頁面",
    },
  },
  {
    path: "/list",
    name: "list",
    component: () =>
      import(/* webpackChunkName: "Play" */ "../views/funfunquiz/List.vue"),
    meta: {
      title: "遊戲列表頁",
    },
  },
  {
    path: "/dev",
    name: "dev",
    component: () =>
      import(/* webpackChunkName: "Editor" */ "../views/funfunquiz/Dev.vue"),
    meta: {
      title: "設定頁",
    },
  },
  {
    path: "/play/:id",
    name: "play",
    component: () =>
      import(/* webpackChunkName: "Play" */ "../views/funfunquiz/Play.vue"),
    meta: {
      title: "遊戲頁",
    },
  },
  {
    path: "/play/:id",
    name: "play",
    component: () =>
      import(/* webpackChunkName: "Play" */ "../views/funfunquiz/Play.vue"),
    meta: {
      title: "遊戲頁",
    },
  },
  {
    path: "/clickgame",
    name: "clickgame",
    component: () =>
      import(
        /* webpackChunkName: "clickgame" */ "../views/clickgame/Click.vue"
      ),
    meta: {
      title: "clickgame",
    },
  },
  {
    path: "/phaser_demo",
    name: "phaser_demo",
    component: () =>
      import(
        /* webpackChunkName: "phaserDemo" */ "../views/phaser_demo/index.vue"
      ),
    meta: {
      title: "phaser_demo",
    },
  },
  {
    path: "/bubble",
    name: "bubble",
    component: () =>
      import(/* webpackChunkName: "phaserDemo" */ "../views/bubble/Bubble.vue"),
    meta: {
      title: "bubble",
    },
  },
  {
    path: "/cardgame/:topic?",
    name: "cardgame",
    component: () =>
      import(/* webpackChunkName: "card"*/ "../views/cardgame/CardGame.vue"),
    meta: {
      title: "cardgame",
    },
  },
  {
    path: "/memory",
    name: "memory",
    component: () =>
      import(/* webpackChunkName: "card"*/ "../views/memory/Memory.vue"),
    meta: {
      title: "memory",
    },
  },
  {
    path: "/slither-io",
    name: "slither-io",
    component: () =>
      import(/* webpackChunkName: "card"*/ "../views/slither-io/index.vue"),
    meta: {
      title: "slither-io",
    },
  },
  {
    path: "/Connector",
    name: "Connector",
    component: () =>
      import(/* webpackChunkName: "card"*/ "../views/Connector/index.vue"),
    meta: {
      title: "Connector",
    },
  },
  {
    path: "/Omicronian",
    name: "Omicronian",
    component: () =>
      import(/* webpackChunkName: "card"*/ "../views/Omicronian/index.vue"),
    meta: {
      title: "Omicronian",
    },
  },
];
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + "(" + router.currentRoute.path + ")";
  }
  next();
});

export default router;
