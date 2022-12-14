<template>
  <div class="container-fluid base playpage">
    <div class="play">
      <b-modal ref="bv-modal-ans" centered hide-header>
        <template v-slot:modal-title></template>
        <div class="d-block text-center" style="padding: 15px">
          準備好了嗎? 確定看結果嗎~
        </div>
        <template v-slot:modal-footer>
          <b-button class="btn btn-primary btn-shadow" @click="getAns()">
            <font-awesome-icon :icon="['fa', 'film']" />&nbsp;看結果
          </b-button>
          <b-button class="btn btn-secondary btn-shadow" @click="closeModal()"
            >Close</b-button
          >
        </template>
      </b-modal>
      <h4 class="title play_title" @click="showid()">
        <span v-if="game.id && cnt >= 5"> [{{ game.id }}]</span>
        {{ game.title || "Loading" }}
      </h4>
      <div id="ans_top"></div>
      <div v-show="step == 'error'">
        <div class="question_img">
          <img class="cover" v-bind:src="game.cover_img" />
        </div>
        <h3 style="color: #8bd5d2">
          Sorry, something went wrong An unexpected error has occurred.
        </h3>
        <br />
        <div
          class="btn btn-theme btn-block btn-shadow btn-x-large"
          @click="getAns()"
        >
          REPLAY
        </div>
      </div>
      <div class="loading" v-show="step == 'loading'">
        <div v-if="style == 'base'" class="load">
          <hr />
          <hr />
          <hr />
          <hr />
        </div>
        <div class="typing">{{ _T("loadcanvasText") }}</div>
      </div>
      <div v-if="step == 'cover'">
        <div class="question_img">
          <img class="cover" v-bind:src="game.cover_img" />
        </div>
        <div class="question_text">
          <span>{{ game.option_text }}</span>
        </div>
        <div class="question_options">
          <br />
          <div
            class="btn btn-theme btn-block btn-shadow btn-x-large"
            @click="getAns()"
          >
            <font-awesome-icon :icon="['fa', 'film']" />PLAY
          </div>
        </div>
      </div>
      <div v-if="step == 'question'">
        <div class="question_img">
          <img class="cover" v-bind:src="game.cover_img" />
        </div>
        <div class="question_text">
          <span>{{ game.option_text }}</span>
        </div>
        <div class="question_options">
          <div
            v-for="(item, key) in game.options"
            :key="key"
            class="btn btn-theme btn-block btn-shadow btn-x-large"
            @click="chooseOptions(key)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
      <div v-if="step == 'questions_set'">
        <div v-for="(item, key) in game.options" :key="key">
          <div>
            <div v-for="(s_item, k) in item.stack" :key="k">
              <div v-if="o_step == key && item.type == 'img'">
                <div class="question_img" v-if="s_item.type == 'help_img'">
                  <img
                    class="cover"
                    v-imgUrl="s_item.url"
                    v-bind:src="'./loading.png'"
                  />
                </div>

                <div
                  :class="break_class(s_item)"
                  v-if="s_item.type == 'help_txt'"
                >
                  <span>{{ s_item.text }}</span>
                </div>

                <div
                  class="row justify-content-md-center justify-content-center"
                  style="padding: 5px"
                  v-if="k == 'images'"
                >
                  <div
                    class="col-4 qbox"
                    v-for="(imgs, ik) in s_item"
                    :key="ik"
                  >
                    <div class="qcard" @click="chooseMultiOptionNext(imgs)">
                      <img
                        class="qimg"
                        v-imgUrl="imgs.url"
                        v-bind:src="'./loading-sq.png'"
                      />
                      <span>{{ imgs.text }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="o_step == key && item.type == 'option'">
                <div class="question_img" v-if="s_item.type == 'help_img'">
                  <img
                    class="cover"
                    v-imgUrl="s_item.url"
                    v-bind:src="'./loading.png'"
                  />
                </div>

                <div
                  :class="break_class(s_item)"
                  v-if="s_item.type == 'help_txt'"
                >
                  <span>{{ s_item.text }}</span>
                </div>

                <div
                  v-if="s_item.type == 'option'"
                  class="btn btn-options btn-block btn-shadow btn-x-large btn-options"
                  @click="chooseMultiOptionNext(s_item)"
                >
                  {{ s_item.text }}
                </div>
              </div>

              <div v-if="o_step == key && item.type == 'txt'">
                <div class="question_img" v-if="s_item.type == 'help_img'">
                  <img
                    class="cover"
                    v-imgUrl="s_item.url"
                    v-bind:src="'./loading-sq.png'"
                  />
                </div>
                <div
                  :class="break_class(s_item)"
                  v-if="s_item.type == 'help_txt'"
                >
                  <span>{{ s_item.text }}</span>
                </div>
                <div v-show="s_item.type == 'input'" style="color: black">
                  {{ s_item.text }}
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="s_item.placeholder"
                    v-model="s_item.input"
                  />
                </div>

                <div
                  v-if="k == Object.keys(item.stack).length - 1"
                  @click="chooseMultiOptionNext()"
                  class="btn btn-theme btn-block btn-shadow btn-x-large btn-options"
                >
                  {{ item.rule.next }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <pre v-show="false" style="text-align: left">{{ game.options }}</pre>
      </div>

      <div v-show="ans_loader == true && step == 'answer'">
        <div class="share_box">
          <div
            class="btn btn-fb btn-block btn-shadow btn-x-large shake-button"
            @click="shareAns()"
          >
            <font-awesome-icon :icon="['fab', 'facebook-square']" />
            {{ _T("shareFb") }}
            <!--Facebook分享-->
          </div>
        </div>
        <div>
          <canvas
            @click="shareAns()"
            id="canvas"
            class="fadeineff"
            :width="canvas_config.width"
            :height="canvas_config.height"
          ></canvas>
          <canvas id="canvas_share" v-show="false" />
        </div>
        <div class="share_box">
          <div
            class="btn btn-fb btn-block btn-shadow btn-x-large shake-button"
            @click="shareAns()"
          >
            <font-awesome-icon :icon="['fab', 'facebook-square']" />
            &nbsp; {{ _T("shareFb") }}
            <!--Facebook分享-->
          </div>
        </div>

        <div class="btn btn btn-shadow btn-x-large btn-redo" @click="redo()">
          <font-awesome-icon :icon="['fa', 'redo']" />
          {{ _T("replay") }}
          <!--再試一次-->
        </div>
      </div>
    </div>

    <Gamelist :needtime="needtime" />
  </div>
</template>

<script>
import Gamelist from "./components/_Gamelist";
export default {
  components: {
    Gamelist,
  },
  data() {
    return {
      needtime: false,
      style: process.env.VUE_APP_STYLE,
      id: null,
      canvas_config: {
        width: 600,
        height: 900,
      },
      do_times: 0,
      error_cnt: 0,
      options: -1,
      multi_options: [],
      step: "loading",
      o_step: 0,
      game_loader: false,
      ans_loader: false,
      game: {},
      data: [],
      cnt: 0,
      share_image: null,
      is_analysis: true,
      is_show_ad: 0,
      caches: [],
    };
  },
  methods: {
    closeModal() {
      this.$refs["bv-modal-ans"].hide();
    },
    summaryMultiOptions() {
      let len = this.game.options.length;

      this.multi_options = [];
      for (var i = 0; i < len; i++) {
        let slen = this.game.options[i].stack.length;
        let type = this.game.options[i].type;
        let l = 0;
        this.multi_options[i] = [];
        if (type == "option") {
          for (l; l < slen; l++) {
            if (this.game.options[i].stack[l].active == 1) {
              this.multi_options[i].push(this.game.options[i].stack[l].id);
            }
          }
        }
        if (type == "img") {
          let img_len = this.game.options[i].stack["images"].length;
          // alert(img_len);
          let k = 0;
          for (k = 0; k < img_len; k++) {
            if (this.game.options[i].stack["images"][k].active == 1) {
              this.multi_options[i].push(
                this.game.options[i].stack["images"][k].id
              );
            }
          }
        }
        if (type == "txt") {
          for (l; l < slen; l++) {
            if (this.game.options[i].stack[l].type == "input") {
              this.multi_options[i].push(
                this.game.options[i].stack[l].input || ""
              );
            }
          }
        }
      }
    },
    getAns: function () {
      this.$refs["bv-modal-ans"].hide();
      this.step = "loading";
      // console.log(this.game.options);
      if (this.game.type == "3") {
        // console.log(this.game.options);
        this.summaryMultiOptions();
        // console.log(this.multi_options);
      }
      let setPic = (obj) => {
        if (this.$store.state.app_config.rand_photo == "2")
          obj.forEach((layer, key, ary) => {
            if (layer.type == "thumb" && layer.display == "true") {
              let size = 36;
              if (layer.config.width <= 200) {
                size = 26;
              }
              if (layer.config.width <= 150) {
                size = 16;
              }

              ary.push({
                type: "txt",
                name: "姓名",
                active: false,
                display: true,
                config: {
                  mode: 2,
                  color: "#3C3C3C",
                  size: size,
                  autoSize: 48,
                  x: layer.config.x || 0,
                  y: layer.config.y || 0,
                  w: layer.config.width || 200,
                  h: layer.config.height || 200,
                  opacity: 1,
                  textAlign: "center",
                  strokeText: false,
                  globalAlpha: 1,
                  strokeStyle: "#fb9539",
                  lineWidth: 12,
                  words: this.$store.state.Profile.name,
                },
              });
            }
            // return ary;
          });
        // console.log(obj);
        return obj;
      };
      this.axios({
        crossDomain: true,
        url: "/v1/play/getAns",
        method: "post",
        data: {
          id: this.id,
          name: this.$store.state.Profile.name,
          fbid: this.$store.state.Profile.id,
          photo: this.$store.state.Profile.photo,
          option: this.game.type == "3" ? this.multi_options : this.options,
        },
      })
        .then(async (response) => {
          this.ans_loader = true;
          this.data = setPic(response.data.data.layer);
          this.canvas_config = response.data.data.config;

          this.initCanvas();
          this.clearCanvas();
          await this.canvasRender();

          this.$nextTick(() => {
            let dom = this.$el.querySelector("#ans_top");
            // console.log(dom.offsetTop);
            window.scrollTo({
              top: dom.offsetTop - 50 || 80,
              behavior: "smooth",
            });
          });
          this._SHOW_REWARDVIDEO();
          this.showad("1");
          this.receive_stastics();
          this.step = "answer";
          this._ADD_PLAYED(this.id);
        })
        .catch(() => {
          this.step = "error";
        });
    },
    receive_stastics: function () {
      if (process.env.VUE_APP_MODE !== "product") return false;
      if (this.is_analysis) {
        this.axios({
          crossDomain: true,
          url: process.env.VUE_APP_API_URL_W + "/v1/play/stastices/receive",
          method: "post",
          data: {
            id: this.id,
            account_id: this.game.account_id ? this.game.account_id : 0,
            fbid: this.$store.state.Profile.id,
            name: this.$store.state.Profile.name,
            showad: this.is_show_ad,
            // from_share: this.$store.state.entry_point.id == this.id,
          },
        })
          .then(() => {
            this.is_analysis = false;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    receive_shares() {
      // this.needtime = true;
      if (process.env.VUE_APP_MODE !== "product") return false;
      this.axios({
        crossDomain: true,
        url: process.env.VUE_APP_API_URL_W + "/v1/play/shares/receive",
        method: "post",
        data: {
          id: this.id,
          account_id: this.game.account_id ? this.game.account_id : 0,
          fbid: this.$store.state.Profile.id,
          name: this.$store.state.Profile.name,
        },
      })
        .then((response) => {
          // this.share_record = false;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showid: function () {
      this.cnt++;
      setTimeout(() => {
        this.cnt = 0;
      }, 10000);
    },
    shareAns() {
      if (!this.share_image) {
        return false;
      }
      window.FBInstant.shareAsync({
        intent: "SHARE",
        image: this.share_image,
        text: this.$store.state.Profile.name + "的分享內容",
        data: {
          arguments: {
            id: this.id,
          },
          page: "play",
          from: "inner",
        },
      }).then(() => {
        // console.log(res);
        //繼續遊戲

        this._FBQ("ShareGames");
        this.receive_shares();

        let probability = this.$store.state.app_config.after_share_probability;
        let rand_num = Math.floor(Math.random() * 101);

        if (rand_num >= probability) {
          window.scrollTo({
            top: 850,
            // top: 0,
            behavior: "smooth",
          });
        } else {
          window.scrollTo({
            // top: 850,
            top: 0,
            behavior: "smooth",
          });
          this.$router.push({
            name: "cardgame",
            params: {
              showlist: 1,
            },
          });
        }
      });
    },
    initCanvas() {
      this.canvas = document.getElementById("canvas");
      this.canvasContext = this.canvas.getContext("2d");
    },
    clearCanvas() {
      let ctx = this.canvasContext;
      ctx.clearRect(0, 0, this.canvas_config.width, this.canvas_config.height);
    },
    async canvasRender() {
      //   console.log(this.data);

      for (const [key, obj] of Object.entries(this.data)) {
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
      }
      this.createShareImg();
    },
    createShareImg() {
      let share_mode = this.$store.state.app_config.share_mode;
      // console.log(share_mode);
      if (
        (share_mode == "2" || share_mode == "3") &&
        this.canvas_config.height > this.canvas_config.width
      ) {
        var resizedCanvas = document.getElementById("canvas_share");
        var resizedContext = resizedCanvas.getContext("2d");

        if (share_mode == "2") {
          resizedCanvas.width = "600";
          resizedCanvas.height = "750";
          var x = 0;
          resizedContext.clearRect(0, 0, 600, 750);
          // change_width =
          //   (600 / this.canvas_config.height) * this.canvas_config.width;
          // if (change_width < 600) {
          //   x = (600 - change_width) / 2;
          // }
          // console.log(this.canvas_config);
          if (
            this.canvas_config.width == 600 &&
            this.canvas_config.height == 750
          ) {
            resizedContext.drawImage(this.canvas, x, 0, 600, 750);
          } else {
            resizedContext.drawImage(this.canvas, x, -10, 600, 760);
          }
        }
        if (share_mode == "3") {
          resizedCanvas.height = "600";
          resizedCanvas.width = "600";
          resizedContext.clearRect(0, 0, 600, 600);
          var change_width =
            (600 / this.canvas_config.height) * this.canvas_config.width;

          if (change_width < 600) {
            x = (600 - change_width) / 2;
          }
          resizedContext.drawImage(this.canvas, x, 0, change_width, 600);
        }
        this.share_image = resizedCanvas.toDataURL(0.7);
      } else {
        this.share_image = this.canvas.toDataURL(0.5);
      }
    },
    async drawTxt(config) {
      let ctx = this.canvasContext;
      // await this.testTxt(config);
      return new Promise((resolve) => {
        config.x = parseInt(config.x, 10);
        config.y = parseInt(config.y, 10);
        config.size = parseInt(config.size, 10);

        const regex = /@{rand\((\d+),(\d+)\)}/gm;
        // let str = config.words;

        let m;
        var re = [];
        var rnd1 = [];
        var rnd2 = [];
        while ((m = regex.exec(config.words)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          // The result can be accessed through the `m`-variable.
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

            // console.log(`Found match, group ${groupIndex}: ${match}`);
          });
        }

        re.forEach((oo, idx) => {
          var rand_num = this.getRandomInt(rnd1[idx], rnd2[idx]);
          // console.log(rnd1[idx]);
          // console.log(rnd2[idx]);
          config.words = config.words.replace(oo, rand_num);
        });

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

          // let font_size = config.autoSize;

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
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    async drawImg(config, type) {
      return new Promise((resolve) => {
        let ctx = this.canvasContext;
        ctx.save();

        const image = new window.Image();
        image.crossOrigin = "Anonymous";

        if (
          type == "img" ||
          config.image.indexOf("https://funfunquiz") !== -1
        ) {
          config.image = config.image.replace(
            "https://funfunquiz.s3.ap-northeast-1.amazonaws.com/",
            "https://app-files.funfunquiz.com/upload/"
          );

          let cdn = this.$store.state.app_config.cdn;

          var localimg = false;
          if (cdn == "1") {
            config.image = config.image.replace(
              "https://app-files.funfunquiz.com/upload/",
              "https://app-cloudflare.funfunquiz.com/upload/"
            );
            localimg = this.find_local_cache(config.image);
          } else {
            let d = new Date();
            let dd = String(d.getDate()).padStart(2, "0");
            config.image = config.image + "?time=" + dd + d.getMinutes();
          }

          if (localimg) {
            // console.log("get cache");
            config.image = localimg;

            image.src = config.image;
          } else {
            if (this.error_cnt >= 1) {
              let d = new Date();
              let dd = String(d.getDate()).padStart(2, "0");
              config.image = config.image + "?time=" + dd + d.getMinutes();
            }
            fetch(config.image)
              .then((response) => {
                // console.log(response);
                return response.blob();
              })
              .then((myBlob) => {
                var url = URL.createObjectURL(myBlob);
                // console.log("fetch");
                this.create_local_cache(config.image, url);
                image.src = url;
              })
              .catch(() => {
                // console.log("error");
                this.step = "error";
                this.error_cnt++;
              });
            if (this.step == "error") return;
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
    find_local_cache(url) {
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
    create_local_cache(url, cache_url) {
      this.caches.push({
        url: url,
        cache_url: cache_url,
      });
    },
    start_question() {
      this._FBQ("PlayGameStart");
      if (this.game.type == "1" || this.game.type == 1) {
        this.step = "loading";
        this.chooseOptions(-1);
      } else if (this.game.type == "3" || this.game.type == "4") {
        this.o_step = 0;
        let len = this.game.options.length;

        // if (this.do_times == 0) {
        //reload
        for (var i = 0; i < len; i++) {
          var slen = this.game.options[i].stack.length;
          var type = this.game.options[i].type;
          var l = 0;
          if (type == "option") {
            for (l; l < slen; l++) {
              this.game.options[i].stack[l].active = 2;
            }
          }
          if (type == "img") {
            var img_len = this.game.options[i].stack["images"].length;
            // alert(img_len);
            var k = 0;
            for (k = 0; k < img_len; k++) {
              this.game.options[i].stack["images"][k].active = 2;
            }
          }
        }
        // }
        this.step = "questions_set";
        // this.do_times++;
      } else {
        this.step = "question";
        // this.chooseOptions();
      }
    },
    chooseMultiOption(lv, index) {
      console.log(lv);
      console.log(index);
      this.o_step++;
      if (Object.keys(this.game.options).length == this.o_step)
        setTimeout(() => {
          this.getAns();
        }, 0.001);
    },
    chooseMultiOptionNext(obj) {
      // console.log(obj.active);
      if (obj) {
        obj.active = obj.active == 1 ? 2 : 1;
      }
      // console.log(obj);
      this.o_step++;

      if (Object.keys(this.game.options).length == this.o_step)
        setTimeout(() => {
          this.getAns();
        }, 0.001);
    },
    chooseOptions(option_id) {
      this.options = option_id;
      // this.$refs["bv-modal-ans"].show();
      setTimeout(() => {
        this.getAns();
      }, 0.001);
      // this.$bvModal
      //   .msgBoxConfirm("確定查看結果嗎?", {
      //     title: "info"
      //     // headerClass: 'p-2 border-bottom-0',
      //     // footerClass: 'p-2 border-top-0',
      //   })
      //   .then(status => {
      //     if (status) {
      //       setTimeout(() => {
      //         this.getAns();
      //       }, 0.001);
      //     }
      //   })
      //   .catch(err => {
      //     // An error occurred
      //     console.log(err);
      //   });
    },
    start() {
      this.step = "loading";
      setTimeout(() => {
        this.game = this.$store.state.funfunquiz.game;
        // console.log(this.$store.state.game_set);
        if (!this.$store.state.funfunquiz.game_set) {
          this.axios({
            crossDomain: true,
            url: "/v1/play/get",
            method: "post",
            data: {
              id: this.id,
            },
          }).then((response) => {
            this.game = response.data.data;
            // console.log(this.game);
            this.game_loader = true;
            this.start_question();
          });
        } else {
          this.game_loader = true;
          this.start_question();
        }
      }, 250);
    },
    showad(show_at) {
      let rand_num = Math.floor(Math.random() * 101);
      let rand_rate = this.$store.state.app_config.ad_percent;
      let ad_type = this.$store.state.app_config.ad_type;
      let ad_at = this.$store.state.app_config.ad_at;
      if (show_at !== ad_at) {
        return false;
      }
      if (rand_num > rand_rate) {
        return false;
      }

      if (ad_type == "1") {
        this._SHOW_REWARDVIDEO(() => {
          this.is_show_ad = 1;
          // console.log("ad load");
        });
      } else {
        this._SHOW_INTERSTITIAL(() => {
          this.is_show_ad = 1;
          // console.log("ad load");
        });
      }
    },
    redo() {
      this.start_question();
      this.showad("2");
      this.is_show_ad = 0;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    switchGameNow() {
      this._SWITCH_GAME({
        myReplayData: this.id,
        page: "demo",
        from: "switch",
      });
    },
    prepareAD() {
      let ad_type = this.$store.state.app_config.ad_type;
      if (ad_type == "1") {
        this._LOAD_REWARDVIDEO();
      }
      if (ad_type == "2") {
        this._LOAD_INTERSTITIAL();
      }
      if (ad_type == "3") {
        this._LOAD_REWARDVIDEO();
        this._LOAD_INTERSTITIAL();
      }
    },
    break_class(s_item) {
      return s_item.break && s_item.break == "2"
        ? "question_text"
        : "question_text_break";
    },
  },
  mounted() {
    this.prepareAD();
    window.imageCache = [];
    this.is_show_ad = 0;
    window.scrollTo({
      top: 0,
      //   behavior: "smooth"
    });
    this.id = this.$route.params.id;
    // console.log(this.id);
    this.start();
    // console.log(process.env.VUE_APP_VER);
  },
  watch: {
    $route(to, from) {
      if (from.params.id !== to.params.id) {
        this.prepareAD();
        window.imageCache = [];
        // this._LOAD_INTERSTITIAL();
        this.is_analysis = true;
        this.is_show_ad = 0;
        window.scrollTo({
          top: 0,
        });
        this.id = to.params.id;
        this.start();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  width: 360px;
  max-width: 100%;
}
.cover {
  max-width: 100%;
}
.question_text {
  color: black;
  overflow: hidden;
  font-size: x-large;
}
.question_text_break {
  color: #171414;
  word-break: break-all;
  overflow: hidden;
  font-size: x-large;
}
.qbox {
  padding-right: 2px;
  padding-left: 2px;
}
.qcard {
  padding: 5px;
  box-shadow: rgba(157, 157, 157, 0.7) 0 1px 4px;
  color: black;
  margin-bottom: 2px;
}
.qimg {
  width: 100%;
}
</style>