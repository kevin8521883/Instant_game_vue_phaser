import Phaser from "phaser";
// import BootScene from "./scenes/BootScene";
import gamePlay from "./scenes/gamePlay";
import gameStart from "./scenes/gameStart";
import gameReplay from "./scenes/gameReplay";
// import PlayScene from "./scenes/PlayScene";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.CANVAS,

    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 },
        // debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      parent: containerId,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 400,
      height: 600,
    },
    scene: [gameStart, gamePlay, gameReplay],
    audio: {
      // disableWebAudio: true,
    },
  });
}
function resize() {
  return { width: window.innerWidth };
}
// export default launch;
export { launch, resize };
