import { Scene } from "phaser";
import player from "@/views/phaser_demo/game/assets/man.png";
import background from "@/views/phaser_demo/game/assets/background.png";
import bgMusic from "@/views/phaser_demo/game/assets/bgMusic.mp3";

export default class gameStart extends Scene {
  constructor() {
    super({ key: "gameStart" });
  }
  preload() {
    this.load.image("bg", background);
    this.load.spritesheet("player", player, {
      frameWidth: 80,
      frameHeight: 110,
    });
    this.load.audio("bgMusic", bgMusic);
  }
  create() {
    const game = this;
    const bg = this.sound.add("bgMusic", {
      volume: 0.1,
      loop: true,
    });
    bg.play();
    this.add.image(200, 300, "bg").setScale(0.8);
    this.player = this.physics.add.sprite(200, 300, "player").setScale(0.5);
    this.playBtn = this.add.text(100, 200, `Start Game`, {
      color: "#black",
      // fontSize: "32px",
      fontSize: "32px",
      fill: "#eeeeee",
      backgroundColor: "#00db00",
      // padding: { x: 15, y: 15 },
    });
    console.log(this.playBtn);
    this.playBtn.setInteractive({
      useHandCursor: true,
    });
    this.playBtn.on("pointerdown", function() {
      console.log(this);
      game.scene.start("gamePlay");
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
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
