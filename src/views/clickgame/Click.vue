<template>
  <div class="container base playpage">
    <div class="play click_box">
      <h4 class="title play_title" @click="showid()">

        <span v-if="getCurrentLangCode == 'zh_TW'"
          >        {{ setting_secs }}秒挑戰賽</span
        >
        <span v-else>challenge in {{ setting_secs }} seconds</span>
      </h4>
      <h3>
        <span v-if="getCurrentLangCode == 'zh_TW'">最高分&nbsp;</span>
        <span v-else>Max&nbsp;</span>
        <div class="btn replay">{{ maxScore }}</div>
        <span v-if="getCurrentLangCode == 'zh_TW'">分數&nbsp;</span>
        <span v-else>Score&nbsp;</span>
        <div class="btn replay">{{ numClicks }}</div>
      </h3>
      <div v-if="!over">
        <h3 style="color: #da1a1a" v-if="getCurrentLangCode == 'zh_TW'">
          點擊圓圈 👇 👇 👇
        </h3>
        <h3 style="color: #da1a1a" v-else>Click it! 👇 👇 👇</h3>
        <div id="div1">
          <button
            type="submit"
            v-bind:style="{ 'background-color': color }"
            @click="updateCount()"
            id="clickButton"
          ></button>
        </div>

        <div class="info-board">
          <h1>
            {{ $store.state.Profile.name }}
            <br />
            <span v-if="getCurrentLangCode == 'zh_TW'">點擊了</span>
            <span v-else>clicked&nbsp;</span>
            <b>{{ numClicks }}</b>
            <span v-if="getCurrentLangCode == 'zh_TW'">次</span>
            <span v-else>&nbsp;times</span>
          </h1>
          <h2>
            <span v-if="getCurrentLangCode == 'zh_TW'">時間剩餘&nbsp;</span>
            <span v-else>remaining&nbsp;</span>
            <b style="font-size: 100px">{{ secs }}</b>
            <span v-if="getCurrentLangCode == 'zh_TW'">秒</span>
            <span v-else>&nbsp;seconds</span>
          </h2>
        </div>
      </div>
      <div v-show="over">
        <div id="status">
          <h2>Game Over</h2>
        </div>

        <div class="result-board">
          <div class="result-box">
            <div class="share_area" ref="capture">
              <img class="fb-thumb" :src="user_photo" />
              <h2>
                {{ $store.state.Profile.name }}
                <span v-if="getCurrentLangCode == 'zh_TW'"
                  >{{ setting_secs }}秒內</span
                >
                <br />
                <span v-if="getCurrentLangCode == 'zh_TW'">點擊了</span>
                <span v-else>clicked&nbsp;</span>
                <b>{{ numClicks }}</b>
                <span v-if="getCurrentLangCode == 'zh_TW'">次</span>
                <span v-else>
                  &nbsp;times
                  <br />
                  in {{ setting_secs }} seconds
                </span>
              </h2>
            </div>
          </div>
          <div class="tool-board">
            <router-link :to="{ name: 'list' }">
              <div class="btn home" v-show="over">
                <span v-if="getCurrentLangCode == 'zh_TW'">首頁</span>
                <span v-else>&nbsp;Home</span>
              </div>
            </router-link>
            <div class="btn replay" v-show="over" @click="replay()">
              {{ _T("replay") }}
            </div>
            <br />
            <br />
            <div class="btn share" v-show="over" @click="share()">
              <font-awesome-icon :icon="['fab', 'facebook-square']" />
              <span>&nbsp;{{ _T("shareFb") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { mapGetters } from "vuex";
export default {
  components: {},
  name: "Click",
  data: function () {
    return {
      event: 0,
      share_image: "",
      setting_secs: 2,
      maxScore: 0,
      over: false,
      active: false,
      numClicks: 0,
      secs: 2,
      user_photo: "",
      color: "#9bcd77",
      colors: ["#9bcd77", "#d777b0", "#fed401", "#ff2c3c", "#66c652"],
    };
  },
  computed: {
    ...mapGetters(["getCurrentLangCode", "getcount"]),
  },
  methods: {
    toDataURL: function (url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    },
    toB64() {
      //   console.log(this.Profile);
      this.toDataURL(this.$store.state.Profile.photo, (dataUrl) => {
        this.user_photo = dataUrl;
      });
    },
    toCanvas: function () {
      setTimeout(() => {
        window.scrollTo(0, 0);
        html2canvas(this.$refs.capture).then((canvas) => {
          this.share_image = canvas.toDataURL();
        });
      }, 300);
    },
    share: function () {
      window.FBInstant.shareAsync({
        intent: "SHARE",
        image: this.share_image,
        text: this.$store.state.Profile.photo + "的分享內容",
        data: {
          promotions: "games",
          params: {
            name: "click",
            times: this.setting_secs,
          },
        },
      }).then(() => {
        console.log("分享");
      });
    },
    cicle: function () {
      setInterval(() => {
        if (this.active) {
          this.secs--;
          if (this.secs == 0) {
            this.active = false;
            this.over = true;
            if (this.numClicks > this.maxScore) {
              this.maxScore = this.numClicks;
            }
            this.toCanvas();
          }
        }
      }, 1000);
      this.event = 1;
    },
    updateCount: function () {
      this.numClicks += 1;
      if (this.active == false) {
        this.secs = this.setting_secs;
        this.numClicks = 0;
        this.active = true;
      }

      if (this.event == 0) {
        this.cicle();
        this.toB64();
      }

      // if (this.numClicks % 10 == 0) {
      //   $("button").animate(
      //     { width: "-=15px", height: "-=15px" },
      //     500,
      //     "easeOutElastic",
      //     function () {}
      //   );
      // }

      this.color = this.colors[
        Math.round(Math.random() * (this.colors.length - 1))
      ];
      //   $("button").css({ backgroundColor: color });
    },
    replay() {
      this.active = false;
      this.over = false;
      this.secs = this.setting_secs;
      this.numClicks = 0;
      this._SHOW_INTERSTITIAL(() => {
        setTimeout(() => {
          this._LOAD_INTERSTITIAL();
        }, 3600);
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this._LOAD_INTERSTITIAL();
    }, 3600);
  },
  watch: {
    $route(to, from) {
      if (from.params.times !== to.params.times) {
        this._LOAD_INTERSTITIAL();
      }
    },
  },
  created() {
    this.setting_secs = this.$route.params.times || 10;
    this.secs = this.$route.params.times || 10;
  },
};
</script>
<style lang="scss" scoped>
.play {
  color: black;
}
.replay {
  border: #66c3b7 3px solid;
  font-size: x-large;
  color: #66c3b7;
  font-weight: bolder;
}

.info-board {
  margin-top: 10px;
}
.click_box {
  min-height: 360px;
}

#status {
  background: transparent;
  position: relative;
  top: 60px;
}

#status h2 {
  font-size: xxx-large;
  padding: 0px;
  margin: 0px;
}
button {
  position: relative;
  top: 10px;
  border: none;
  color: #fff;
  width: 200px;
  height: 200px;
  transition: 0.3s;
  border-radius: 50%;
  background-color: #66c3b7;
}

button:active {
  width: 190px;
  height: 190px;
}

button:focus {
  outline: none;
}
.result-board {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  display: inline-grid;
}

.share_area {
  padding: 36px 0px 36px 0px;
  width: 350px;
  margin: 2px;
}

.tool-board {
  margin-top: 2px;
}

.fb-thumb {
  max-width: 200px;
}
.gold {
  color: #66c3b7;
  font-size: xx-large;
}
.home {
  border: #8c8c85 3px solid;
  font-size: x-large;
  color: #8c8c85;
  font-weight: bolder;
  margin-right: 5px;
}
.replay {
  border: #66c3b7 3px solid;
  font-size: x-large;
  color: #66c3b7;
  font-weight: bolder;
  margin-right: 5px;
}
.share {
  border: #4267b2 3px solid;
  font-size: x-large;
  color: #4267b2;
  font-weight: bolder;
  margin-right: 5px;
}
</style>