// Sounds

const hitPaddle = new Audio('Sounds/270343__littlerobotsoundfactory__shoot-01.wav');
const hitBrick = new Audio('Sounds/270303__littlerobotsoundfactory__collect-point-01.wav');
const gameLose = new Audio('Sounds/270329__littlerobotsoundfactory__jingle-lose-00.wav');
const gameWinSound = new Audio('Sounds/341985__unadamlar__goodresult.wav');
const gameStart = new Audio('Sounds/game-start-6104.mp3');
const levelOneMusic = new Audio("Sounds/slowLevel.mp3");
const levelTwoMusic = new Audio("Sounds/normal.mp3");
const levelThreeMusic = new Audio("Sounds/Faster.mp3");

// Dom Elements

const button = document.createElement('button');
const button2 = document.createElement('button');
button2.setAttribute('id', "new-game")
button2.innerHTML = "NEW GAME"
const h2 = document.createElement('h2')
h2.innerHTML = "YOU WIN!"
const span = document.getElementById('span');
const div = document.getElementById('div');
button.innerHTML = "RESTART";


const interval = setInterval(updateGameArea, 20);

// Variables to be changed based on condition (Score, Current level, lives)

let life = 4;
let changeScore = 0;
let levelCount = 1;

// Draws Canvas on document directly from the JS, as well as functions to clear canvas and stop animations

const myGameArea = {
    canvas: document.createElement('canvas'),
    start: function(){
        this.canvas.width = 900;
        this.canvas.height = 500;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
     clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     },
     stop: function() {
        clearInterval(this.interval);
      }
     
};

const ctx = myGameArea.context;

// Class component reused for bricks, ball and paddle. Update, newPos and move are for the purpose of updating the game area every redraw

class Component {
    constructor(width, height, color, x, y, velocityX, velocityY){
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this. speedY = 0;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.speedReverse = 900;
        
    }
    update(){
        const ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos(){
        
        this.y += this.speedY;
        if (this.x < 0){
            this.x =+ this.speedX;
       } else if (this.x > myGameArea.canvas.width - 172){
        this.x = myGameArea.canvas.width - 172;
        this.x -= this.speedX;
       }
        else {
        this.x += this.speedX;
       }
        
    }

    move(){
        this.x += this.velocityX
        this.y += this.velocityY;
    }
    }


// Class used for creating an image and keeping it drawn on the screen every frame. Reused for level and lives

class ImageComponent {
  constructor(src, x, y, width, height){
    this.image = new Image();
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  update(){
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}
}

// Class used for creating text items and keeping them drawn on the screen every frame. Reused for score and lives

class TextComponent{
  constructor(text, x, y, font, color){
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.color = color;
    this.score = changeScore
  }
  update(){
    const ctx = myGameArea.context;
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    
    ctx.fillText(this.text, this.x, this.y);
    }
}


// All components and their initial properties

const score = new TextComponent(`Score: ${changeScore}`, 20, 30, "20px Lucida Console", "black");

const level = new TextComponent(`${levelCount}`,450, 35, "30px Lucida Console",
"black");

const player = new Component(175, 20, '#C0DEFF', 350, 480);
const ball = new Component(20, 20, "white", 440, 200, 0, 0);

const lives = [
  new ImageComponent("Images/87.png", 862, 15, 20, 20),
  new ImageComponent("Images/87.png", 840, 15, 20, 20),
  new ImageComponent("Images/87.png", 818, 15, 20, 20)
];

const levelImg = new ImageComponent("Images/clipart851029.png",425 ,15, 20, 20)



// Function that is the equivalent of "Draw" from examples in class. Keeps all items on canvas every time it is redrawn and checks for collision on every frame 

function updateGameArea(){
    myGameArea.clear();
    player.newPos();
    player.update();
    bricks.forEach(function(brick){
        brick.update();
      });
      ball.move();
      ball.update();
      lives.forEach(function(life) {
        life.update();
    });
    score.update();
    levelImg.update();
    level.update();
      stopVelocity();
      collisionDetectionPlayer();
      collisionDetectionWall();
      collisionDetectionBrick();
      
}


// Variables for brick and column count set in a global scope so they can be changed every level

let brickColumnCount = 3;
let brickRowCount = 8;



// Array that bricks will be pushed into and later taken out of once collision is detected 

let bricks = [];


    const brickWidth = 100;
    const brickHeight = 22;
    const brickPadding = 10;
    const brickOffsetTop = 70;
    const brickOffsetLeft = 15;


//  Function to generate bricks based on properties above 

    function generateBricks(){
   for (let c = 0; c < brickColumnCount; c++){
    for (let r = 0; r < brickRowCount; r++){
        const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (c * (brickHeight + brickPadding) + brickOffsetTop);
      
     const brick = new Component (brickWidth, brickHeight, "red", brickX, brickY);
      bricks.push(brick);
    }
  }
}

/* Function that detects collision between the ball and the bricks and removes from array if collision is detected,
also changes score based on collision detection and checks for next level based on score

*/

function collisionDetectionBrick(){
    for(let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const b = bricks[c * brickRowCount + r];
            if ((ball.x > b.x && ball.x < b.x + b.width +10 || ball.x + ball.width > b.x && ball.x + ball.width < b.x + b.width) && (ball.y > b.y && ball.y < b.y + b.height + 5 || ball.y + ball.height > b.y && ball.y + ball.height < b.y + b.height))  {
              ball.velocityY = -ball.velocityY;
                bricks.splice(c * brickRowCount + r, 1);
                hitBrick.play();
                changeScore++;
                score.text = `Score: ${changeScore}`;
                nextLevel(); 
            }
        }
    }
}

/* Function that detects collision between ball and player and changes ball direction based on 
what side of the paddle ball lands on paddle
*/
function collisionDetectionPlayer() {
    if (ball.x + ball.width > player.x && ball.x < player.x + player.width &&
        ball.y + ball.height > player.y && ball.y < player.y + player.height) {
        ball.velocityY = -ball.velocityY;
        ball.velocityY -= 2;
        hitPaddle.play();
        if(ball.x < player.x + player.width/2){
          ball.velocityX -= 3;
        }else{
          ball.velocityX += 3;
        }
    } 
}

// Collision detection between ball and 4 walls, bottom wall decrements life variable and checks for lose condition

function collisionDetectionWall(){
    if (ball.y > 500 - 20){
       life--;
       updateLives();
       resetBall();
       gameOver();
     } if (ball.x < 0){
        ball.velocityX = -ball.velocityX;
        ball.velocityX = ball.velocityX + 0.5;
     } if (ball.x > 900 - 20){
        ball.velocityX = -ball.velocityX;
     } if (ball.y < 0 ){
        ball.velocityY = -ball.velocityY;
     } if (player.x === 500){
        player.speedX = 0;
     } if (player.x === 0){
        player.speedX === 0;
     }
    }

 let maxVelocityX = 6;
 let maxVelocityY = 5;

// Function I implemented to stop glitch where ball would clip through wall once a certain velocity was reached

function stopVelocity(){
    if (ball.velocityX > maxVelocityX + 1) {
        ball.velocityX = maxVelocityX;
      }
      if (ball.velocityY > maxVelocityY + 3) {
        ball.velocityY = maxVelocityY;
      } if (ball.velocityX < -maxVelocityX - 1) {
        ball.velocityX = -maxVelocityX;
      } if (ball.velocityY < maxVelocityY - 3) {
        ball.velocityY = -maxVelocityY;
      } 
}


// Function that changes level, redraws incremented bricks, and changes ball speed based on score check

function nextLevel(){
   if(changeScore == 24){
    levelOneMusic.pause();
    levelTwoMusic.play();
    levelCount++;
    level.text = `${levelCount}`;
    resetBall();
    brickColumnCount++;
    generateBricks();
    maxVelocityX = 5;
    maxVelocityY = 6;
  } else if (changeScore == 56){
    levelTwoMusic.pause();
    levelThreeMusic.play();
    levelCount++;
    level.text = `${levelCount}`;
    resetBall();
    brickColumnCount++;
    generateBricks();
    maxVelocityX = 6;
    maxVelocityY = 8;
  } else if (changeScore == 96){
    levelThreeMusic.pause();  
    gameWin();
  }
}

// Two functions which clear canvas and add dom elements if game win or game lose condition is met

function gameWin(){
  clearInterval(interval);
  gameWinSound.play();
  myGameArea.clear();
  document.body.appendChild(h2);
  document.body.appendChild(button2);
}

function gameOver(){
  if (life <= 0){
    levelOneMusic.pause();
    levelTwoMusic.pause();
    levelThreeMusic.pause();
    clearInterval(interval);
    gameLose.play();
    myGameArea.clear();
    document.body.appendChild(button);
  }
}


// Function to reset ball on life being lost or level going up

function resetBall(){
  ball.x = 440;
  ball.y = 240;
}


// Function that removes live from lives array of images

function updateLives(){
  if (life == 3){
    lives.splice(0,1);
  } else if (life == 2){
    lives.splice(0,1);
  } else if (life == 1){
    lives.splice(0,1);
  }
}



// Document and button event listeners that Start, reset game and add or remove DOM elements

document.addEventListener('keydown', (e) => {
    switch(e.keyCode){
        case 37:
            player.speedX = -7;
            break;
        case 39:
            player.speedX = 7;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    player.speedX = 0;
    player.speedY = 0;
});

span.addEventListener('click', function(){
div.remove();
myGameArea.start();
generateBricks();
gameStart.play();
levelOneMusic.play();
});

button.addEventListener('click', function(){
  location.reload();
});


button2.addEventListener('click', function(){
  location.reload();
})