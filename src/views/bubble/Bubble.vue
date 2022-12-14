<template>
  <div class="container base playpage" ref="capture">
    <div
      class="play card_box pt-3 px-3 d-flex flex-column justify-content-between"
    >
      <h3 class="text-dark d-flex justify-content-around">
        <span>{{getLevel()}}Time:{{ time }} </span> <span>Points:{{ score }}</span>
      </h3>
      <div class="cover py-3" v-if="!start">
        <h2><i>O A O A</i></h2>
        <p>Click the bubble to get points！</p>
        <div class="d-flex justify-content-center align-items-center">
          <div class="bubble-introduction bubble-white"></div>
          <span class="ml-3 h3 text-left"> + 1 point</span>
        </div>
        <div class="d-flex justify-content-center align-items-center my-2">
          <div class="bubble-introduction bubble-green"></div>
          <span class="ml-3 h3 text-left"> + 3 points</span>
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="bubble-introduction bubble-red"></div>
          <span class="ml-3 h3 text-left"> - 5 points</span>
        </div>
        <button class="mt-3 btn btn-primary" @click="startGame">
          Start Game
        </button>
      </div>
      <div class="bubbles" v-else>
        <span
          @click="shut(item)"
          v-for="item in bubbleItem"
          :key="item.id"
          class="bubble"
          :class="{
            'bubble-red': item.color === 'red',
            'bubble-green': item.color === 'green',
          }"
          :style="`left:${item.x * 90}%; bottom:${item.y * 90}%`"
        ></span>
      </div>
      <div :class="['winPage', { open: isWin }]">
        <div style="text-align: center">
          <h3>
            {{ $store.state.Profile.name }}<br />
            Completed The Game<br />
            Points:{{ score }}
          </h3>

          <img class="fb-thumb" :src="user_photo" />
          <div class="mt-3">
            <!-- <h1>Successful!</h1> -->

            <h3 class="btn btn-info" @click="replay(true)">REPLAY</h3>
            &nbsp;
            <h3 class="btn btn-info share_v2" @click="share()">
              <font-awesome-icon :icon="['fab', 'facebook-square']" /> &nbsp;
              <span>SHARE</span>
            </h3>
            &nbsp;
            <!-- <h3 class="btn btn-info" @click="next()">NEXT</h3> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <Gamelist /> -->
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import api from "./api/index.js"
// import Gamelist from "../components/_Gamelist.vue";
export default {
  data() {
    return {
      start: false,
      score: 0,
      bubbleItem: [],
      index: 0,
      time: 30,
      isWin: false,
      user_photo: null,
      share_image: "null",
      url: "bubble.mp3",
      songBuffer: null,
      timeoutID: null,
      level: null
    };
  },
  computed: {
    Profile() {
      return this.$store.state.Profile;
    },
  },
  created() {
    this.toB64();
    this._LOAD_INTERSTITIAL();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.getBuffer(this.url);
  },
  components: {
    // Gamelist,
  },
  methods: {
    getLevel(){
     return  api.apiGetData();
    },
    playAudio(songBuffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = songBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    },
    getBuffer(url) {
      const request = new XMLHttpRequest();
      return new Promise((resolve, reject) => {
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
          this.audioContext.decodeAudioData(request.response, (buffer) => {
            this.songBuffer = buffer;
          });
        };
        request.onerror = (error) => reject(error);
        request.send();
      });
    },
    gameInit() {
      this.start = true;
      this.time = 30;
      this.score = 0;
      this.bubbleItem = [];
      this.timeoutID = setInterval(() => this.bubbleCreate(), 300);
    },
    startGame() {
      this.gameInit();
      for (let i = 1; i <= 30; i++) {
        setTimeout(() => {
          this.time--;
          if (this.time === 0) {
            this.isWin = true;
            window.clearInterval(this.timeoutID);
            this.toCanvas();
          }
        }, 1000 * i);
      }
    },
    bubbleCreate() {
      let point;
      let color;
      if (this.index % 7 === 0 && this.index != 0) {
        point = 3;
        color = "green";
      } else if (this.index % 13 === 0 && this.index != 0) {
        point = -5;
        color = "red";
      } else {
        point = 1;
        color = "white";
      }
      let data = {
        id: this.index,
        x: Math.random(),
        y: Math.random(),
        point: point,
        color: color,
      };
      this.bubbleItem.push(data);
      this.index++;
    },
    bubbleDelete() {
      this.bubbleItem.splice(0, 1);
    },
    shut(item) {
      this.playAudio(this.songBuffer);
      this.score += item.point;
      let index = this.bubbleItem.findIndex((element) => {
        return element.id === item.id;
      });
      this.bubbleItem.splice(index, 1);
    },
    replay(show_ad) {
      this.isWin = false;
      this.start = false;
      this.score = 0;
      if (show_ad) {
        this._SHOW_INTERSTITIAL(() => {
          setTimeout(() => {
            this._LOAD_INTERSTITIAL();
          }, 3600);
        });
      }
    },
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
            name: "bubble",
          },
        },
      }).then(() => {
        console.log("分享");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bubbles,
.cover {
  min-height: 300px;
  background-color: black;
  position: relative;
  overflow: hidden;
  // padding-bottom: 80%;
}
.bubble-introduction {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: relative;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    transform: scale(0.25) translate(-70%, -70%);
    background: radial-gradient(#fff, transparent);
  }
}
.bubble-white {
  box-shadow: inset 0 0 40px rgba(255, 255, 255) !important;
}
.bubble-green {
  box-shadow: inset 0 0 40px rgb(33, 230, 99) !important;
}
.bubble-red {
  box-shadow: inset 0 0 40px rgb(202, 13, 13) !important;
}
.bubble {
  cursor: pointer;
  box-shadow: inset 0 0 40px rgba(255, 255, 255);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  animation: fadeIn linear;
  animation-duration: 6.3s;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    transform: scale(0.25) translate(-70%, -70%);
    background: radial-gradient(#fff, transparent);
  }
}
.winPage {
  z-index: 200;
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  // align-items: center;
  transition: top 0.3s;
  // padding-top: 50px;
  overflow: auto;
}
.winPage.open {
  top: 50px;
}
.fb-thumb {
  max-width: 260px;
  border: 1px dashed white;
  padding: 3px;
}
.share_v2 {
  color: white;
  background: #4267b2 !important;
  border: #4267b2 1px solid;
}
@keyframes fadeIn {
  0% {
    height: 0px;
    width: 0px;
    opacity: 1;
  }
  1% {
    height: 50px;
    width: 50px;
  }
  // 99% {
  //   opacity: 1;
  // }
  // 100% {
  //   opacity: 1;
  // }
}
</style>
