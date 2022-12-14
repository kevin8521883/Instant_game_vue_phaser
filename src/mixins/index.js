import { lans } from "../plugins/language.js";

import FunfunApi from "../api/funfunquiz";

export const MyMixins = {
  data() {
    return {
      editorcnt: 0,
      ver: process.env.VUE_APP_VER,
      LanguageInfo: lans(),
      buttom: false,
      item_now: null,
      max_height: 0,
      info: {
        item: null,
      },
    };
  },
  computed: {
    _GAMES_LIST_DATA() {
      return this.$store.state.funfunquiz.games_list.filter((item) => {
        if (this.$store.state.funfunquiz.game.id) {
          return (
            this.$store.state.funfunquiz.played.indexOf(item.id) === -1 &&
            this.$store.state.funfunquiz.game.id !== item.id
          );
        }
        return this.$store.state.funfunquiz.played.indexOf(item.id) === -1;
      });
    },
    _GAMES_LIST_COUNT() {
      return this._GAMES_LIST_DATA.length;
    },
  },
  methods: {
    _APPINIT: async function() {
      return (window.onload = async () => {
        let FB = window.FBInstant;
        await FB.initializeAsync();
        const entryPoint = FB.getEntryPointData();

        let Profile = {
          name: FB.player.getName(),
          id: FB.player.getID(),
          locale: FB.getLocale(),
          photo: FB.player.getPhoto() ? FB.player.getPhoto() : "nophoto.jpg",
        };

        //entryPoint寫到store
        this._DP("SET_ENTRY_POINT", entryPoint);
        //會員資料寫到store
        this._DP("SET_PROFILE", Profile);

        //會員註冊並取得設定
        let res = await FunfunApi.userLogin(Profile);
        if (res) {
          this._DP("SET_APP_CONFIG", res.config);
          this._DP("SET_PROFILE", res.Profile);
        }
        await FunfunApi.gameLoad();
        // this.$router.push({
        //   name: "cardgame",
        // });
        return await window.FBInstant.startGameAsync();
        // return new Promise((resolve) => {
        //     resolve({});
        // });
      });
    },
    _DP(e, v) {
      this.$store.dispatch(e, v);
    },
    _T(search) {
      let lan = this.$store.state.language.code;
      return this.LanguageInfo[lan]
        ? this.LanguageInfo[lan][search]
        : this.LanguageInfo["en"][search];
    },
    _FBQ(event) {
      if (process.env.VUE_APP_MODE == "product") {
        // this.$analytics.fbq.event(event);
        console.log(event);
      }
    },
    _BEFORE_AD(item) {
      // let confirmed = this.$store.state.app_config.enter_confirm;
      let confirmed = 0;

      if (confirmed == "1") {
        this._DP("SET_PLAY_GAME", item);
        this.$router.push({
          name: "play",
          params: {
            id: item.id,
          },
        });
      } else {
        this.item_now = item;
        this.$refs["modal-sure"].show();
      }
    },
    _ADD_PLAYED: function(id) {
      if (process.env.VUE_APP_MODE == "product") {
        this._DP("ADD_PLAYED", id);
      }
      if (this._GAMES_LIST_COUNT <= 10) {
        this._NEXTPAGE();
      }
    },
    _LOAD_REWARDVIDEO() {
      console.log("REWARDVIDEO LOAD");
      if (window.isPreloadReward) return false;
      window.FBInstant.getRewardedVideoAsync(process.env.VUE_APP_ADID1)
        .then(function(rewarded) {
          window.preloadedRewardedVideo = rewarded;
          window.isPreloadReward = true;
          return window.preloadedRewardedVideo.loadAsync();
        })
        .then(function() {})
        .catch(function(err) {
          console.log(err.message);
        });
    },
    _LOAD_INTERSTITIAL() {
      if (window.isPreloadInter) return false;
      window.FBInstant.getInterstitialAdAsync(process.env.VUE_APP_ADID2)
        .then(function(interstitial) {
          window.preloadedInterstitial = interstitial;
          window.isPreloadInter = true;
          return window.preloadedInterstitial.loadAsync();
        })
        .then(function() {
          console.log("btn-interstitial");
        })
        .catch(function(err) {
          console.log("Interstitial failed to preload: " + err.message);
        });
    },
    _SHOW_REWARDVIDEO(callback) {
      if (!window.isPreloadReward) return false;
      window.preloadedRewardedVideo
        .showAsync()
        .then(() => {
          // Perform post-ad success operation
          window.isPreloadReward = false;
          if (callback) {
            callback();
          }
        })
        .catch((e) => {
          window.isPreloadReward = false;
          console.log(e.message);
        });
    },
    _SHOW_INTERSTITIAL(callback) {
      if (!window.isPreloadInter) return false;
      window.preloadedInterstitial
        .showAsync()
        .then(() => {
          window.isPreloadInter = false;
          if (callback) {
            callback();
          }
        })
        .catch((e) => {
          window.isPreloadInter = false;
          console.log(e.message);
        });
    },
  },
};
