<template>
  <div class="row">
    <div class="col-12">
      <h4 style="margin: 20px 0px 20px 0px" @click="setPro()" ref="suggest">
        {{ _T("recommendText") }}
      </h4>
      <div v-if="editorcnt >= 5">編輯模式啟動!</div>
    </div>
    <div
      class="col-md-12 col-xs-12"
      v-for="item in _GAMES_LIST_DATA"
      :key="item.vindex"
    >
      <div @click="_BEFORE_AD(item)">
        <div class="game-list">
          <img
            style="width: 100%"
            v-lazy="item.cover_img"
            class="card-img-display"
          />
          <div class="game-label" v-if="item.new">new</div>
          <div class="game-icon">
            <font-awesome-icon
              class="fire"
              v-if="item.star >= 1"
              :icon="['fa', 'fire']"
            />
            <font-awesome-icon
              class="fire"
              v-if="item.star >= 2"
              :icon="['fa', 'fire']"
            />
            <font-awesome-icon
              class="fire"
              v-if="item.star >= 3"
              :icon="['fa', 'fire']"
            />
          </div>
          <div class="img-overlay"></div>
          <div class="game-title-box">
            <h5 class="game-title">&nbsp;{{ item.title }}</h5>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="modal-sure" centered hide-header>
      <template v-slot:modal-header="{}">
        <h5>Message</h5>
      </template>
      <div style="padding: 10px">
        <h4>{{ _T("areYouSure") }}</h4>
      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <div style="text-align: center; width: 100%">
          <div class="btn btn-info btn-lg" @click="gameStart()">
            <font-awesome-icon :icon="['fa', 'film']" />
            &nbsp; {{ _T("okResult") || "OK" }}
          </div>
          &nbsp;
          <div class="btn btn-secondary btn-lg" @click="cancel()">
            {{ _T("cancleResult") || "Cancel" }}
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "gamelist",
  props: {
    needtime: Boolean,
  },
  computed: {
    currentLangCode: function () {
      return this.$store.state.language.code;
    },
  },
  methods: {
    gameStart() {
      this._DP("SET_PLAY_GAME", this.item_now);
      this.$refs["modal-sure"].hide();
      this.$router.push({
        name: "play",
        params: {
          id: this.item_now.id,
        },
      });
    },
    setPro() {
      this.editorcnt++;
      setTimeout(() => {
        this.editorcnt = 0;
      }, 3000);
      if (this.editorcnt >= 6) {
        let editor_config = JSON.parse(
          JSON.stringify(this.$store.state.funfunquiz.editorinfo)
        );
        editor_config.mode = "true";
        this._DP("SET_EDITOR_INFO", editor_config);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>