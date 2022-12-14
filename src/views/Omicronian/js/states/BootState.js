global.PIXI = require("phaser-ce/build/custom/pixi");
global.p2 = require("phaser-ce/build/custom/p2");
global.Phaser = require("phaser-ce");
import AudioController from "../classes/util/AudioController";
import Orientation from "../classes/util/Orientation";

var BootState = {
  init: function() {
    // Responsive scaling
    console.log(global.PIXI);
    console.log(global.Phaser);
    console.log(global.p2);
    console.log(this.game);
    // console.log(game);
    console.log(this)
    this.game.scale.scaleMode = global.Phaser.ScaleManager.SHOW_ALL;

    // Center the this.game
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
  },

  preload: function() {
    this.load.atlasJSONHash(
      "preload",
      "assets/images/preload_atlas.png",
      "assets/images/preload_atlas.json"
    );
  },

  create: function() {
    this.game.stage.backgroundColor = "#fff";

    // add orientation controller
    if (global.Phaser.game.settings.lockOrientation) {
      this.game.orientation = new Orientation(
        this.game.settings.displayOrientation
      );
      this.game.orientation.checkOrientation();
    }

    // add storage controller
    this.game.storage = new Storage(global.Phaser.game.settings.storagePrefix);

    // add audio controller
    this.game.audio = new AudioController();

    if (global.Phaser.game.storage.getItem("levels", "string") === null)
      initLevelData();

    // start preload state
    this.game.state.start("PreloadState");
  },
};

function initLevelData() {
  var levels = [];
  for (var i = 0; i < 30; i++) {
    var level = { unlocked: false, highscore: 0 };
    levels.push(level);
  }
  levels[0].unlocked = true;

  this.game.storage.setItem("levels", JSON.stringify(levels));
}
export { BootState };
