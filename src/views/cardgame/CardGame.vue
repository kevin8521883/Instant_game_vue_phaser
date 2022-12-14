<template>
  <div class="container-fluid base playpage" ref="capture">
    <!-- <div
      v-if="!playgame"
      class="play start_box px-3"
      :style="
        `backgroundImage:url(${require(`@/assets/cardGame/${ver}/cover.png`)})`
      "
    >
      <div class="preload"></div>
      <h3 class="btn-start" @click="playGame">PLAY</h3>
    </div> -->
    <div
      class="play card_box px-3 d-flex flex-column"
      :style="`backgroundImage:url(${require(`@/assets/cardGame/${ver}/background/` +
        cardBackground[bg_random])})`"
    >
      <div class="preload"></div>
      <h1 class="combo" v-if="combo">combo{{ combo_num - 1 }}</h1>
      <div class="header row">
        <div class="time col-6">
          Time
          <span class="time-now"
            >{{ timer.minutes }}:{{ timer.seconds
            }}<span v-if="increase" class="increase">+10s</span>
            <span v-if="decrease" class="decrease">-10s</span></span
          >
        </div>
        <div class="score col-6">Score {{ score }}</div>
      </div>
      <div v-if="transition" class="level">LEVEL{{ level + 1 }}</div>
      <div v-else class="wrapper mt-3">
        <div v-if="start" class="start-page">
          <div class="reciprocal">
            {{ reciprocal_count }}
          </div>
        </div>
        <div v-if="!isWin && !showRank" class="row">
          <div
            v-for="card in memoryCards"
            class="mb-3 flip-container p-0"
            :key="card.id"
            @click="flipCard(card)"
            :class="{
              flipped: card.isFlipped,
              'col-6': gameType === 1,
              'col-4': gameType === 2 || gameType === 3,
              'col-3': gameType === 4 || gameType === 5,
            }"
          >
            <div
              v-if="card.img"
              class="memorycard"
              :class="{ matched: card.isMatched }"
            >
              <div class="back d-flex justify-content-center">
                <div
                  class="card-open"
                  :style="`backgroundImage:url(${require(`@/assets/cardGame/${ver}/card/` +
                    card.img)})`"
                >
                  <img
                    v-if="card.isMatched"
                    class="success-icon"
                    width="40"
                    :src="require(`@/assets/cardGame/common/success.png`)"
                    alt=""
                  />
                </div>
                <!-- <img width="60" height="90" :src="`${card.img}`" /> -->
              </div>
              <div class="front w-100 d-flex justify-content-center">
                <div
                  class="card-open"
                  :style="`backgroundImage:url(${require(`@/assets/cardGame/${ver}/card/back.png`)})`"
                ></div>
                <!-- <img
                  width="60"
                  height="90"
                  :src="require(`@/assets/cardGame/${ver}/card/back.png`)"
                /> -->
              </div>
            </div>
          </div>
        </div>
        <div class="win-page" v-if="isWin && !showRank">
          <div class="win-box">
            <img
              class="score-icon"
              :src="require(`@/assets/cardGame/common/score.png`)"
              alt=""
            />
            <img
              class="fireworks"
              :src="require(`@/assets/cardGame/common/fireworks.gif`)"
              alt=""
              :class="{ 'd-none': !showFireworks }"
            />
            <ul>
              <li class="win-result">
                <div class="w-50">
                  <span>High</span><br />
                  <span class="half-background">Combo</span>
                </div>
                <span class="number">{{ max_combo }}</span>
              </li>
              <li class="win-result my-3">
                <div class="w-50">
                  <span>High</span><br />
                  <span class="half-background">Level</span>
                </div>
                <span class="number">{{ level }}</span>
              </li>
              <li class="win-result">
                <div class="w-50">
                  <span>Total</span><br />
                  <span class="half-background">Score</span>
                </div>
                <span class="number">{{ score }}</span>
              </li>
            </ul>
          </div>
          <div class="mt-2">
            <div class="d-flex justify-content-center">
              <h3 class="btn-continue btn-common" @click="gameContinue">
                <span>CONTINUE</span>
              </h3>
            </div>
            <div class="d-flex justify-content-center">
              <h3 class="btn-share btn-common" @click="share()">
                <span>SHARE</span>
              </h3>
            </div>
          </div>
        </div>
        <div class="share-page" v-if="showRank">
          <div class="share-box">
            <img
              class="rank-icon"
              :src="require(`@/assets/cardGame/common/rank.png`)"
              alt=""
            />
            <div v-show="loading" class="lds-dual-ring"></div>
            <ul v-show="!loading">
              <li
                v-for="item in rank"
                class="pt-3"
                :key="item.getRank()"
                :class="{ borderTop: item.getRank() != 1 }"
              >
                <div v-if="item.getRank() <= 3">
                  <div class="d-flex winner" v-if="item.getRank() === 1">
                    <div class="w-50 winner-img">
                      <img class="leaderboard-winner-img" :src="item.photo" />
                      <img
                        class="winner-icon"
                        :src="require(`@/assets/cardGame/common/winner.png`)"
                      />
                    </div>
                    <div class="w-50 text-center">
                      <div>
                        <span>No.{{ item.getRank() }}</span>
                        <p class="text-orange">
                          {{ item.getPlayer().getName() }}
                        </p>
                      </div>
                      <div class="d-flex">
                        <div class="w-50">
                          <span>LEVEL</span>
                          <p class="text-orange">{{ item.getExtraData() }}</p>
                        </div>
                        <div class="w-50">
                          <span>SCORE</span>
                          <p class="text-orange">{{ item.getScore() }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex" v-else>
                    <div class="w-25">
                      <img class="leaderboard-img" :src="item.photo" />
                    </div>
                    <div class="w-25">
                      <span>No.{{ item.getRank() }}</span>
                      <p class="text-orange">
                        {{ item.getPlayer().getName() }}
                      </p>
                    </div>
                    <div class="w-25">
                      <span>LEVEL</span>
                      <p class="text-orange">{{ item.getExtraData() }}</p>
                    </div>
                    <div class="w-25">
                      <span>SCORE</span>
                      <p class="text-orange">{{ item.getScore() }}</p>
                    </div>
                  </div>
                </div>
              </li>
              <li
                v-for="(item, index) in filterMe"
                :key="index"
                class="rank-me mt-3 pt-2"
              >
                <div class="d-flex">
                  <div class="w-25">
                    <img class="leaderboard-img" :src="item.photo" />
                  </div>
                  <div class="w-25">
                    <span>No.{{ item.getRank() }}</span>
                    <p class="text-white">
                      {{ item.getPlayer().getName() }}
                    </p>
                  </div>
                  <div class="w-25">
                    <span>LEVEL</span>
                    <p class="text-white">{{ item.getExtraData() }}</p>
                  </div>
                  <div class="w-25">
                    <span>SCORE</span>
                    <p class="text-white">{{ item.getScore() }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="!loading" class="mt-2 d-flex">
            <div class="d-flex justify-content-center w-50">
              <h3 class="btn-share btn-common" @click="share()">
                <span>SHARE</span>
              </h3>
            </div>
            <div class="d-flex justify-content-center w-50">
              <h3 class="btn-replay btn-common" @click="replay(true)">
                <span>REPLAY</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <Canvas
      class="w-100"
      :display="true"
      :config="canvas.config"
      :layer="canvas.layer"
      v-on:render="getCanvasbase64"
    /> -->
    <!-- <Gamelist v-if="showlist" /> -->
  </div>
</template>
<script>
import html2canvas from "html2canvas";
// import Gamelist from "@/components/_Gamelist.vue";
// import Canvas from "../components/_Canvas.vue";
// import ;
require(`@/assets/${process.env.VUE_APP_CARD}.scss`);
import { background, allCards } from "./api/level.js";
export default {
  components: {
    // Gamelist,
    // Canvas,
  },
  data() {
    return {
      // canvas: {
      //   config: {
      //     width: 600,
      //     height: 750,
      //   },
      //   layer: [
      //     {
      //       type: "img",
      //       name: "新圖層-圖片",
      //       active: false,
      //       display: true,
      //       config: {
      //         image:
      //           "https://app-files.funfunquiz.com/upload/_2021-02/e3db2fe3a617f746.png",
      //         x: 0,
      //         y: 0,
      //         width: "600",
      //         height: "750",
      //       },
      //     },
      //     {
      //       type: "txt",
      //       name: "新圖層-文字",
      //       active: "true",
      //       display: "true",
      //       config: {
      //         mode: "2",
      //         color: "#b53636",
      //         size: "48",
      //         autoSize: "30",
      //         x: "398",
      //         y: "270",
      //         w: "160",
      //         h: "60",
      //         opacity: "1",
      //         textAlign: "center",
      //         strokeText: "false",
      //         globalAlpha: "1",
      //         strokeStyle: "#fb9539",
      //         lineWidth: "12",
      //         words: "45",
      //       },
      //     },
      //     {
      //       type: "thumb",
      //       name: "新圖層-大頭貼",
      //       active: false,
      //       display: true,
      //       config: {
      //         image: "/images/nophoto.jpg",
      //         x: 39.705882352941174,
      //         y: 329.4117647058823,
      //         width: "120",
      //         height: "120",
      //       },
      //     },
      //     // {
      //     //   type: "thumb",
      //     //   name: "新圖層-大頭貼",
      //     //   active: false,
      //     //   display: true,
      //     //   config: {
      //     //     image: "/images/nophoto.jpg",
      //     //     x: 79.41176470588235,
      //     //     y: 141.17647058823528,
      //     //     width: "160",
      //     //     height: "160",
      //     //   },
      //     // },
      //     // {
      //     //   type: "thumb",
      //     //   name: "新圖層-大頭貼",
      //     //   active: false,
      //     //   display: true,
      //     //   config: {
      //     //     image: "/images/nophoto.jpg",
      //     //     x: 52.94117647058823,
      //     //     y: 455.88235294117646,
      //     //     width: "120",
      //     //     height: "120",
      //     //   },
      //     // },
      //   ],
      // },
      showlist: this.$route.params.showlist == 1 ? true : false,
      playgame: false,
      ver: process.env.VUE_APP_CARD,
      reciprocal_count: 3,
      reciprocalID: null,
      loading: false,
      timer: {
        minutes: "01",
        seconds: "00",
      },
      time_count: 60,
      timeID: null,
      increase: false,
      decrease: false,
      combo: false,
      combo_num: 0,
      max_combo: 0,
      isWin: false,
      user_photo: [],
      share_image: "null",
      gameType: 1,
      level: 0,
      score: 0,
      memoryCards: [],
      flippedCards: [],
      allCards: allCards,
      cardBackground: background,
      bg_random: 0,
      tempCards: [],
      audioContext: "",
      url: ["Flip", "Match", "unMatch"],
      Flip: null,
      Match: null,
      unMatch: null,
      showFireworks: true,
      transition: false,
      contextID: null,
      rank: [],
      showRank: false,
      img: [],
      start: false,
    };
  },
  computed: {
    filterMe() {
      return this.rank.filter((item) => {
        return (
          item.getPlayer().getID() === window.FBInstant.player.getID() &&
          item.getRank() > 3
        );
      });
    },
  },
  created() {
    console.log("ver", this.ver);
    this._LOAD_INTERSTITIAL();
    this.contextID = window.FBInstant.context.getID();
    // console.log("ID", window.FBInstant.player.getID());
    console.log("contextID", this.contextID);
    this.setSound();
    this.initCard(this.gameType);
    this.startReciprocal();
  },
  watch: {
    time_count() {
      if (this.time_count <= 0) {
        this.isWin = true;
        this.showFireworks = true;
        setTimeout(() => {
          this.showFireworks = false;
        }, 5000);
        window.clearInterval(this.timeID);
      }
    },
    isWin() {
      if (this.isWin) {
        this.setScore();
        setTimeout(() => {
          this.toCanvas();
        }, 300);
      }
    },
    start() {
      if (!this.start) {
        this.timeID = window.setInterval(() => {
          this.time_count--;
          this.timer.minutes = this.transTime(parseInt(this.time_count / 60));
          this.timer.seconds = this.transTime(this.time_count % 60);
        }, 1000);
      }
    },
    reciprocal_count() {
      if (!this.reciprocal_count) {
        this.reciprocal_count = "GO";
        window.clearInterval(this.reciprocalID);
        setTimeout(() => {
          this.start = false;
        }, 1000);
      }
    },
  },
  methods: {
    playGame() {
      this.initCard(this.gameType);
      // this.playgame = true;
      this.startReciprocal();
    },
    startReciprocal() {
      this.start = true;
      this.reciprocal_count = 3;
      if (this.reciprocal_count) {
        this.reciprocalID = window.setInterval(() => {
          this.reciprocal_count--;
        }, 1000);
      }
    },
    getCanvasbase64(base64) {
      this.share_image = base64;
      console.log(this.share_image);
    },
    setSound() {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      for (let i = 0; i < this.url.length; i++) {
        this.getBuffer(this.url[i]);
      }
    },
    transitionLevel() {
      this.getRandomInt();
      window.clearInterval(this.timeID);
      this.transition = true;
      setTimeout(() => {
        this.transition = false;
        this.next();
      }, 2000);
    },
    increaseTime() {
      this.increase = true;
      this.time_count += 10;
      setTimeout(() => {
        this.increase = false;
      }, 700);
    },
    decreaseTime() {
      this.decrease = true;
      this.time_count -= 10;
      setTimeout(() => {
        this.decrease = false;
      }, 700);
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
        request.open(
          "GET",
          require(`@/assets/cardGame/sound/${url}.wav`),
          true
        );
        request.responseType = "arraybuffer";
        request.onload = () => {
          this.audioContext.decodeAudioData(request.response, (buffer) => {
            if (url === "Flip") {
              this.Flip = buffer;
            } else if (url === "Match") {
              this.Match = buffer;
            } else if (url === "unMatch") {
              this.unMatch = buffer;
            }
          });
        };
        request.onerror = (error) => reject(error);
        request.send();
      });
    },
    transTime(num) {
      return num < 10 ? "0" + num : num;
    },
    initCard(mode) {
      // console.log(this.timeID);
      if (this.gameType < 5) {
        this.level = this.gameType;
      } else {
        this.level++;
      }
      this.timeID = null;
      this.tempCards = this.allCards[mode - 1];
      // switch (mode) {
      //   case 1:
      //     this.tempCards = this.allCards[mode - 1];
      //     break;
      //   case 2:
      //     this.tempCards = this.allCards[mode - 1];
      //     break;
      //   case 3:
      //     this.tempCards = this.allCards[mode - 1];
      //     break;
      //   case 4:
      //     this.tempCards = this.allCards[mode - 1];
      //     break;
      // }
      this.tempCards.forEach((item) => {
        this.$set(item, "isFlipped", true);
        this.$set(item, "isMatched", false);
      });
      setTimeout(() => {
        this.memoryCards.forEach((item) => {
          item.isFlipped = false;
        });
      }, 4000);
      // if (this.level) {
      // }
      let cards1 = JSON.parse(JSON.stringify(this.tempCards));
      let cards2 = JSON.parse(JSON.stringify(this.tempCards));
      this.memoryCards = [];
      this.memoryCards = this.memoryCards.concat(cards1, cards2);
      this.shuffleCards(this.memoryCards);
    },
    flipCard(card) {
      if (card.isFlipped || card.isMatched || this.flippedCards.length === 2)
        return;
      // this.$refs.audio.currentTime = 0;
      // this.$refs.audio.play();
      this.playAudio(this.Flip);
      card.isFlipped = true;
      if (this.flippedCards.length < 2) {
        this.flippedCards.push(card);
      }
      if (this.flippedCards.length === 2) {
        this.matchCard();
      }
    },
    shuffleCards(cards) {
      for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      if (cards.length === 8) {
        cards.splice(cards.length / 2, 0, { isMatched: true });
      }
      // console.log(cards);
    },
    matchCard() {
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          this.playAudio(this.Match);
        }, 200);
        this.combo_num++;
        this.getScore();
        if (this.combo_num > this.max_combo) {
          this.max_combo = this.combo_num;
        }
        if (this.combo_num > 1) {
          this.combo = true;
          this.increaseTime();
        }
        setTimeout(() => {
          this.combo = false;
          this.flippedCards.forEach((item) => {
            item.isMatched = true;
          });
          this.flippedCards = [];
          if (this.memoryCards.every((item) => item.isMatched === true)) {
            // this.toCanvas();
            this.transitionLevel();
            // this.isWin = true;
            window.clearInterval(this.timeID);
            this.memoryCards.forEach((item) => {
              this.$set(item, "isFlipped", false);
            });
          }
        }, 400);
      } else {
        setTimeout(() => {
          this.playAudio(this.unMatch);
        }, 400);
        setTimeout(() => {
          this.combo_num = 0;
          if (this.level > 5) {
            this.decreaseTime();
          }
          this.flippedCards.forEach((item) => {
            item.isFlipped = false;
            this.flippedCards = [];
          });
        }, 800);
      }
    },
    getScore() {
      if (this.combo_num - 1) {
        this.score += this.combo_num * 10;
      } else this.score += 10;
    },
    getLeaderboard() {
      window.FBInstant.getLeaderboardAsync(this.getleaderboardName())
        .then((leaderboard) => {
          console.log(leaderboard.getName());
          return leaderboard.getEntriesAsync();
        })
        .then((entries) => {
          entries.forEach((item) => {
            this.toDataURL(item.getPlayer().getPhoto(), (dataUrl) => {
              item.photo = dataUrl;
            });
          });
          this.rank = entries;
          console.log(entries);
        });
    },
    getleaderboardName() {
      if (this.contextID != null) {
        return `scoreBoard.${this.contextID}`;
      }
      return `scoreBoard.3719428518135606`;
    },
    setScore() {
      const vm = this;
      window.FBInstant.getLeaderboardAsync(this.getleaderboardName())
        .then(function (leaderboard) {
          return leaderboard.setScoreAsync(vm.score, `${vm.level}`);
        })
        .then(function (entry) {
          console.log(entry.getScore());
          console.log(entry.getExtraData());
        });
    },
    replay(show_ad) {
      this.showRank = false;
      this.combo_num = 0;
      this.flippedCards = [];
      this.gameType = 1;
      this.isWin = false;
      this.time_count = 60;
      this.score = 0;
      this.initCard(this.gameType);
      if (show_ad) {
        this.startReciprocal();
        this._SHOW_INTERSTITIAL(() => {
          setTimeout(() => {
            this._LOAD_INTERSTITIAL(() => {});
          }, 3600);
        });
      }
    },
    gameContinue() {
      if (!this.contextID) {
        this.replay(true);
      } else {
        this.loading = true;
        this.getLeaderboard();
        this.showRank = true;
        setTimeout(() => {
          this.loading = false;
          this.toCanvas();
        }, 2000);
      }
    },
    getRandomInt() {
      this.bg_random >= 4 ? (this.bg_random = 0) : this.bg_random++;
    },
    next() {
      this.combo_num = 0;
      this.startReciprocal();
      if (this.gameType < this.allCards.length) {
        this.gameType++;
      }
      console.log(this.gameType);
      // if (this.gameType === "Easy") {
      //   this.gameType = "Normal";
      // } else if (this.gameType === "Normal") {
      //   this.gameType = "Hard";
      // } else if (this.gameType === "Hard") {
      //   this.gameType = "Hard2";
      // }
      // this._SHOW_INTERSTITIAL();
      this.isWin = false;
      this.initCard(this.gameType);
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
    toCanvas: function () {
      setTimeout(() => {
        window.scrollTo(0, 0);
        html2canvas(this.$refs.capture, { height: 500 }).then((canvas) => {
          this.share_image = canvas.toDataURL();
        });
        console.log("toCanvas");
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
            name: "cardgame",
            showlist: 0,
            // id: this.gameType,
            // score: this.score,
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
.flip-container {
  perspective: 1000;
  cursor: pointer;
}
.front,
.back {
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
}
.back {
  transform: rotateY(-180deg);
  width: 100%;
  left: 0;
  position: absolute;
}
.flip-container.flipped .back {
  transform: rotateY(0deg);
}
.flip-container.flipped .front {
  transform: rotateY(180deg);
}
// .matched {
//   transition: all 0.5s;
//   opacity: 0.3;
// }
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
.start_box {
  min-height: 500px;
  position: relative;
  background-position: top;
  background-size: cover;
  .btn-start {
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -75%);
    border-radius: 50px;
    padding: 10px;
    width: 80%;
    font-weight: 900;
    cursor: pointer;
    border: 2px solid #009ac3;
    background-color: white;
    color: #009ac3;
    transition: all 0.5s;
    &:hover {
      border: 2px solid white;
      background-color: #009ac3;
      color: white;
    }
  }
}
.card_box {
  min-height: 400px;
  position: relative;
  // background: #005d8a;
  background-position: center;
  background-size: cover;
}
.play {
  border: 5px solid #cecd39;
}
.header {
  .time,
  .score {
    font-weight: 500;
    font-size: 20px;
  }
  .time-now {
    position: relative;
  }
  .increase,
  .decrease {
    position: absolute;
    font-weight: border;
    right: -70%;
    transform: rotate(-5deg);
    font-size: 16px;
  }
  .increase {
    animation: fade-up 0.8s linear;
  }
  .decrease {
    animation: fade-down 0.8s linear;
  }
}
.card-open {
  width: 60px;
  height: 90px;
  background-size: cover;
  .success-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.combo {
  position: absolute;
  z-index: 200;
  top: 50%;
  left: 50%;
  font-size: 40px;
  font-weight: 900;
  transform: translate(-50%, -50%) rotate(-5deg);
  -webkit-text-stroke: 3px black;
}
.level {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fade-in-out 2.5s linear;
  font-size: 40px;
  font-weight: 900;
  -webkit-text-stroke: 2px #62ab64;
}
.win-page {
  // animation: win 0.5s linear;
}
.share-page {
  // animation: win 0.5s linear;
  .winner {
    p {
      font-size: 20px;
    }
  }
}
.win-result {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 900;
  font-size: 1.3rem;
  .number {
    font-size: 2.5rem;
    width: 30%;
  }
  .half-background {
    background: linear-gradient(
      to top,
      #f5c515 0%,
      #f5c515 40%,
      white 41%,
      white 100%
    );
  }
}
.win-box,
.share-box {
  background-color: white;
  color: black;
  border: 20px solid #f07712;
  border-radius: 40px;
  padding: 20px 30px;
  font-weight: 900;
}
.share-box {
  padding: 14px 5px;
}
.btn-common {
  border-radius: 50px;
  padding: 10px;
  width: 80%;
  font-weight: 900;
  cursor: pointer;
}
.btn-continue {
  background-color: white;
  color: black;
}
.btn-share {
  background-color: #009ac3;
  color: white;
}
.btn-replay {
  background-color: #ff366e;
  color: white;
}
.leaderboard-img {
  width: 50px;
  border-radius: 50%;
}
.leaderboard-winner-img {
  width: 60%;
  border-radius: 50%;
}
.borderTop {
  border-top: 3px solid #bfbfbf;
}
.rank-icon {
  // width: 60px;
  width: 70%;
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translate(-50%, -20%);
}
.score-icon {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 9%;
  transform: translate(-50%, -20%);
}
.winner-img {
  position: relative;
  .winner-icon {
    position: absolute;
    width: 100%;
    left: 0;
  }
}
.text-orange {
  color: #f07712;
}
.rank-me {
  background-color: #f07712;
  border-radius: 50px;
}
.fireworks {
  z-index: 200;
  position: absolute;
  width: 80%;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
}
.reciprocal {
  border: 2px solid rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  background-color: #14334d;
  z-index: 1000;
}
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
iframe {
  width: 75%;
}
@media (min-width: 768px) {
  .card-open {
    width: 120px;
    height: 180px;
    background-size: cover;
    .success-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
@keyframes win {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fade-up {
  0% {
    top: 5px;
  }
  99% {
    top: -5px;
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fade-down {
  0% {
    top: -5px;
  }
  99% {
    top: 5px;
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #f07712 transparent #f07712 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading {
  padding-bottom: 6rem;
  min-height: 100%;
  background-color: #38acff;
}
</style>
