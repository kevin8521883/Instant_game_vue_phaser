<template>
  <div id="app">
    <div>
      <Navbar ref="navbar"></Navbar>
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/_Navbar";
export default {
  name: "App",
  components: { Navbar },
};
</script>

<style>
#id {
  background: white;
}
</style>