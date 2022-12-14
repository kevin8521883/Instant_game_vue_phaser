import { Scene } from "phaser";
import Phaser from "phaser";

// import wall from "@/views/phaser_demo/game/assets/wall.png";
import ceiling from "@/views/phaser_demo/game/assets/ceiling.png";
import normal from "@/views/phaser_demo/game/assets/ground_grass.png";
import nails from "@/views/phaser_demo/game/assets/nails.png";
import assets_sounds_hit from "@/views/phaser_demo/game/assets/assets_sounds_hit.mp3";
import assets_sounds_jump from "@/views/phaser_demo/game/assets/assets_sounds_jump.mp3";
import dead from "@/views/phaser_demo/game/assets/dead.mp3";
import conveyor_left from "@/views/phaser_demo/game/assets/conveyor_left.png";
import conveyor_right from "@/views/phaser_demo/game/assets/conveyor_right.png";
import fake from "@/views/phaser_demo/game/assets/fake.png";
import trampoline from "@/views/phaser_demo/game/assets/trampoline.png";
import player from "@/views/phaser_demo/game/assets/man.png";
import background from "@/views/phaser_demo/game/assets/background.png";
let game;

export default class gamePlay extends Scene {
  constructor() {
    super({ key: "gamePlay" });
  }

  preload() {
    this.load.image("bg", background);
    // this.load.image("wall", wall);
    this.load.image("ceiling", ceiling);
    this.load.image("ground", normal);
    this.load.image("nails", nails);
    this.load.audio("hit", assets_sounds_hit);
    this.load.audio("trampolineJump", assets_sounds_jump);
    this.load.audio("dead", dead);
    this.load.spritesheet("conveyor_left", conveyor_left, {
      frameWidth: 96,
      frameHeight: 16,
    });
    this.load.spritesheet("conveyor_right", conveyor_right, {
      frameWidth: 96,
      frameHeight: 16,
    });
    this.load.spritesheet("fake", fake, {
      frameWidth: 95,
      frameHeight: 36,
    });
    this.load.spritesheet("trampoline", trampoline, {
      frameWidth: 96,
      frameHeight: 22,
    });
    this.load.spritesheet("player", player, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
  create() {
    game = this;
    this.add.image(200, 300, "bg").setScale(0.8);
    console.log("phaser", this, Phaser);
    console.log(this.scale);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    this.cw = 400;
    this.ch = 600;
    this.score = 0;
    this.best = window.localStorage.getItem("Best") || 0;
    this.life = 10;
    this.lifeBar = [];
    for (let i = 0; i < 10; i++) {
      let aLife = this.add.rectangle(30 + 15 * i, 35, 10, 30, "0x00ee00");
      // 將生命值設定在前方
      aLife.setDepth(1);
      this.lifeBar.push(aLife);
    }
    this.speed = 1;
    this.dead_sound = true;
    this.groundArr = [];
    this.game_over = false;
    this.fb_id = window.FBInstant.player.getID();
    console.log(this.fb_id);
    const groundPos = [
      {
        name: "ground",
        x: Phaser.Math.Between(70, this.cw - 70),
        y: this.ch - 0,
        w: 95,
        h: 17,
      },
      {
        name: "ground",
        x: Phaser.Math.Between(70, this.cw - 70),
        y: this.ch - 120,
        w: 95,
        h: 17,
      },
      {
        name: "ground",
        x: Phaser.Math.Between(70, this.cw - 70),
        y: this.ch - 240,
        w: 95,
        h: 17,
      },
      {
        name: "ground",
        x: Phaser.Math.Between(70, this.cw - 70),
        y: this.ch - 360,
        w: 95,
        h: 17,
      },
      {
        name: "ground",
        x: 95,
        y: this.ch - 480,
        w: 95,
        h: 17,
      },
    ];
    console.log(this.facebook);
    const addPhysics = (obg) => {
      this.physics.add.existing(obg);
      obg.body.immovable = true;
      obg.body.moves = false;
    };
    this.sky = this.add.sprite(100, 100, "sky");
    // this.hightLevel = this.add.text(this.cw / 2 - 30, 20, `Best:${this.best}`, {
    //   color: "#black",
    //   fontSize: "25px",
    // });
    this.replay = this.add
      .text(this.cw / 2 - 100, this.ch / 2, "Replay", {
        color: "#black",
        fontSize: "20px",
      })
      .setInteractive({
        useHandCursor: true,
      });
    this.share = this.add
      .text(this.cw / 2 + 50, this.ch / 2, "Share", {
        color: "#black",
        fontSize: "20px",
      })
      .setInteractive({
        useHandCursor: true,
      });
    this.sky.alpha = 0;
    this.replay.alpha = 0;
    this.share.alpha = 0;
    this.scoreText = this.add.text(this.cw - 80, 20, `B${this.score}`, {
      color: "#0000aa",
      fontSize: "40px",
    });
    // this.lifeText = this.add.text(30, 20, `Life:${this.life}`, {
    //   color: "#black",
    //   fontSize: "25px",
    // });
    this.ceiling = this.add.tileSprite(this.cw / 2, 8, this.cw, 15, "ceiling");
    // this.leftWall = this.add.tileSprite(10, this.ch / 2, 20, this.ch, "wall");
    // this.rightWall = this.add.tileSprite(
    //   this.cw - 10,
    //   this.ch / 2,
    //   20,
    //   this.ch,
    //   "wall"
    // );
    this.player = this.physics.add.sprite(100, 50, "player").setScale(0.5);
    this.ceiling.setDepth(8);
    // this.leftWall.setDepth(10);
    // this.rightWall.setDepth(10);
    this.scoreText.setDepth(15);
    // this.lifeText.setDepth(15);
    // this.hightLevel.setDepth(15);
    this.sky.setDepth(20);
    this.share.setDepth(20);
    this.replay.setDepth(20);
    addPhysics(this.ceiling);
    // addPhysics(this.leftWall);
    // addPhysics(this.rightWall);
    this.ceiling.body.checkCollision.up = false;
    this.physics.add.overlap(this.player, this.ceiling, hitCeiling);
    this.player.setBounce(0);
    this.player.hit = true;

    console.log(this.player);
    console.log(this);
    for (let i = 0; i < 5; i++) {
      let name = "ground" + i;
      name = this.add
        .sprite(groundPos[i].x, groundPos[i].y, groundPos[i].name)
        .setScale(0.3);
      addPhysics(name);
      this.groundArr.push(name);
    }
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 9,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 36,
        end: 39,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 8 }],
      repeat: -1,
    });
    this.anims.create({
      key: "conveyor_left",
      frames: this.anims.generateFrameNumbers("conveyor_left", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "conveyor_right",
      frames: this.anims.generateFrameNumbers("conveyor_right", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "trampoline",
      frames: this.anims.generateFrameNumbers("trampoline", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "fake",
      frames: this.anims.generateFrameNumbers("fake", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.physics.add.collider(
      this.player,
      this.groundArr,
      this.touchEffect.bind(this)
    );
    this.share.on("pointerdown", function() {
      game.game.vue.share();
    });
    this.replay.on("pointerdown", function() {
      game.registry.destroy();
      game.events.off();
      game.scene.restart();
    });
    // this.containerW = this.add.text(
    //   30,
    //   this.ch - 100,
    //   `Width:${window.innerWidth}`,
    //   {
    //     color: "#black",
    //     fontSize: "20px",
    //   }
    // );
    // this.containerH = this.add.text(
    //   30,
    //   this.ch - 50,
    //   `Height:${window.innerHeight}`,
    //   {
    //     color: "#black",
    //     fontSize: "20px",
    //   }
    // );
    this.player.setCollideWorldBounds(true);
    this.physics.world.checkCollision.down = false;
    this.physics.world.checkCollision.up = false;
  }
  update() {
    this.lifeBar.forEach((el, idx) => {
      if (idx + 1 > this.life) {
        el.fillColor = "0x555555";
      } else {
        el.fillColor = "0x00ee00";
      }
    });
    if (this.player.y > this.ch || this.life <= 0) {
      // this.sky.alpha += 0.05;
      // this.share.alpha += 0.05;
      // this.replay.alpha += 0.05;
      this.player.anims.play("turn", true);
      this.player.body.checkCollision.down = false;
      if (this.dead_sound) {
        game.sound.play("dead", { volume: 0.5 });
        this.dead_sound = false;
      }
      if (this.score > this.best) {
        window.localStorage.setItem("Best", this.score);
      }
      // game.sound.play("dead", { volume: 0.5 });
      // this.scene.pause();
      if (!this.game_over) {
        setTimeout(() => {
          game.scene.start("gameReplay");
        }, 1000);
        this.game_over = true;
      }

      // this.game.vue.share();
      return;
    }
    // if (this.player.x < 0) {
    //   this.player.x = 0;
    // } else if (this.player.x > 400) {
    //   this.player.x = 400;
    // }
    this.cursors = this.input.keyboard.createCursorKeys();

    for (let i = 0; i < this.groundArr.length; i++) {
      let key = this.groundArr[i].texture.key;
      if (key === "conveyor_left") {
        this.groundArr[i].anims.play("conveyor_left", true);
      } else if (key === "conveyor_right") {
        this.groundArr[i].anims.play("conveyor_right", true);
      } else if (key === "trampoline") {
        this.groundArr[i].anims.play("trampoline", true);
      }
      this.groundArr[i].y -= 1 * this.speed;
      if (this.groundArr[i].y < -10) {
        this.groundArr[i].destroy();
        this.groundArr.splice(i, 1);
        this.scoreText.setText(`B${this.score}`);
        createGround();
      }
    }

    if (
      this.cursors.left.isDown ||
      (this.input.activePointer.isDown && this.input.x < this.cw / 2)
    ) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      this.player.anims.play("left", true);
    } else if (
      this.cursors.right.isDown ||
      (this.input.activePointer.isDown && this.input.x >= this.cw / 2)
    ) {
      this.player.setVelocityX(160);
      this.player.flipX = false;

      this.player.anims.play("left", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-530);
    }
  }
  touchEffect(player, platform) {
    if (platform.texture.key === "conveyor_left" && player.body.touching.down) {
      player.body.x -= 2;
    } else if (
      platform.texture.key === "conveyor_right" &&
      player.body.touching.down
    ) {
      player.body.x += 2;
    } else if (
      platform.texture.key === "trampoline" &&
      player.body.touching.down
    ) {
      game.sound.play("trampolineJump", { volume: 1 });
      player.setVelocityY(-530);
    } else if (platform.texture.key === "fake" && player.body.touching.down) {
      platform.anims.play("fake", true);

      if (!platform.touch) {
        platform.touch = "fake";
        setTimeout(() => {
          platform.body.checkCollision.up = false;
          console.log("fake");
        }, 200);
      }
    } else if (platform.texture.key === "nails" && player.body.touching.down) {
      if (!platform.touch) {
        game.sound.play("hit", { volume: 1 });
        platform.touch = "nails";

        this.life--;
        game.cameras.main.flashEffect.start(255, 255, 0, 0, true);
        // game.lifeText.setText(`Life:${this.life}`);
        if (this.life <= 0) {
          // game.sound.play("dead", { volume: 1 });
          // this.scene.pause();
          // this.game.vue.share();
        }
      }
      // platform.body.checkCollision.up = false;
      // console.log(game);
    } else if (platform.texture.key === "ground" && player.body.touching.down) {
      if (!platform.touch) {
        platform.touch = "platform";
        if (this.life < 10) {
          this.life++;
          // game.lifeText.setText(`Life:${this.life}`);
        }
        console.log(platform.touch);
      }
    }
  }
}

function createGround() {
  switch (game.score) {
    case 10: {
      game.speed = 1.3;
      break;
    }
    case 20: {
      game.speed = 1.5;
      break;
    }
    case 30: {
      game.speed = 2;
      break;
    }
    case 40: {
      game.speed = 2.3;
      break;
    }
  }
  let random = Math.random() * 100;
  let platform;
  const addPhysics = (obg) => {
    game.physics.add.existing(obg);
    obg.body.immovable = true;
    obg.body.moves = false;
  };
  if (random < 40) {
    platform = "ground";
  } else if (random < 50) {
    platform = "nails";
  } else if (random < 60) {
    platform = "fake";
  } else if (random < 80) {
    platform = "trampoline";
  } else if (random < 90) {
    platform = "conveyor_right";
  } else {
    platform = "conveyor_left";
  }
  // console.log(game);
  if (platform === "ground") {
    game.platform = game.add
      .sprite(Phaser.Math.Between(70, game.cw - 70), 600, platform)
      .setScale(0.3);
  } else {
    game.platform = game.add.sprite(
      Phaser.Math.Between(70, game.cw - 70),
      600,
      platform
    );
  }

  addPhysics(game.platform);
  if (platform === "nails") {
    console.log(game.platform);
    // game.platform.enablebody = true;
    console.log(game.platform.body);
    game.platform.body.setSize(96, 1);
    // setTimeout(() => {}, 1000);

    // game.platform.setOffset();
  }
  game.platform.touch = null;
  game.physics.add.collider(game.platform, game.player);
  game.groundArr.push(game.platform);
  game.score++;
}
function hitCeiling() {
  if (game.player.hit) {
    game.player.hit = false;
    // game.player.setTint(0xff0000);
    game.player.body.checkCollision.down = false;
    game.cameras.main.flashEffect.start(255, 255, 0, 0, true);
    game.sound.play("hit", { volume: 1 });
    game.life -= 3;
    // if (game.life <= 0) {
    //   game.sound.play("dead", { volume: 0.5 });
    // }
    // game.lifeText.setText(`Life:${game.life}`);
    setTimeout(() => {
      game.player.body.checkCollision.down = true;
      // game.player.clearTint();
    }, 100);
    setTimeout(() => {
      game.player.hit = true;
      // game.player.clearTint();
    }, 1500);
  }
}
