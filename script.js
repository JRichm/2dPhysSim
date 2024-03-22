const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');



let x = 100;
let y = 100;

let movingLeft = false;
let movingUp = false;
let movingRight = false;
let movingDown = false;

function drawBall(xPos, yPos, radius) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2*Math.PI);
    ctx.strokeStyle = 'black'
    ctx.stroke();
    ctx.fillStyle = 'red'
    ctx.fill();    
}

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

function move() {
    if (movingLeft) {
        x--;
    }
    if (movingUp) {
        y--;
    }
    if (movingRight) {
        x++;
    }
    if (movingDown) {
        y++;
    }
}


function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    move()
    drawBall(x, y, 20)
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);


