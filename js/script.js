// snakeGame.js

class SnakeGame {
  constructor(boardId) {
    this.inputDirection = { x: 0, y: 0 };
    this.foodSound = new Audio("food.mp3");
    this.gameOverSound = new Audio("game-over.mp3");
    this.moveSound = new Audio("move.mp3");
    this.musicSound = new Audio("bg-music.mp3");
    this.speed = 2;
    this.lastPaintTime = 0;
    this.snake = [{ x: 13, y: 13 }];
    this.food = { x: 3, y: 5 };
    this.board = document.getElementById(boardId);

    this.init();
  }

  init() {
    window.requestAnimationFrame(this.main.bind(this));
    window.addEventListener("keydown", this.handleKeydown.bind(this));
    this.musicSound.play();
  }

  main(ctime) {
    window.requestAnimationFrame(this.main.bind(this));
    if ((ctime - this.lastPaintTime) / 1000 < 1 / this.speed) return;
    this.lastPaintTime = ctime;
    this.gameEngine();
  }

  isCollide() {
    for (let i = 1; i < this.snake.length; i++) {
      if (
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y
      ) {
        return true;
      }
    }

    const head = this.snake[0];
    return head.x >= 18 || head.x < 0 || head.y >= 18 || head.y < 0;
  }

  gameEngine() {
    if (this.isCollide()) {
      this.gameOverSound.play();
      this.musicSound.pause();
      this.inputDirection = { x: 0, y: 0 };
      alert("Game Over. Press Any key to play again");
      this.snake = [{ x: 13, y: 13 }];
      this.musicSound.play();
    }

    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      this.foodSound.play();
      this.snake.unshift({
        x: this.snake[0].x + this.inputDirection.x,
        y: this.snake[0].y + this.inputDirection.y,
      });

      const a = 2,
        b = 16;
      this.food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random()),
      };
    }

    for (let i = this.snake.length - 2; i >= 0; i--) {
      this.snake[i + 1] = { ...this.snake[i] };
    }

    this.snake[0].x += this.inputDirection.x;
    this.snake[0].y += this.inputDirection.y;

    this.render();
  }

  render() {
    this.board.innerHTML = "";

    this.snake.forEach((segment, index) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.gridRowStart = segment.y;
      snakeElement.style.gridColumnStart = segment.x;
      snakeElement.classList.add(index === 0 ? "head" : "snake");
      this.board.appendChild(snakeElement);
    });

    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = this.food.y;
    foodElement.style.gridColumnStart = this.food.x;
    foodElement.classList.add("food");
    this.board.appendChild(foodElement);
  }

  handleKeydown(e) {
    try {
      this.moveSound.play();
    } catch (e) {
      console.log(e);
    }
    switch (e.key) {
      case "ArrowUp":
        this.inputDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        this.inputDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        this.inputDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        this.inputDirection = { x: 1, y: 0 };
        break;
    }
  }
}

// main.js
// Instantiate the game
const game = new SnakeGame("board");
