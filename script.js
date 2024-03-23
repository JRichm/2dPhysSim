const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const balls = [];
const walls = [];

let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

let friction = 0.05;

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
        return new Vector(this.x * n, this.y * n);
    }

    normal() {
        return new Vector(-this.y, this.x).unitVector();
    }

    unitVector() {
        if (this.magnitude() === 0) {
            return new Vector(0, 0);
        } else {
            return new Vector(this.x / this.magnitude(), this.y / this.magnitude());
        }
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
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
    constructor(posX, posY, radius, mass) {
        this.pos = new Vector(posX, posY)
        this.radius = radius;
        this.mass = mass;
        if (this.mass === 0) {
            this.inverseMass = 0;
        } else {
            this.inverseMass = 1 / this.mass
        }
        this.elasticity = 1;
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

    displayNote() {
        this.vel.drawVector(this.pos.x, this.pos.y, 10, "green");
        ctx.fillStyle = "black";
        ctx.fillText("m = " + this.mass, this.pos.x - 10, this.pos.y - 5);
        ctx.fillText("e = " + this.elasticity, this.pos.x - 10, this.pos.y + 5);
    }

    moveBall() {
        this.acc = this.acc.unitVector().multiply(this.acceleration);
        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.multiply(1 - friction);
        this.pos = this.pos.add(this.vel);
    }
}

class Wall {
    constructor(startVector, endVector) {
        this.start = startVector;
        this.end = this.endVector;
        walls.push(this);
    }

    drawWall() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        this.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = "black";
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

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    let penetrationDepth = b1.radius + b2.radius - distance.magnitude();
    let penetrationResolution = distance.unitVector().multiply(penetrationDepth / (b1.inverseMass + b2.inverseMass));
    b1.pos = b1.pos.add(penetrationResolution.multiply(b1.inverseMass));
    b2.pos = b2.pos.add(penetrationResolution.multiply(-b2.inverseMass));
}

function collisionResolution(b1, b2) {
    let collisionNormal = b1.pos.subtract(b2.pos).unitVector();
    let relativeVelocity = b1.vel.subtract(b2.vel);
    let separationVelocity = Vector.dot(relativeVelocity, collisionNormal);
    let newSeparationVelocity = -separationVelocity * Math.min(b1.elasticity, b2.elasticity);

    let velocitySeparationDifference = newSeparationVelocity - separationVelocity;
    let impulse = velocitySeparationDifference / (b1.inverseMass + b2.inverseMass);
    let impulseVector = collisionNormal.multiply(impulse);

    b1.vel = b1.vel.add(impulseVector.multiply(b1.inverseMass));
    b2.vel = b2.vel.add(impulseVector.multiply(-b2.inverseMass));
}

let distanceVector = new Vector(0, 0)

function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    balls.forEach((ball, index) => {
        ball.drawBall();
        if (ball.player) {
            keyController(ball);
        }

        for (let i = index + 1; i < balls.length; i++) {
            if (detectCollision(balls[index], balls[i])) {
                penetrationResolution(balls[index], balls[i]);
                collisionResolution(balls[index], balls[i]);
            }
        }
        ball.displayNote();
        ball.moveBall();        
    });

    
    
    // distanceVector = Ball2.pos.subtract(Ball1.pos)
    // ctx.fillText("Distance: " + round(distanceVector.magnitude(), 4), 506, 330)
    requestAnimationFrame(mainLoop);
}

for (let i = 0; i < 10; i++) {
    let newBall = new Ball(randInt(100, 500), randInt(50, 400), randInt(20, 50), randInt(0, 10));
    newBall.elasticity = randInt(0, 10) / 10;
}

balls[0].player = true;

requestAnimationFrame(mainLoop);


