import Phaser from "phaser";
import { config, game_data, draw_button } from "./game";

class Load extends Phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    this.add.sprite(360, 540, "bg_menu");
    this.add.sprite(0, 0, "header").setOrigin(0);
    this.add.sprite(0, config.height, "footer").setOrigin(0, 1);
    this.add.sprite(360, 315, "game_title");
    let bar = this.add.rectangle(config.width / 2, 600, 600, 20);
    bar.setStrokeStyle(4, 0xffffff);
    bar.alpha = 0.7;
    let progress = this.add.rectangle(config.width / 2, 600, 590, 10, 0xffffff);
    progress.alpha = 0.8;
    this.load.on("progress", (value) => {
      progress.width = 590 * value;
    });
    this.load.on(
      "complete",
      () => {
        bar.destroy();
        progress.destroy();
        let b_start = draw_button(360, 700, "start", this);
        this.tweens.add({
          targets: b_start,
          alpha: 0.5,
          yoyo: true,
          duration: 300,
          loop: -1,
        });
      },
      this
    );
    this.input.on(
      "gameobjectdown",
      () => {
        this.scene.start("menu");
      },
      this
    );
    //
    this.load.image("bg_game", require("@/views/Connector/img/bg_game.png"));
    this.load.image(
      "window_big",
      require("@/views/Connector/img/window_big.png")
    );
    this.load.image(
      "window_small",
      require("@/views/Connector/img/window_small.png")
    );
    this.load.image("coin_bar", require("@/views/Connector/img/coin_bar.png"));
    this.load.image(
      "level_bar",
      require("@/views/Connector/img/level_bar.png")
    );
    this.load.spritesheet("lamp", require("@/views/Connector/img/lamp.png"), {
      frameWidth: 144,
      frameHeight: 144,
    });
    this.load.spritesheet("guide", require("@/views/Connector/img/guide.png"), {
      frameWidth: 124,
      frameHeight: 280,
    });
    this.load.image("tile0", require("@/views/Connector/img/tile0.png"));
    this.load.image("tile1", require("@/views/Connector/img/tile1.png"));
    this.load.image("tile2", require("@/views/Connector/img/tile2.png"));
    this.load.image("tile3", require("@/views/Connector/img/tile3.png"));
    this.load.image("btn_hint", require("@/views/Connector/img/btn_hint.png"));
    this.load.image("btn_next", require("@/views/Connector/img/btn_next.png"));
    this.load.image("btn_home", require("@/views/Connector/img/btn_home.png"));
    this.load.image("btn_exit", require("@/views/Connector/img/btn_exit.png"));
    this.load.image(
      "btn_close",
      require("@/views/Connector/img/btn_close.png")
    );
    this.load.image("btn_play", require("@/views/Connector/img/btn_play.png"));
    this.load.image(
      "btn_pay_hint",
      require("@/views/Connector/img/btn_pay_hint.png")
    );
    this.load.image(
      "btn_sound_on",
      require("@/views/Connector/img/btn_sound_on.png")
    );
    this.load.image(
      "btn_sound_off",
      require("@/views/Connector/img/btn_sound_off.png")
    );
    this.load.image(
      "btn_close_small",
      require("@/views/Connector/img/btn_close_small.png")
    );
    this.load.image("1x", require("@/views/Connector/img/1x.png"));
    this.load.image("5x", require("@/views/Connector/img/5x.png"));
    this.load.image("7x", require("@/views/Connector/img/7x.png"));
    this.load.image("8x", require("@/views/Connector/img/8x.png"));
    this.load.image("12x", require("@/views/Connector/img/12x.png"));

    for (let i = 1; i <= 15; i++) {
      this.load.image(
        String(i),
        require("@/views/Connector/img/" + i + ".png")
      );
    }
    //Load all levels
    // this.load.json("level-1", level1);
    for (let i = 1; i <= game_data.total_level; i++) {
      this.load.json(
        "level-" + i,
        require("@/views/Connector/level/level-" + i + ".json")
      );
    }
    //Load add sounds

    this.load.audio(
      "completed",
      require("@/views/Connector/audio/completed.mp3")
    );
    this.load.audio("click", require("@/views/Connector/audio/click.mp3"));
    this.load.audio("fill", require("@/views/Connector/audio/fill.mp3"));
    this.load.audio("hint", require("@/views/Connector/audio/hint.mp3"));
    this.load.audio("pop", require("@/views/Connector/audio/pop.mp3"));
  }
}
export { Load };
