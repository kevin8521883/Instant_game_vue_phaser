<template>
  <div class="container base playpage">
    <div class="row">
      <div class="form-block">
        <b-form-select v-model="cform.sortBy" @change="loadgames()" :options="sort_type"></b-form-select>
        <b-form-select v-model="cform.time_range" @change="loadgames()" :options="time_range"></b-form-select>
      </div>
      <div class="mb">
        <br />
        <br />
      </div>
      <div class="col-md-12 col-xs-12" v-for="(item, index) in games" :key="index">
        <div @click="_BEFORE_AD(item.games_info)">
          <div class="game-list">
            <img style="width:100%;" :src="item.games_info.cover_img" />
            <div class="game-info-edit">
              時間: {{item.date_at }}
              <br />
              遊戲數: {{item.total_views }}
              <br />
              分享數: {{item.total_shares }}
              <br />
              分享率: {{item.shares_score }}
            </div>
            <div class="img-overlay"></div>
            <div class="game-title-box">
              <h5 class="game-title">{{ item.games_info.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BFormSelect } from "bootstrap-vue";
export default {
  components: {
    BFormSelect,
  },
  data() {
    return {
      cform: {
        sortBy: "total_shares",
        time_range: 2,
      },
      games: [],
      sort_type: [
        { value: "total_views", text: "遊戲數" },
        { value: "total_shares", text: "分享數" },
        { value: "shares_score", text: "分享率" },
      ],
      time_range: [
        { value: "1", text: "今天" },
        { value: "2", text: "一周" },
        { value: "3", text: "一個月" },
        { value: "4", text: "三個月" },
      ],
    };
  },
  methods: {
    loadgames: function () {
      this.axios({
        crossDomain: true,
        url: "/v1/editor/games",
        method: "post",
        data: this.cform,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.status) this.games = res.data.data;
          window.scrollTo({
            top: 0,
            //   behavior: "smooth"
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.loadgames();
  },
  created() {
    window.scrollTo({
      top: 0,
      //   behavior: "smooth"
    });
  },
};
</script>

<style lang="scss" scoped>
.game-info-edit {
  top: 5px;
  position: absolute;
  right: 10px;
  z-index: 102;
  font-size: inherit;
  color: white;
  background: #565555a6;
  float: left;
  padding: 5px;
}
.form-block {
  position: fixed;
  z-index: 500;
  padding: 12px;
  display: inline-flex;
}
.mb {
  margin-bottom: 20px;
  width: 100%;
}
</style>