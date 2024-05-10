//board
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;

//bird
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdHeight = 12 * 2;
let birdWidth = 17 * 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  height: birdHeight,
  width: birdWidth,
};
//pipes
let pipesArray = [];
let pipeWidth = 1 * 64;
let pipeHeight = 8 * 64; //512 //128 //256
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let score = 0;
let gameOver = false;
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };
  topPipeImg = new Image();
  topPipeImg.src = "toppipe.png";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("GAME OVER", 10, 90);
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  // birdY += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  if (bird.y > board.height) {
    gameOver = true;
  }
  for (let i = 0; i < pipesArray.length; i++) {
    let pipe = pipesArray[i];
    detectCollision(bird, pipe);
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score = score + 0.5;
      pipe.passed = true;
    }
  }
  while (pipesArray.length > 0 && pipesArray[0].x + pipesArray[0].width < 0) {
    pipesArray.shift();
  }
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText(score, 10, 45);
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let openSpace = boardWidth / 4;
  let topPipeY = -pipeHeight / 4 - (Math.random() * pipeHeight) / 2;
  let bottomPipeY = topPipeY + openSpace + pipeHeight;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: topPipeY,
    height: pipeHeight,
    width: pipeWidth,
    passed: false,
  };
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: bottomPipeY,
    height: pipeHeight,
    width: pipeWidth,
    passed: false,
  };
  pipesArray.push(topPipe, bottomPipe);
}
function moveBird(key) {
  if (key.code == "Space" || key.code == "ArrowUp" || key.code == "KeyX") {
    velocityY = -6;
    if (gameOver) {
      bird.y = birdY;
      score = 0;
      pipesArray = [];
      gameOver = false;
    }
  }
}
function detectCollision(a, b) {
  if (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  ) {
    gameOver = true;
  }
}
