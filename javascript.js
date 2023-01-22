let x = 900;
let y = 500 - 20;

const myGameArea = {
    canvas: document.createElement('canvas'),
    start: function(){
        this.canvas.width = 900;
        this.canvas.height = 500;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

    },
     clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     },
     stop: function(){
        clearInterval(this.interval);
        this.con.fillStyle = "black";
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
    }
    update(){
        const ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    move(){
        this.x += this.velocityX
        this.y += this.velocityY;
    }
}




const player = new Component(175, 20, '#C0DEFF', 350, 480);
const ball = new Component(20, 20, "white", 350, 250, 0, -2);




function updateGameArea(){
    
    
    myGameArea.clear();
    player.newPos();
    player.update();
    bricks.forEach(function(brick){
        brick.update();
      });
      
      ball.move();
      ball.update();
      
      CollisionDetectionBrick();
      collisionDetectionWalls();
      collisionDetectionPlayer();
      
      if (ball.y + ball.height > myGameArea.canvas.height) {
        myGameArea.stop();
      }
 

}



let brickColumnCount = 3;
let brickRowCount = 8;


let bricks = [];

function generateBricks(){
    const brickWidth = 100;
    const brickHeight = 30;
    const brickPadding = 10;
    const brickOffsetTop = 30;
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

function CollisionDetectionBrick(){
    for(let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const b = bricks[c * brickRowCount + r];
            if (ball.x > b.x && ball.x < b.x + b.width && ball.y > b.y && ball.y < b.y + b.height) {
                ball.velocityY = -ball.velocityY;
                bricks.splice(c * brickRowCount + r, 1);
            }
        }
    }
}

function collisionDetectionPlayer() {
    const player = new Component(175, 20, '#C0DEFF', 350, 480);
    
    if (ball.x + ball.width > player.x && ball.x < player.x + player.width &&
        ball.y + ball.height > player.y && ball.y < player.y + player.height) {
        ball.velocityY = +ball.velocityY;
    }
}



document.addEventListener('keydown', (e) => {
    switch(e.keyCode){
        case 37:
            player.speedX = -4;
            break;
        case 39:
            player.speedX = 4;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    player.speedX = 0;
    player.speedY = 0;
});

myGameArea.start();
generateBricks();


