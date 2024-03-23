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

    normal() {
        return new Vector(-this.y, this.x).unitVector();
    }

    unitVector() {
        if (this.magnitude() === 0) {
            return new Vector(0, 0)
        } else {
            return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
        }
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    drawVector(startX, startY, n, color) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + this.x * n, startY + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
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
        this.vel.drawVector(550, 400, 10, "green");
        this.acc.unitVector().drawVector(550, 400, 50, "blue");
        this.acc.normal().drawVector(550, 400, 50, "red");

        ctx.beginPath();
        ctx.arc(550, 400, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    moveBall() {
        this.acc = this.acc.unitVector().multiply(this.acceleration)
        this.vel = this.vel.add(this.acc)
        this.vel = this.vel.multiply(1 - friction)
        this.pos = this.pos.add(this.vel)
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

    // ball.vel.x += ball.acc.x;
    // ball.vel.y += ball.acc.y;

    // ball.vel.x *= 1 - friction;
    // ball.vel.y *= 1 - friction;

    // ball.pos.x += ball.vel.x;
    // ball.pos.y += ball.vel.y;
}

function round(number, precision) {
    let factor = 10 ** precision;
    return Math.round(number * factor) / factor;
}

function detectCollision(b1, b2) {
    if (b1.radius + b2.radius >= b2.pos.subtract(b1.pos).magnitude()) {
        return true;
    } else {
        return false;
    }
}

function penetrationResolution(b1, b2) {
    let distance = b1.pos.subtract(b2.pos);
    let penetrationDepth = b1.radius + b2.radius - distance.magnitude()
    let penetrationResolution = distance.unitVector().multiply(penetrationDepth / 2)
    b1.pos = b1.pos.add(penetrationResolution);
    b2.pos = b2.pos.add(penetrationResolution.multiply(-1))
}

function collisionResolution(b1, b2) {
    let collisionNormal = b1.pos.subtract(b2.pos).unitVector()
    let relativeVelocity = b1.vel.subtract(b2.vel)
    let separationVelocity = Vector.dot(relativeVelocity, collisionNormal)
    let newSeparationVelocity = -separationVelocity;
    let separationVelocityVector = collisionNormal.multiply(newSeparationVelocity)

    b1.vel = b1.vel.add(separationVelocityVector)
    b2.vel = b2.vel.add(separationVelocityVector.multiply(-1))
}

let distanceVector = new Vector(0, 0)

function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    balls.forEach((ball, index) => {
        ball.drawBall();
        if (ball.player) {
            keyController(ball);
        }

        for (let i = index + 1; i < balls.length; i++) {
            if (detectCollision(balls[index], balls[i])) {
                penetrationResolution(balls[index], balls[i])
                collisionResolution(balls[index], balls[i])
            }
        }
        ball.displayVelAcc();
        ball.moveBall();        
    });

    

    // distanceVector = Ball2.pos.subtract(Ball1.pos)
    // ctx.fillText("Distance: " + round(distanceVector.magnitude(), 4), 506, 330)
    requestAnimationFrame(mainLoop);
}


let Ball1 = new Ball(50, 400, 30);
let Ball2 = new Ball(300, 300, 50);
let Ball3 = new Ball(400, 400, 40);
let Ball4 = new Ball(500, 100, 20);
let Ball5 = new Ball(150, 200, 15);
let Ball6 = new Ball(250, 40, 50);
let Ball7 = new Ball(350, 200, 45);
let Ball8 = new Ball(450, 300, 60);
let Ball9 = new Ball(550, 350, 35);
Ball1.player = true;

requestAnimationFrame(mainLoop);


