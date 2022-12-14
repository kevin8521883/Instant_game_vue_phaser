<template>
  <div class="container base playpage">
    <div class="play puzzle_box" ref="capture">
      <h4 class="title play_title">
        <span v-show="!isWin">Completing the Puzzle </span>
      </h4>
      <div :class="['wait', { done: isWin }]">
        <ul>
          <li
            v-for="(item, i) in massPuzzle"
            :key="item.idx"
            @click="puzzleMove(item, i)"
          >
            <img :src="item.url" alt="" />
          </li>
        </ul>
      </div>
      <br />
      <span> </span>
      <br />
      <div :class="'carried ' + game_type">
        <ul>
          <li
            v-for="(item, i) in workPuzzle"
            :key="item.idx"
            @click="puzzleMoveBack(item, i)"
          >
            <img :src="item.url" alt="" />
          </li>
        </ul>
      </div>
      <div>
        <!--
        <router-link to="/list"
          ><div class="btn btn-info">MENU</div>
        </router-link>-->
        <!--
        &nbsp;
        <div class="btn btn-info" @click="replay(false)">REPLAY</div>-->
      </div>

      <div :class="['winPage', { open: isWin }]">
        <div style="text-align: center; margin-top: -200px">
          <h3>
            {{ $store.state.Profile.name }}<br />
            completed the puzzle<br />
            difficult: {{ game_type }}
          </h3>

          <img class="fb-thumb" :src="user_photo" />
          <h1>Successful!</h1>
          <div>
            <h3 class="btn btn-info" @click="replay(true)">REPLAY</h3>
            &nbsp;
            <h3 class="btn btn-info share_v2" @click="share()">
              <font-awesome-icon :icon="['fab', 'facebook-square']" /> &nbsp;
              <span>SHARE</span>
            </h3>
            &nbsp;
            <h3 class="btn btn-info" @click="next()">NEXT</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- <Gamelist /> -->
  </div>
</template>

<script>
import html2canvas from "html2canvas";
// import { mapGetters } from "vuex";
// import Gamelist from "../components/Funfunquiz/_Gamelist.vue";
export default {
  components: {
    // Gamelist,
  },
  data() {
    return {
      user_photo: "",
      share_image: "",
      game_type: "easy",
      winIdx: 0,
      isWin: false,
      massPuzzle: [],
      workPuzzle: [],
    };
  },
  computed: {
    // ...mapGetters(["currentLangCode"]),
  },
  created() {
    // this._APPINIT();
    this.game_type = this.$route.params.id || "easy";
    // console.log(this.game_type);
    this.set_init();
    this.toB64();
    setTimeout(() => {
      this._LOAD_INTERSTITIAL();
    }, 3600);
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
      console.log("share");
      window.FBInstant.shareAsync({
        intent: "SHARE",
        image: this.share_image,
        text: this.$store.state.Profile.photo + "的分享內容",
        data: {
          promotions: "games",
          params: {
            name: "puzzle",
            id: this.game_type,
          },
        },
      }).then(() => {
        console.log("分享");
      });
    },
    set_init() {
      let setting = {
        easy: [
          {
            idx: 1,
            url: "https://i.imgur.com/0kCxGfj.png",
          },
          {
            idx: 2,
            url: "https://i.imgur.com/nNA2IHt.png",
          },
          {
            idx: 3,
            url: "https://i.imgur.com/zo7QXq7.png",
          },
          {
            idx: 4,
            url: "https://i.imgur.com/ToP96gT.png",
          },
          {
            idx: 5,
            url: "https://i.imgur.com/SDkYulb.png",
          },
          {
            idx: 6,
            url: "https://i.imgur.com/f7dU45L.png",
          },
          {
            idx: 7,
            url: "https://i.imgur.com/9iJVC7s.png",
          },
          {
            idx: 8,
            url: "https://i.imgur.com/V6Cywqc.png",
          },
          {
            idx: 9,
            url: "https://i.imgur.com/iQz9Zgb.png",
          },
        ],
        normal: [
          {
            idx: 1,
            url: "https://i.imgur.com/mvWfsSh.png",
          },
          {
            idx: 2,
            url: "https://i.imgur.com/OJfjuKB.png",
          },
          {
            idx: 3,
            url: "https://i.imgur.com/KCN7NJO.png",
          },
          {
            idx: 4,
            url: "https://i.imgur.com/zZfIV7d.png",
          },
          {
            idx: 5,
            url: "https://i.imgur.com/dnGXqnM.png",
          },
          {
            idx: 6,
            url: "https://i.imgur.com/5k76iss.png",
          },
          {
            idx: 7,
            url: "https://i.imgur.com/9Gsr87Z.png",
          },
          {
            idx: 8,
            url: "https://i.imgur.com/7tsDdLF.png",
          },
          {
            idx: 9,
            url: "https://i.imgur.com/Qqqhrcy.png",
          },
        ],
        hard: [
          {
            idx: 1,
            url: "https://i.imgur.com/Dlt6c7p.png",
          },
          {
            idx: 2,
            url: "https://i.imgur.com/P5V4sh4.png",
          },
          {
            idx: 3,
            url: "https://i.imgur.com/xQX58KC.png",
          },
          {
            idx: 4,
            url: "https://i.imgur.com/gIxJloR.png",
          },
          {
            idx: 5,
            url: "https://i.imgur.com/KA84fKk.png",
          },
          {
            idx: 6,
            url: "https://i.imgur.com/Sx5SyFE.png",
          },
          {
            idx: 7,
            url: "https://i.imgur.com/meDdKko.png",
          },
          {
            idx: 8,
            url: "https://i.imgur.com/zxZ3O4P.png",
          },
          {
            idx: 9,
            url: "https://i.imgur.com/bEXOTz9.png",
          },
        ],
      };
      let set = [];
      this.workPuzzle = [];
      switch (this.game_type) {
        case "easy":
          set = setting[this.game_type];
          // set = this.dataShuffle(set);
          break;
        case "normal":
          set = setting[this.game_type];
          set = this.dataShuffle(set);
          break;
        case "hard":
          set = setting[this.game_type];
          set = this.dataShuffle(set);
          break;
      }
      this.massPuzzle = set;
    },
    next() {
      let nextone = "easy";

      if (this.game_type == "easy") nextone = "normal";
      if (this.game_type == "normal") nextone = "hard";
      if (this.game_type == "hard") nextone = "easy";
      this._SHOW_INTERSTITIAL();
      console.log(this.game_type);
      console.log(nextone);
      this.$router.push({
        name: "puzzle",
        params: { id: nextone },
      });
    },
    replay(show_ad) {
      this.isWin = false;
      this.set_init();
      // this.puzzleShuffle();
      if (show_ad) {
        this._SHOW_INTERSTITIAL(() => {
          setTimeout(() => {
            this._LOAD_INTERSTITIAL();
          }, 3600);
        });
      }
    },
    puzzleMove: function (item, i) {
      this.workPuzzle.push(item);
      this.massPuzzle.splice(i, 1);
    },
    puzzleMoveBack: function (item, i) {
      this.massPuzzle.push(item);
      this.workPuzzle.splice(i, 1);
      this.winIdx--;
      if (this.winIdx <= 0) {
        this.winIdx = 0;
      }
    },
    puzzleShuffle() {
      this.massPuzzle = this.dataShuffle(this.massPuzzle);
    },
    dataShuffle(data) {
      return data.sort(() => Math.random() - 0.5);
    },
  },
  watch: {
    workPuzzle: {
      handler: function (imgItem) {
        this.winIdx = 0;
        imgItem.forEach((el, idx) => {
          if (el.idx === idx + 1) {
            this.winIdx++;
          }
        });
      },
      deep: true,
    },
    winIdx: function (i) {
      if (i === 9) {
        setTimeout(() => {
          this.isWin = true;
          this.toCanvas();
        }, 300);
      }
    },
    $route(to, from) {
      if (from.params.id !== to.params.id) {
        this.game_type = this.$route.params.id || "easy";
        this.replay();
        this._LOAD_INTERSTITIAL();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.puzzle_box > div > ul {
  padding: 0px;
}
.puzzle_box > div > ul > li {
  cursor: pointer;
  display: block;
  // width: 110px;
  // height: 110px;
  width: 83px;
  height: 83px;
  border: 1px solid #fff;
  float: left;
}
.puzzle_box > div > ul > li > img {
  display: block;
  width: 100%;
  height: 100%;
}
.wait {
  // width: 330px;
  // height: 330px;
  width: 250px;
  height: 250px;
  display: inline-flex;
  background: white;
}
.carried {
  width: 250px;
  height: 250px;
  display: inline-block;
  //-webkit-filter: grayscale(50);
  background-size: cover;
}
.carried.easy {
  background-image: url("https://i.imgur.com/lIwLX4W.png");
}
.carried.normal {
  background-image: url("https://i.imgur.com/hUrmbyU.jpg");
}
.carried.hard {
  background-image: url("https://i.imgur.com/RsGp6ud.jpg");
}
.fb-thumb {
  max-width: 260px;
  border: 1px dashed white;
  padding: 3px;
}
.winPage {
  position: fixed;
  top: -100%;
  padding-top: 100px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: top 0.3s;
}
.done {
  background: #164370;
}
.winPage.open {
  top: 0;
}

.winPage > h1 {
  color: #fff;
  font-size: 60px;
}

.share_v2 {
  color: white;
  background: #4267b2 !important;
  border: #4267b2 1px solid;
}
.share_box {
  width: 600px;
  max-width: 100%;
  padding: 20px;
  background: #164370;
  color: white;
}
</style>
