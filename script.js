const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const balls = [];

let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

let friction = 0.1;


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n)
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
}

class Ball {
    constructor(posX, posY, radius) {
        this.pos = new Vector(posX, posY)
        this.radius = radius;
        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.acceleration = 1;
        this.player = false;
        balls.push(this);
    }

    drawBall() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();    
    }

    displayVelAcc() {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.acc.x * 100, this.pos.y + this.acc.y * 100);
        ctx.strokeStyle = 'green';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
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
        ball.acc.x = -ball.acceleration;
    }
    if (movingUp) {
        ball.acc.y = -ball.acceleration;
    }
    if (movingRight) {
        ball.acc.x = ball.acceleration;
    }
    if (movingDown) {
        ball.acc.y = ball.acceleration;
    }

    if (!movingUp && !movingDown) {
        ball.acc.y = 0;
    }

    if (!movingLeft && !movingRight) {
        ball.acc.x = 0;
    }

    ball.vel = ball.vel.add(ball.acc)
    ball.vel = ball.vel.multiply(1 - friction)
    ball.pos = ball.pos.add(ball.vel)

    // ball.vel.x += ball.acc.x;
    // ball.vel.y += ball.acc.y;

    // ball.vel.x *= 1 - friction;
    // ball.vel.y *= 1 - friction;

    // ball.pos.x += ball.vel.x;
    // ball.pos.y += ball.vel.y;
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


