import Phaser from "phaser";
// import BootScene from "./scenes/BootScene";
// import PlayScene from "./scenes/PlayScene";
import gamePlay from "./scenes/gamePlay";
function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.CANVAS,

    physics: {
      default: "arcade",
      arcade: {
        // gravity: { y: 1000 },
        // debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      parent: containerId,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 500,
    },
    scene: [gamePlay],
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
