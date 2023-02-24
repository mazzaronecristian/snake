class Apple {
  constructor(x, y, size) {
    this.size = size;
    this.x = x * size;
    this.y = y * size;
  }
}
class Snake {
  constructor(x, y, size) {
    this.size = size;
    this.x = x * size;
    this.y = y * size;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
    this.dead = false;
  }

  move() {
    var newRect;
    if (this.rotateX == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    }
    if (this.rotateX == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    }
    if (this.rotateY == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size,
      };
    }
    if (this.rotateY == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size,
      };
    }

    this.tail.shift();
    this.tail.push(newRect);
  }

  checkCollisions() {
    var head = this.tail[this.tail.length - 1];
    if (head.x == 600 || head.x == -20 || head.y == 600 || head.y == -20)
      this.dead = true;
    for (var i = 0; i < this.tail.length - 1; i++) {
      if (head.x == this.tail[i].x && head.y == this.tail[i].y)
        this.dead = true;
    }
  }
  grow(x, y) {
    var newRect = { x: x, y: y };
    this.tail.push(newRect);
  }
  shrink() {
    if (this.tail.length > 0) this.tail.pop();
    else this.dead = true;
  }
}

class Mine {
  constructor(x, y, size) {
    this.x = x * size;
    this.y = y * size;
    this.size = size;
    this.timeAlive = 0;
  }
}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
var xSnake = Math.floor(Math.random() * 18) + 10;
var ySnake = Math.floor(Math.random() * 18);

var xApple = Math.floor(Math.random() * 28);
var yApple = Math.floor(Math.random() * 28);
var snake = new Snake(xSnake, ySnake, 20);
var apple = new Apple(xApple, yApple, snake.size);
var mines = [];
window.onload = () => {
  gameLoop();
};

function gameLoop() {
  setInterval(show, 1000 / 10); //12 fps
}

function show() {
  draw();
  update();
}

function update() {
  snake.checkCollisions();
  if (!snake.dead) {
    eatMine();
    eatApple();
    snake.move();
  }
  createMine();
}
function createMine() {
  var n = Math.floor(Math.random() * 1500);
  if (n > 1475 && mines.length < 50) {
    var xMine = Math.floor(Math.random() * 28);
    var yMine = Math.floor(Math.random() * 28);
    if (xMine != apple.x && yMine != apple.y) {
      var mine = new Mine(xMine, yMine, snake.size);
      mines.push(mine);
    }
  }
}
function eatMine() {
  for (var i = 0; i < mines.length; i++) {
    if (
      snake.tail[snake.tail.length - 1].x == mines[i].x &&
      snake.tail[snake.tail.length - 1].y == mines[i].y
    ) {
      mines = [0];
      for (var j = 0; j < 5; j++) snake.shrink();
    }
  }
}
function eatApple() {
  if (
    snake.tail[snake.tail.length - 1].x == apple.x &&
    snake.tail[snake.tail.length - 1].y == apple.y
  ) {
    snake.grow(apple.x, apple.y);
    xApple = Math.floor(Math.random() * 28);
    yApple = Math.floor(Math.random() * 28);
    let occupied = false;
    for (var i = 0; i < mines.length; i++) {
      if (xApple == mines[i].x && yApple == mines[i].y) {
        occupied = true;
        break;
      }
    }
    if (!occupied) apple = new Apple(xApple, yApple, snake.size);
  }
}

function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "black");
  createRect(
    apple.x + 2.5,
    apple.y + 2.5,
    apple.size - 5,
    apple.size - 5,
    "red"
  );
  console.log(mines.length);
  for (var i = 0; i < mines.length; i++)
    createRect(
      mines[i].x + 2.5,
      mines[i].y + 2.5,
      mines[i].size - 5,
      mines[i].size - 5,
      "yellow"
    );
  for (var i = 0; i < snake.tail.length; i++)
    createRect(
      snake.tail[i].x + 2.5,
      snake.tail[i].y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "white"
    );

  if (snake.dead) {
    canvasContext.font = "50px Arial";
    canvasContext.fillStyle = "#00FF42";
    canvasContext.fillText(
      "GAME OVER",
      canvas.width - 452,
      canvas.height - 300
    );
  }

  canvasContext.font = "20px Arial";
  canvasContext.fillStyle = "#00FF42";
  canvasContext.fillText("Score: " + snake.tail.length, canvas.width - 110, 25);
}

function createRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    snake.rotateX = 0;
    snake.rotateY = 0;
    snake.rotateY = -1;
  }

  if (event.key == "ArrowDown") {
    snake.rotateX = 0;
    snake.rotateY = 0;
    snake.rotateY = 1;
  }
  if (event.key == "ArrowRight") {
    snake.rotateX = 0;
    snake.rotateY = 0;
    snake.rotateX = 1;
  }

  if (event.key == "ArrowLeft") {
    snake.rotateX = 0;
    snake.rotateY = 0;
    snake.rotateX = -1;
  }
});
