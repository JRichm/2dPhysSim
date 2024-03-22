const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const balls = [];

let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

let friction = 0.1;


class Ball {
    constructor(posX, posY, radius) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.velX = 0;
        this.velY = 0;
        this.accX = 0;
        this.accY = 0;
        this.acceleration = 1;
        this.player = false;
        balls.push(this);
    }

    drawBall() {
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();    
    }

    displayVelAcc() {
        ctx.beginPath();
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.posX + this.accX * 100, this.posY + this.accY * 100);
        ctx.strokeStyle = 'green';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.posX + this.velX * 10, this.posY + this.velY * 10);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

}

function keyController(ball) {
    canvas.addEventListener('keydown', function(event) {
        if (event.keyCode === 37) {
            movingLeft = true;
        }
        if (event.keyCode === 38) {
            movingUp = true;
        }
        if (event.keyCode === 39) {
            movingRight = true;
        }
        if (event.keyCode === 40) {
            movingDown = true;
        }
    })

    canvas.addEventListener('keyup', function(event) {
        if (event.keyCode === 37) {
            movingLeft = false;
        }
        if (event.keyCode === 38) {
            movingUp = false;
        }
        if (event.keyCode === 39) {
            movingRight = false;
        }
        if (event.keyCode === 40) {
            movingDown = false;
        }
    })

    if (movingLeft) {
        ball.accX = -ball.acceleration;
    }
    if (movingUp) {
        ball.accY = -ball.acceleration;
    }
    if (movingRight) {
        ball.accX = ball.acceleration;
    }
    if (movingDown) {
        ball.accY = ball.acceleration;
    }

    if (!movingUp && !movingDown) {
        ball.accY = 0;
    }

    if (!movingLeft && !movingRight) {
        ball.accX = 0;
    }

    ball.velX += ball.accX;
    ball.velY += ball.accY;

    ball.velX *= 1 - friction;
    ball.velY *= 1 - friction;

    ball.posX += ball.velX;
    ball.posY += ball.velY;
}




function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    balls.forEach(ball => {
        ball.drawBall();
        ball.displayVelAcc();
        if (ball.player) {
            keyController(ball);
        }
    })

    requestAnimationFrame(mainLoop);
}


let Ball1 = new Ball(200, 200, 30);
Ball1.player = true;

requestAnimationFrame(mainLoop);


