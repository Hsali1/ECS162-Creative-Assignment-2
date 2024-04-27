const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let floorWidth = 100;
const enemyDropInterval = 2000;
let lastDropTime = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;

// enemy row and column
const enemyRowCount = 9;
const enemyColumnCount = 5;
let enemiesPresent = enemyColumnCount * enemyRowCount;
let enemyMoveVariable = 4;

// add images
const meImage = new Image();
meImage.src = "./images/me.png";
const enemyImage = new Image();
enemyImage.src = "./images/bubba.png";

// Event Listeners
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);


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
    y: canvas.height - 60,
    width: floorWidth,
    height: 15,
    speed: 8,
    speedx: 0
}

// create enemy
const enemyInfo = {
    width: 40,
    height: 40,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

const totalEnemyWidth = enemyRowCount * (enemyInfo.width + enemyInfo.padding) - enemyInfo.padding;
const totalEnemyHeight = enemyColumnCount * (enemyInfo.height + enemyInfo.padding) - enemyInfo.padding;
const horizontalSpacing = (canvas.width - totalEnemyWidth) / (enemyRowCount + 1);
const verticalSpacing = (canvas.height - totalEnemyHeight) / (enemyColumnCount + 30);

const enemies = [];
for (let i = 0; i < enemyRowCount; i++) {
    enemies[i] = [];
    for (let j = 0; j < enemyColumnCount; j++) {
        const x = (i + 1) * horizontalSpacing + i * (enemyInfo.width + enemyInfo.padding);
        const y = (j + 1) * verticalSpacing + j * (enemyInfo.height + enemyInfo.padding);
        enemies[i][j] = { x, y, ...enemyInfo };
    }
}

// Draw ball
function drawBall() {
    context.beginPath();
    context.drawImage(meImage, ball.x, ball.y, 40, 40);
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
    context.fillText(`Score: ${score}`, (canvas.width / 2 - floorWidth / 2), canvas.height - 10);
}

// Draw enemy on canvas
function drawEnemy() {
    enemies.forEach(column => {
        column.forEach(enemy => {
            if (enemy.visible) {
                context.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            }
        })
    })
}

function moveFloor() {
    floor.x += floor.speedx;

    // detect wall
    if (floor.x + floor.width > canvas.width) {
        floor.x = canvas.width - floor.width;
    }

    if (floor.x < 0) {
        floor.x = 0;
    }
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        floor.speedx = floor.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        floor.speedx = -floor.speed;
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        floor.speedx = 0;
    }
}

let touchStartX = 0;

function touchStart(event) {
    floor.x = event.touches[0].clientX - floor.width / 2;
}

function touchMove(event) {
    event.preventDefault();
    floor.x = event.touches[0].clientX - floor.width / 2;
    if (floor.x + floor.width > canvas.width) {
        floor.x = canvas.width - floor.width;
    }

    if (floor.x < 0) {
        floor.x = 0;
    }
}

function touchEnd(event) {
    floor.speedx = 0; // Stop moving when touch ends
}

function moveBall() {
    ball.x += ball.speedx;
    ball.y += ball.speedy;

    // Check collision with left and right walls
    if (ball.x - ball.radius <= 0) {
        // Ball hits the left wall
        ball.x = ball.radius; // Adjust the position to prevent sticking
        ball.speedx *= -1; // Reverse the horizontal direction
    } else if (ball.x + ball.radius >= canvas.width) {
        // Ball hits the right wall
        ball.x = canvas.width - ball.radius; // Adjust the position to prevent sticking
        ball.speedx *= -1; // Reverse the horizontal direction
    }

    // ceiling detect collision
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.speedy *= -1;
    }


    // collide with floor
    if (
        ball.x - ball.radius + 30 > floor.x &&
        ball.x + ball.radius < floor.x + floor.width &&
        ball.y + ball.radius + 30 > floor.y
    ) {
        let hitPosition = (ball.x - floor.x) / floor.width;

        if (hitPosition < 0.5) {
            ball.speedx = -Math.abs(ball.speedx); // Ensure ball moves left regardless of its current direction
        } else {
            ball.speedx = Math.abs(ball.speedx); // Ensure ball moves right regardless of its current direction
        }

        ball.speedy = -ball.speedy;

        // ball.speedy = -ball.speed;
    }

    // enemy collision
    enemies.forEach(column => {
        column.forEach(enemy => {
            if (enemy.visible) {
                if (
                    ball.x - ball.radius + 50 > enemy.x &&
                    ball.x + ball.radius < enemy.x + enemy.width &&
                    ball.y + ball.radius + 50 > enemy.y &&
                    ball.y - ball.radius < enemy.y + enemy.height
                ) {

                    ball.speedy = -ball.speedy;
                    enemy.visible = false;

                    increaseScore();
                }
            }
        });
    });

    // hit bottom wall - lose
    if (ball.y + ball.radius > canvas.height) {
        score = 0;
        enemiesPresent = enemyColumnCount * enemyRowCount;
        ball.speed = 4;
        enemyMoveVariable = 4;
        showAllEnemies();
    }
}

// increase Score
function increaseScore() {
    score++;
    console.log((score - enemiesPresent) === 0)
    if ((score - enemiesPresent) === 0) {

        ball.speed += 3;
        enemiesPresent += (enemyColumnCount * enemyRowCount);
        enemyMoveVariable += 4;
        showAllEnemies();
    }
}

// make all bricks appear
function showAllEnemies() {
    for (let i = 0; i < enemyRowCount; i++) {
        enemies[i] = [];
        for (let j = 0; j < enemyColumnCount; j++) {
            const x = (i + 1) * horizontalSpacing + i * (enemyInfo.width + enemyInfo.padding);
            const y = (j + 1) * verticalSpacing + j * (enemyInfo.height + enemyInfo.padding);
            enemies[i][j] = { x, y, ...enemyInfo };
        }
    }
    enemies.forEach(column => {
        column.forEach(enemy => (
            enemy.visible = true
        ));
    });
}


function updateEnemyPositions() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastDropTime;

    if (elapsedTime > enemyDropInterval) {
        lastDropTime = currentTime;

        enemies.forEach(column => {
            column.forEach(enemy => {
                if (enemy.visible) {
                    enemy.y += enemyMoveVariable;
                    if (enemy.y + enemy.height > canvas.height) {
                        score = 0;
                        enemiesPresent = enemyColumnCount * enemyRowCount;
                        ball.speed = 4;
                        enemyMoveVariable = 4;
                        showAllEnemies();
                    }
                }
            });
        });

        draw();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawEnemy();
    drawFloor();
    drawScore();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve();
        };
        image.onerror = reject;
        image.src = src;
    });
}

window.addEventListener("resize", adjustGameSize);
function adjustGameSize() {
    window.location.reload();
}

Promise.all([loadImage(meImage.src), loadImage(enemyImage.src)])
    .then(() => {
        update();
    })
    .catch((error) => {
        console.error("Error loading images:", error);
    });


function update() {
    // draw everything
    draw();

    // move mee
    moveBall();

    //move floor
    moveFloor();

    updateEnemyPositions();

    requestAnimationFrame(update);
}
