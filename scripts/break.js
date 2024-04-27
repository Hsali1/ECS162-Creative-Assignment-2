const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const meImage = new Image();
meImage.src = "./images/me.png";
let floorWidth = 100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    speedx: 4,
    speedy: -4
}

// create floor
const floor = {
    x: canvas.width / 2 - floorWidth / 2,
    y: canvas.height - 30,
    width: floorWidth,
    height: 15,
    speed: 8,
    speedx: 0
}

// Draw ball
function drawBall() {
    context.beginPath();
    meImage.onload = () => {
        context.drawImage(meImage, ball.x, ball.y, 40, 40);
    }
    // context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    // context.fillStyle = 'red';
    // context.fill();
    context.closePath();
}

// draw floor
function drawFloor() {
    context.beginPath();
    context.rect(floor.x, floor.y, floor.width, floor.height);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawScore() {
    context.font = '30px Arial';
    context.fillText(`Score: ${score}`, canvas.width - 125, 30);
}

function draw() {
    drawFloor();
    drawBall();
    drawScore();
}

draw();

rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));


window.addEventListener("resize", adjustGameSize);
function adjustGameSize() {
    window.location.reload();
}