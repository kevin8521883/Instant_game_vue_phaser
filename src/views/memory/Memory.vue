<template>
  <div class="container base playpage">
    <div
      class="play card_box pt-3 px-3 d-flex flex-column justify-content-between"
      ref="capture"
    >
      <div class="row">
        <div
          v-for="card in memoryCards"
          class="mb-3 flip-container"
          :key="card.id"
          @click="flipCard(card)"
          :class="{
            flipped: card.isFlipped,
            'col-4': gameType === 'Easy',
            'col-3': gameType === 'Normal' || gameType === 'Hard',
          }"
        >
          <div class="memorycard" :class="{ matched: card.isMatched }">
            <div class="front rounded">
              <img width="80" height="120" src="games/card_backside.jpg" />
            </div>
            <div class="back">
              <img width="80" height="120" :src="`${card.img})`" />
            </div>
          </div>
        </div>
      </div>
      <h2 class="">Turns：{{ turn }}</h2>
      <div :class="['winPage', { open: isWin }]" ref="capture">
        <div style="text-align: center; margin-top: -200px">
          <h3>
            {{ $store.state.Profile.name }}<br />
            Completed The Card<br />
            Difficult: {{ gameType }}<br />
            Turns: {{ turn }}
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
  </div>
</template>
<script>
import html2canvas from "html2canvas";
// import Gamelist from "../components/_Gamelist.vue";
export default {
  components: {
    // Gamelist,
  },
  data() {
    return {
      turn: 0,
      isWin: false,
      user_photo: "null",
      share_image: "null",
      gameType: "Easy",
      memoryCards: [],
      flippedCards: [],
      easyCards: [
        {
          name: "Apple",
          img: "https://i.imgur.com/jjx1p3P.png",
        },
        {
          name: "Grape",
          img: "https://i.imgur.com/89k1EJY.png",
        },
        {
          name: "Orange",
          img: "https://i.imgur.com/BiKh9iZ.png",
        },
      ],
      normalCards: [
        {
          name: "Apple",
          img: "https://i.imgur.com/jjx1p3P.png",
        },
        {
          name: "Grape",
          img: "https://i.imgur.com/89k1EJY.png",
        },
        {
          name: "Orange",
          img: "https://i.imgur.com/BiKh9iZ.png",
        },
        {
          name: "Pineapple",
          img: "https://i.imgur.com/gQXjFX6.png",
        },
      ],
      hardCards: [
        {
          name: "Apple",
          img: "https://i.imgur.com/jjx1p3P.png",
        },
        {
          name: "Grape",
          img: "https://i.imgur.com/89k1EJY.png",
        },
        {
          name: "Orange",
          img: "https://i.imgur.com/BiKh9iZ.png",
        },
        {
          name: "Pineapple",
          img: "https://i.imgur.com/gQXjFX6.png",
        },
        {
          name: "Strawberry",
          img: "https://i.imgur.com/gKxizMw.png",
        },
        {
          name: "Watermelon",
          img: "https://i.imgur.com/FOmxbXy.png",
        },
      ],
      tempCards: [],
    };
  },
  created() {
    this._APPINIT();
    window.scrollTo({
      top: 0,
    });
    this.cardInit(this.gameType);
    setTimeout(() => {
      this._LOAD_INTERSTITIAL();
      this.toB64();
    }, 3600);
  },
  methods: {
    cardInit(mode) {
      this.turn = 0;
      switch (mode) {
        case "Easy":
          this.tempCards = this.easyCards;
          break;
        case "Normal":
          this.tempCards = this.normalCards;
          break;
        case "Hard":
          this.tempCards = this.hardCards;
          break;
      }
      this.tempCards.forEach((item) => {
        this.$set(item, "isFlipped", false);
        this.$set(item, "isMatched", false);
      });
      let cards1 = JSON.parse(JSON.stringify(this.tempCards));
      let cards2 = JSON.parse(JSON.stringify(this.tempCards));
      this.memoryCards = [];
      this.memoryCards = this.memoryCards.concat(cards1, cards2);

      this.shuffleCards(this.memoryCards);
    },
    flipCard(card) {
      if (card.isFlipped || card.isMatched || this.flippedCards.length === 2)
        return;
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
    },
    matchCard() {
      this.turn++;
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          this.flippedCards.forEach((item) => {
            item.isMatched = true;
          });
          this.flippedCards = [];
          if (this.memoryCards.every((item) => item.isMatched === true)) {
            this.toCanvas();
            this.isWin = true;
            this.memoryCards.forEach((item) => {
              this.$set(item, "isFlipped", false);
            });
          }
        }, 400);
      } else {
        setTimeout(() => {
          this.flippedCards.forEach((item) => {
            item.isFlipped = false;
            this.flippedCards = [];
          });
        }, 800);
      }
    },
    replay(show_ad) {
      this.isWin = false;
      this.cardInit(this.gameType);
      if (show_ad) {
        this._SHOW_INTERSTITIAL(() => {
          setTimeout(() => {
            this._LOAD_INTERSTITIAL();
          }, 3600);
        });
      }
    },
    next() {
      if (this.gameType === "Easy") {
        this.gameType = "Normal";
      } else if (this.gameType === "Normal") {
        this.gameType = "Hard";
      }
      this._SHOW_INTERSTITIAL();
      this.isWin = false;
      this.cardInit(this.gameType);
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
        html2canvas(this.$refs.capture, {
          height: 600,
        }).then((canvas) => {
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
            name: "memory",
            // id: this.game_type,
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
  // min-height: 120px;
  cursor: pointer;
}
.front,
.back {
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
  top: 0;
  left: 0;
  width: 100%;
}
.back {
  transform: rotateY(-180deg);
  position: absolute;
}
.flip-container.flipped .back {
  transform: rotateY(0deg);
}
.flip-container.flipped .front {
  transform: rotateY(180deg);
}
.matched {
  transition: all 0.5s;
  opacity: 0.3;
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
  align-items: center;
  transition: top 0.3s;
}
.winPage.open {
  top: 0;
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
.card_box {
  min-height: 600px;
  background: #5174b9;
}
</style>
