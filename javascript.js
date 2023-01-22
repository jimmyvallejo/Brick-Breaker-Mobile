const hitPaddle = new Audio('270343__littlerobotsoundfactory__shoot-01.wav');
const hitBrick = new Audio('270303__littlerobotsoundfactory__collect-point-01.wav');
const gameLose = new Audio('270329__littlerobotsoundfactory__jingle-lose-00.wav');
const interval = setInterval(updateGameArea, 20);

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
            console.log('colliding');
       } else if (this.x > myGameArea.canvas.width - 172){
        this.x = myGameArea.canvas.width - 172;
        this.x -= this.speedX;
        console.log('colliding');
       }
        else {
        this.x += this.speedX;
       }
        
    }

    move(){
        this.x += this.velocityX
        this.y += this.velocityY;
    }
    left() {
        return this.x;
      }
      right() {
        return this.x + this.width;
      }
      top() {
        return this.y;
      }
      bottom() {
        return this.y + this.height;
      }
    
  
    }







const player = new Component(175, 20, '#C0DEFF', 350, 480);
const ball = new Component(20, 20, "white", 420, 200, 0, 0);




function updateGameArea(){
    
    
    myGameArea.clear();
    player.newPos();
    player.update();
    bricks.forEach(function(brick){
        brick.update();
      });
      ball.move();
      ball.update();
      stopVelocity();
      collisionDetectionPlayer();
      collisionDetectionWall();
      collisionDetectionBrick();
      
      

}



let brickColumnCount = 3;
let brickRowCount = 8;


let bricks = [];

function generateBricks(){
    const brickWidth = 100;
    const brickHeight = 22;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 15;

  for (let c = 0; c < brickColumnCount; c++){
    for (let r = 0; r < brickRowCount; r++){
        const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (c * (brickHeight + brickPadding) + brickOffsetTop);
      
     const brick = new Component (brickWidth, brickHeight, "red", brickX, brickY);
      bricks.push(brick);
    }
  }

}

function collisionDetectionBrick(){
    for(let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const b = bricks[c * brickRowCount + r];
            if (ball.x > b.x && ball.x < b.x + b.width +10 && ball.y > b.y && ball.y < b.y + b.height + 5) {
                ball.velocityY = -ball.velocityY;
                bricks.splice(c * brickRowCount + r, 1);
                hitBrick.play();
            }
        }
    }
}

function collisionDetectionPlayer() {
    if (ball.x + ball.width > player.x && ball.x < player.x + player.width &&
        ball.y + ball.height > player.y && ball.y < player.y + player.height) {
        ball.velocityY = -ball.velocityY;
        ball.velocityX--;
        ball.velocityY--;
        hitPaddle.play();
    } 
}

function collisionDetectionWall(){
    if (ball.y > 500 - 20){
       clearInterval(interval);
       gameLose.play();
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

 let maxVelocityX = 4
 let maxVelocityY = 5;


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

myGameArea.start();
generateBricks();


