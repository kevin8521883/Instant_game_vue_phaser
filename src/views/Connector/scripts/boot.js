import Phaser from "phaser";

class Boot extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  preload() {
    this.load.image("bg_menu", require("@/views/Connector/img/bg_menu.png"));
    this.load.image(
      "game_title",
      require("@/views/Connector/img/game_title.png")
    );
    this.load.image("header", require("@/views/Connector/img/header.png"));
    this.load.image("footer", require("@/views/Connector/img/footer.png"));
    this.load.image("btn_start", require("@/views/Connector/img/btn_start.png"));
  }
  create() {
    this.scale.stopListeners();
    this.scene.start("preload");
  }
}

export { Boot };
