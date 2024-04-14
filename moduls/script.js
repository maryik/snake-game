const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const background = new Image();
background.src = "img/game_board.png";

const foodImage = new Image();
foodImage.src = "img/food.png";

let box = 32;
let score = 0;

let food = {
 x: Math.floor((Math.random() * 17 + 1)) * box,
 y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
 x: 9 * box,
 y: 10 * box,
};

const btnRepeat = document.querySelector(".repeat");
btnRepeat.addEventListener("click", () => {
    // Reset the snake to the center of the canvas
    snake = [{
        x: 9 * box,
        y: 10 * box,
    }];

    // Reset the score to 0
    score = 0;

    // Reset the food to a random position
    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box,
    };

    // Reset the speed increment to 0
    speedIncrement = 0;

    // Reset the collision detection flag
    collisionDetected = false;

    // Clear the existing interval and start a new game loop
    clearInterval(startGame);
    startGame = setInterval(gameLoop, speed + speedIncrement);
});


document.addEventListener("keydown", direction);
let dir;

function direction(event) {
 if ((event.keyCode == 37 || event.code == 'KeyA') && dir != "right") dir = "left";
 if ((event.keyCode == 38 || event.code == 'KeyW') && dir != "down") dir = "up";
 if ((event.keyCode == 39 || event.code == 'KeyD') && dir != "left") dir = "right";
 if ((event.keyCode == 40 || event.code == 'KeyS') && dir != "up") dir = "down";
}

function eatTail(head, array) {
 for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      clearInterval(startGame);
      ctx.fillStyle = "red";
      ctx.font = "50px Arial";
      ctx.fillText("Game Over", box * 6, box * 10);
    }
 }
}

let speed = 200; // Изначальная скорость
let speedIncrement = 0; // Увеличение скорости после 15 очков
let collisionDetected = false; // Флаг для отслеживания столкновения

function drawGame() {
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(foodImage, food.x, food.y);
    for (let i = 0; i < snake.length; i++) {
       ctx.fillStyle = "green";
       ctx.fillRect(snake[i].x, snake[i].y, box, box);
       if (i === 0) {
         ctx.fillStyle = "red";
         ctx.fillRect(snake[i].x + box / 8, snake[i].y + box / 8, box / 4, box / 4);
         ctx.fillRect(snake[i].x + box * 2.5 / 4, snake[i].y + box / 8, box / 4, box / 4);
       }
    }
   
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);
   
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
   
    if (snakeX === food.x && snakeY === food.y) {
       score++;
       // Check if score is a multiple of 5 and adjust speed accordingly
       if(score === 40) {
           ctx.fillStyle = "red";
           ctx.font = "50px Arial";
           ctx.fillText("YOU WIN", box * 6, box * 10);
           clearInterval(startGame);
           return;
       }
       if (score % 5 === 0 && speedIncrement < 100) {
         speedIncrement -= 10;
         // Clear the existing interval and set a new one with the updated speed
         clearInterval(startGame);
         startGame = setInterval(gameLoop, speed + speedIncrement);
       }
       food = {
         x: Math.floor((Math.random() * 17 + 1)) * box,
         y: Math.floor((Math.random() * 15 + 3)) * box,
       };
    } else {
       snake.pop();
    }
   
    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
       clearInterval(startGame);
       ctx.fillStyle = "red";
       ctx.font = "50px Arial";
       ctx.fillText("Game Over", box * 6, box * 10);
       collisionDetected = true; // Установка флага столкновения
    }
   
    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;
   
    let newHead = {
       x: snakeX,
       y: snakeY,
    };
   
    eatTail(newHead, snake);
    snake.unshift(newHead);
}

function gameLoop() {
 if (collisionDetected) {
    clearInterval(startGame);
    return;
 }
 drawGame();
}

let startGame = setInterval(gameLoop, speed + speedIncrement); // Corrected: Add speedIncrement to speed
