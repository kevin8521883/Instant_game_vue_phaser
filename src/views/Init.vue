<template>
  <div>
    <div class="container base playpage">
      <div class="home">Loading...</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  mounted() {},
  async created() {
    console.log("48646785454672");
    await this._APPINIT();
    this._LOAD_INTERSTITIAL();

    this.$router.push("/puzzle");
    // return await window.FBInstant.startGameAsync();
  },
};
</script>
