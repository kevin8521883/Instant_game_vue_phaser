import { Scene } from "phaser";
import player from "@/views/phaser_demo/game/assets/player.png";
import background from "@/views/phaser_demo/game/assets/background.png";

export default class gameReplay extends Scene {
  constructor() {
    super({ key: "gameReplay" });
  }
  preload() {
    this.load.image("bg", background);
    this.load.spritesheet("player", player, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
  create() {
    const game = this;
    this.add.image(200, 300, "bg").setScale(0.8);
    this.best = window.localStorage.getItem("Best") || 0;
    this.player = this.physics.add.sprite(200, 260, "player").setScale(0.5);
    this.playBtn = this.add.text(140, 200, `Best:B${this.best}`, {
      color: "#black",
      fontSize: "32px",
    });
    this.playBtn = this.add.text(100, 300, `Replay Game`, {
      color: "#black",
      fontSize: "32px",
      fill: "#eeeeee",
      backgroundColor: "#00db00",
    });
    console.log(this.playBtn);
    this.playBtn.setInteractive({
      useHandCursor: true,
    });
    this.playBtn.on("pointerdown", function() {
      console.log(game);
      game.game.vue.ad();
      game.scene.start("gamePlay");
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 9,
        end: 12,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.player.setInteractive({
      draggable: false,
      dropZone: false,
      useHandCursor: false,
      pixelPerfect: false,
      alphaTolerance: 1,
    });

    this.physics.add.existing(this.player);
    this.player.body.immovable = true;
    this.player.body.moves = false;
    console.log(this);
  }
  update() {
    this.player.anims.play("right", true);
  }
}
