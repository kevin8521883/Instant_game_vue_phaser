<template>
  <div class="gg">
    <div
      class="canvas-container"
      :id="containerId"
      v-if="downloaded"
      :style="{
        'max-width': `${screenWidth}px`,
        'max-height': `${screenHeight}px`,
      }"
    />
    <div class="placeholder" v-else>
      Downloading ...
    </div>
  </div>
</template>

<script>
export default {
  created() {
    console.log(1234);

    this._APPINIT(() => {
      console.log(12321424);
      // this._LOAD_INTERSTITIAL();
    });
  },
  name: "Game",
  data() {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      downloaded: false,
      gameInstance: null,
      containerId: "game-container",
    };
  },
  async mounted() {
    const game = await import(/* webpackChunkName: "game" */ "./js/loader.js");
    const vm = this;

    console.log("global", game);
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId);
      console.log(this.gameInstance);
      // console.log(game.resize().width);

      this.gameInstance.vue = {
        update: (s) => {
          console.log(this);
          console.log("call api");
          this.score = s;
        },
        action: () => {
          alert(123);
        },
        ad() {
          console.log("adad");
          vm._SHOW_INTERSTITIAL(() => {
            setTimeout(() => {
              vm._LOAD_INTERSTITIAL(() => {});
            }, 3600);
          });
        },
        share() {
          var data = game.canvas.toDataURL();
          vm.$store.dispatch("SHARE_IMG", data);
          console.log(vm);
          console.log(vm.share_image);
          window.FBInstant.shareAsync({
            intent: "SHARE",
            image: vm.share_image,
            text: "的分享內容",
            data: {
              promotions: "games",
              params: {
                name: "cardgame",
              },
            },
          }).then(() => {
            console.log("分享");
          });
        },
      };
    });
  },
  computed: {
    share_image() {
      return this.$store.state.share_img;
    },
  },
  destroyed() {
    this.gameInstance.destroy(false);
  },
};
</script>

<style lang="scss" scoped>
.canvas-container {
  margin-top: 60px;
}
.placeholder {
  font-size: 2rem;
  font-family: "Courier New", Courier, monospace;
}
canvas {
  // display: block;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
}
.gg {
  margin-top: 60px;
}
</style>
