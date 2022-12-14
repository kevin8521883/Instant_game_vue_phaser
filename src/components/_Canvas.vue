<template>
  <div>
    <canvas
      v-show="display"
      id="canvas"
      :width="config.width"
      :height="config.height"
      @click="share()"
    ></canvas>
    <canvas id="canvas_share" v-show="false" />
  </div>
</template>

<script>
export default {
  props: {
    layer: Array,
    config: Object,
    display: Boolean,
  },
  data() {
    return {
      caches: [],
      error_cnt: 0,
      canvas: {},
      canvasContext: {},
      share_image: "",
    };
  },
  methods: {
    initCanvas() {
      this.canvas = document.getElementById("canvas");
      this.canvasContext = this.canvas.getContext("2d");
    },
    clearCanvas() {
      let ctx = this.canvasContext;
      ctx.clearRect(0, 0, this.config.width, this.config.height);
    },
    randRangeTxt(text) {
      const regex = /@{rand\((\d+),(\d+)\)}/gm;
      let m;
      var re = [];
      var rnd1 = [];
      var rnd2 = [];
      while ((m = regex.exec(text)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
          if (groupIndex == 0) {
            re.push(match);
          }
          if (groupIndex == 1) {
            rnd1.push(match);
          }
          if (groupIndex == 2) {
            rnd2.push(match);
          }
        });
      }

      re.forEach((oo, idx) => {
        var rand_num = this.getRandomInt(rnd1[idx], rnd2[idx]);
        text = text.replace(oo, rand_num);
      });
      return text;
    },
    async drawTxt(config) {
      let ctx = this.canvasContext;
      // await this.testTxt(config);
      return new Promise((resolve) => {
        config.x = parseInt(config.x, 10);
        config.y = parseInt(config.y, 10);
        config.size = parseInt(config.size, 10);

        config.words = this.randRangeTxt(config.words);
        ctx.save();

        let x = config.x;
        let y = config.y;
        let start_x = x;
        let start_y = y;
        let words = [];
        if (typeof config.mode == "undefined" || config.mode == "1") {
          ctx.fillStyle = config.color;
          ctx.font = "bolder " + config.size + "px 微軟正黑體";
          // ctx.globalAlpha = config.opacity;
          words = config.words.split("\n");
          if (config.textAlign) {
            ctx.textAlign = config.textAlign;
          }
          words.forEach(function (txt) {
            ctx.fillText(txt, start_x, start_y);

            start_y = start_y + config.size;
          });
          // ctx.fill();
          ctx.restore();
        } else {
          let str = config.words;
          let maxWidth = config.w;
          let DrawAry = [];
          let line = "";
          let k = 0;
          let keep = true;
          let times = 0;
          do {
            times++;
            if (times >= 100) break;
            ctx.fillStyle = config.color;
            ctx.font = "bolder " + config.size + "px 微軟正黑體";
            DrawAry = [];
            line = "";
            k = 0;
            for (var n = 0; n < str.length; n++) {
              let testLine = line + str[n];
              let metrics = ctx.measureText(testLine);
              let testWidth = metrics.width;
              if (testWidth < maxWidth) {
                DrawAry[k] = testLine;
                line = testLine;
              } else {
                n--;
                k++;
                line = "";
                if (k >= 20) {
                  console.log("out of range");
                  break;
                }
              }
            }
            words = DrawAry;

            if (config.h >= words.length * config.size || config.size <= 12) {
              break;
            } else {
              config.size--;
            }
          } while (keep);
          let start_x = config.x;
          let text_h = (words.length - 1) * (config.size / 2);
          let h_half = config.h / 2;
          switch (config.textAlign) {
            case "center":
              start_x = config.x + config.w / 2;

              start_y = config.y + h_half - text_h;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              break;
            case "left":
              start_x = config.x;
              start_y = config.y + h_half - text_h;
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              break;
            case "right":
              start_x = config.x + config.w;
              start_y = config.y + h_half - text_h;
              ctx.textAlign = "right";
              ctx.textBaseline = "middle";
          }

          words.forEach((txt) => {
            ctx.fillText(txt, start_x, start_y);

            start_y = start_y + config.size;
          });
          ctx.restore();
        }
        resolve({});
      });
    },
    async drawImg(config, type) {
      return new Promise((resolve) => {
        let ctx = this.canvasContext;
        ctx.save();

        const image = new window.Image();
        image.crossOrigin = "Anonymous";

        let localimg = false;

        config.image = config.image.replace(
          "https://app-files.funfunquiz.com/upload/",
          "https://app-cloudflare.funfunquiz.com/upload/"
        );

        if (
          type == "img" ||
          (type == "thumb" &&
            config.image.indexOf("https://platform-lookaside") !== 0)
        ) {
          // console.log(config.image);
          localimg = this.findLocalCache(config.image);
          if (localimg) {
            config.image = localimg;
            image.src = config.image;
          } else {
            // if (this.error_cnt >= 1) {
            let d = new Date();
            let dd = String(d.getDate()).padStart(2, "0");
            config.image = config.image + "?time=" + dd + d.getMinutes();
            // }
            fetch(config.image)
              .then((response) => {
                // console.log(response);
                return response.blob();
              })
              .then((myBlob) => {
                var url = URL.createObjectURL(myBlob);
                this.createLocalCache(config.image, url);
                image.src = url;
              })
              .catch(() => {
                this.error_cnt++;
              });
          }
        } else {
          image.src = config.image;
        }

        // console.log(config.image);
        image.onload = () => {
          config.x = config.x !== -1 ? config.x : 0;
          config.y = config.y !== -1 ? config.y : 0;
          config.width = config.width !== -1 ? config.width : image.width;
          config.height = config.height !== -1 ? config.height : image.height;
          ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            config.x,
            config.y,
            config.width,
            config.height
          );

          ctx.restore();

          resolve();
        };
      });
    },
    //尋找是否有快取圖片
    findLocalCache(url) {
      let caches = this.caches;
      let len = caches.length;
      var cache_URL = false;
      for (let i = 0; i < len; i++) {
        // console.log(url + "=> " + caches[i].url);
        if (caches[i].url && url == caches[i].url) {
          cache_URL = caches[i].cache_url;
          break;
        }
      }
      return cache_URL;
    },
    //建立快取圖片
    createLocalCache(url, cache_url) {
      this.caches.push({
        url: url,
        cache_url: cache_url,
      });
    },
    async renderCanvas() {
      for (const [key, obj] of Object.entries(this.layer)) {
        if (key == -1) {
          continue;
        }
        if (typeof obj.type == "undefined") {
          continue;
        }

        if (!obj.display) {
          continue;
        }
        if (obj.type === "txt") {
          await this.drawTxt(obj.config);
        }
        if (obj.type === "img" || obj.type === "thumb") {
          await this.drawImg(obj.config, obj.type);
        }
        this.createShareImg();
      }
    },
    createShareImg() {
      this.share_image = this.canvas.toDataURL(0.5);
    },
    async render() {
      console.log("rander layer");
      this.initCanvas();
      this.clearCanvas();
      await this.renderCanvas();
      this.$emit("render", this.share_image);
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    share() {
      this.$emit("share", this.share_image);
    },
  },
  created() {
    // console.log(this.layer);
    setTimeout(() => {
      this.render();
    }, 10);
  },
  updated() {
    this.render();
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  max-width: 100%;
  // border: 1px solid #f3f1f1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
}
</style>
