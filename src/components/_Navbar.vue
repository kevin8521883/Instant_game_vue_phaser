<template>
  <div :class="ver">
    <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
      <div class="container"></div>
      <div class="container" id="head_logo">
        <!-- <div style="position: absolute; left: 5px" class="nav-link">
          <img
            v-if="!gameMode()"
            class="home-icon"
            src="Home-icon.png"
            @click="toPhaser"
          />
        </div> -->

        <!-- <div
          v-if="show_lan && !gameMode()"
          @click="toggleLan()"
          style="position: absolute; left: 45px; width: 100px"
        >
          <img
            class="home-icon"
            :src="'lan/' + $store.state.language.code + '.png'"
          />
        </div> -->
        <div class="nav-link" @click="goToList()">
          <img v-bind:class="titleClass()" :src="logo()" />
        </div>
        <b-dropdown
          id="dropdown-1"
          v-if="$store.state.funfunquiz.editorinfo.mode == 'true'"
          text="編輯"
          class="m-md-2"
        >
          <b-dropdown-item>
            <router-link class="nav-link" :to="{ name: 'hot' }"
              >熱門文章</router-link
            >
          </b-dropdown-item>
          <b-dropdown-item>
            <router-link class="nav-link" :to="{ name: 'dev' }"
              >設定</router-link
            >
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="container"></div>

      <b-modal
        id="lan-modal"
        size="md"
        :content-class="''"
        :centered="true"
        :hide-header="true"
        :hide-footer="true"
      >
        <template v-slot:default="{}">
          <div class="language_modal">
            <ul style="list-style-type: none">
              <li
                class="choose_lan"
                v-for="(language, index) in $store.state.Languages"
                :key="index"
                @click="changeLan(language)"
              >
                <img class="flag-icon" :src="'lan/' + language.code + '.png'" />
                &nbsp;{{ language.name }}
              </li>
            </ul>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "navbar",
  computed: {
    ...mapGetters(["getEditor"]),
  },
  data() {
    return {
      cnt: 0,
      show_lan: process.env.VUE_APP_LAN == "true",
      ver: process.env.VUE_APP_VER,
    };
  },
  created() {
    // console.log(process.env);
  },
  methods: {
    toPhaser() {
      this.$router.push("/phaser_demo");
    },
    gameMode: function() {
      let gameList = ["cardgame"];
      return gameList.indexOf(this.$route.name) !== -1;
    },
    goToList: function() {
      if (this.cnt <= 5) {
        this.cnt++;
        return;
      }
      this.$router
        .push({
          name: "list",
        })
        .catch((err) => err);
    },
    titleClass: function() {
      return "logo " + process.env.VUE_APP_VER;
    },
    logo: function() {
      return "logo/" + process.env.VUE_APP_VER + ".png";
    },
    toggleLan: function() {
      this.$bvModal.show("lan-modal");
    },
    changeLan: function(lang) {
      this._DP("CHANGE_LANGUAGE", lang);
      // this._D("UNSET_GAMES_LIST");
      // this._D("INIT_PAGE");
      // this._GAMSLOAD();

      window.scrollTo({
        top: 0,
      });
      this.$bvModal.hide("lan-modal");
    },
  },
};
</script>
<style lang="scss">
//@import "../assets/funfunquiz/navbar.scss";
//@import "../assets/funfunquiz/common.scss";
</style>
