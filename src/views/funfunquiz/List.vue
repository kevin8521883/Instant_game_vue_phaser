<template>
  <div>
    <div class="container-fluid base playpage">
      <div class="row">
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
                <h5 class="game-title">
                  &nbsp; ({{ item.vindex }}) {{ item.title }}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-12"
          v-show="!_GAMES_LIST_DATA || _GAMES_LIST_COUNT <= 0"
          @click="nextPage()"
          style="text-align: center"
        >
          <div class="btn btn-info">more</div>
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
    </div>
  </div>
</template>

<script>
import FunfunApi from "../../api/funfunquiz/index.js";
export default {
  data() {
    return {
      Games: [],
    };
  },
  methods: {
    nextPage() {
      FunfunApi.gameNextPage();
    },
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
  },
  created() {
    window.scrollTo({
      top: 0,
    });
  },
};
</script>

<style lang="scss" scoped>
.game-list.active {
  border: 6px solid #11a7bf;
}
</style>