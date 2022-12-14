<template>
  <div class="container base playpage">
    <b>APP設定</b>
    <hr />
    <b-form-checkbox
      id="checkbox-1"
      v-model="editor_config.mode"
      value="true"
      unchecked-value="false"
      name="checkbox-1"
      >編輯者模式</b-form-checkbox
    >
    <b-form-checkbox
      id="checkbox-2"
      v-model="editor_config.show_ad"
      value="true"
      unchecked-value="false"
      name="checkbox-2"
      >顯示廣告</b-form-checkbox
    >

    <br />
    <div class="btn btn-info" @click="save()">儲存設定</div>
    <hr />
    <div class="row">
      <div
        class="col-md-12 col-xs-12"
        style="color: white; width: 100%; min-height: 200px"
      >
        <b>檢測遊戲</b>
        <hr />
        <input
          type="text"
          style="width: 120px; display: inline-block"
          placeholder="編號"
          class="form-control"
          v-model="to_id"
        />
        <hr />
        <div class="btn btn-info" @click="go()">前往</div>
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-12 col-xs-12"
        style="color: white; width: 100%; min-height: 200px"
      >
        <b>APP資訊</b>
        {{ $store.state.info }}
      </div>
    </div>
  </div>
</template>


<script>
import { BFormCheckbox } from "bootstrap-vue";
export default {
  components: {
    BFormCheckbox,
  },
  data() {
    return {
      editor_config: {},
      to_id: "",
    };
  },
  methods: {
    save: function () {
      let config = JSON.parse(JSON.stringify(this.editor_config));
      this._D("SET_EDITOR_INFO", config);
    },
    go() {
      this._DP("UNSET_PLAY_GAME");
      this.$router.push({
        name: "play",
        params: {
          id: this.to_id,
        },
      });
    },
  },
  created() {
    this.editor_config = JSON.parse(
      JSON.stringify(this.$store.state.funfunquiz.editorinfo)
    );
  },
};
</script>