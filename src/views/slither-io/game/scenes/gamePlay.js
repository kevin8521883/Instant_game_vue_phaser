import { Scene } from "phaser";
import Phaser from "phaser";
import Util from "../js/util";
import Food from "../js/food";
import PlayerSnake from "../js/playerSnake";
import BotSnake from "../js/botSnake";
export default class gamePlay extends Scene {
  constructor() {
    super({ key: "gamePlay" });
  }
  preload() {
    //load assets
    console.log(this);
    this.load.image("circle", "../../asset/circle.png");
    this.load.image("shadow", "asset/white-shadow.png");
    this.load.image("background", "asset/tile.png");

    this.load.image("eye-white", "asset/eye-white.png");
    this.load.image("eye-black", "asset/eye-black.png");

    this.load.image("food", "asset/hex.png");
  }
  create() {
    let width = this.game.width;
    let height = this.game.height;

    this.game.world.setBounds(-width, -height, width * 2, height * 2);
    this.game.stage.backgroundColor = "#444";

    //add tilesprite background
    this.game.add.tileSprite(
      -width,
      -height,
      this.game.world.width,
      this.game.world.height,
      "background"
    );

    //initialize physics and groups
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.foodGroup = this.game.add.group();
    this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();

    //add food randomly
    for (let i = 0; i < 100; i++) {
      this.initFood(
        Util.randomInt(-width, width),
        Util.randomInt(-height, height)
      );
    }

    this.game.snakes = [];

    //create player
    let snake = new PlayerSnake(this.game, "circle", 0, 0);
    this.game.camera.follow(snake.head);

    //create bots
    new BotSnake(this.game, "circle", -200, 0);
    new BotSnake(this.game, "circle", 200, 0);

    //initialize snake groups and collision
    for (let i = 0; i < this.game.snakes.length; i++) {
      let snake = this.game.snakes[i];
      snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
      snake.head.body.collides([this.foodCollisionGroup]);
      //callback for when a snake is destroyed
      snake.addDestroyedCallback(this.snakeDestroyed, this);
    }
  }
  /**
   * Main update loop
   */
  update() {
    //update game components
    for (let i = this.game.snakes.length - 1; i >= 0; i--) {
      this.game.snakes[i].update();
    }
    for (let i = this.foodGroup.children.length - 1; i >= 0; i--) {
      let f = this.foodGroup.children[i];
      f.food.update();
    }
  }
  /**
   * Create a piece of food at a point
   * @param  {number} x x-coordinate
   * @param  {number} y y-coordinate
   * @return {Food}   food object created
   */
  initFood(x, y) {
    let f = new Food(this.game, x, y);
    f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
    this.foodGroup.add(f.sprite);
    f.sprite.body.collides([this.snakeHeadCollisionGroup]);
    return f;
  }
  snakeDestroyed(snake) {
    //place food where snake was destroyed
    for (
      let i = 0;
      i < snake.headPath.length;
      i += Math.round(snake.headPath.length / snake.snakeLength) * 2
    ) {
      this.initFood(
        snake.headPath[i].x + Util.randomInt(-10, 10),
        snake.headPath[i].y + Util.randomInt(-10, 10)
      );
    }
  }
}
