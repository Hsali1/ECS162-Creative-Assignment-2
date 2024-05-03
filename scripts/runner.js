let context;
let canvas;

const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

// runner info
let runnerWidth = 45;
let runnerHeight = 45;
let runnerX = window.innerWidth / 5;
let runnerY = window.innerHeight / 1.75;
let runnerImg;

// movement
let directionX = 0;
let directionY = 0;
let initialDirectionY = -8;
let gravity = 0.3;

let runner = {
    img: null,
    x: runnerX,
    y: runnerY,
    width: runnerWidth,
    height: runnerHeight
}


let score = 0;
let gameOver = false;

// platform info
let platformArray = [];
let platformWidth = 50;
if (window.innerWidth < 500) {
    platformWidth = 20;
}
let platformHeight = 18;
const minDistanceBetweenPlatforms = 100;

let ground = {
    x: 0,
    y: window.innerHeight - window.innerHeight * 0.1,
    width: window.innerWidth,
    height: window.innerHeight * 0.1
}

// Event Listeners
window.addEventListener("resize", adjustGameSize);

window.onload = () => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // add images
    const meImage = new Image();
    meImage.src = "./images/me.png";
    runner.img = meImage;
    meImage.onload = () => {
        context.drawImage(runner.img, runner.x, runner.y, runner.width, runner.height);
    }

    context.fillStyle = 'green';
    context.fillRect(0, ground.y, ground.width, ground.height);


    directionY = initialDirectionY;

    // Place initial platforms
    placePlatforms();

    requestAnimationFrame(update);
    document.addEventListener('keydown', moveRunner);
    rulesBtn.addEventListener('click', () => rules.classList.add('show'));
    closeBtn.addEventListener('click', () => rules.classList.remove('show'));
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchend', touchEnd);
    document.addEventListener('click', () => {
        if (gameOver) {
            window.location.reload();
        }
    });
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    runner.x += directionX;
    // loop runner direction
    if (runner.x > canvas.width) {
        runner.x = 0;
    } else if (runner.x + runner.width < 0) {
        runner.x = canvas.width;
    }

    directionY += gravity;
    runner.y += directionY;

    if (runner.y > ground.y) {
        gameOver = true;
    }
    context.drawImage(runner.img, runner.x, runner.y, runner.width, runner.height);
    context.fillStyle = 'green';
    context.fillRect(0, ground.y, ground.width, ground.height);

    movePlatforms();

    // platform
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (directionX > 0 && runner.x > canvas.width * 2 / 4) {
            platform.x -= Math.abs(directionX);
        }
        if (collision(runner, platform) && directionY >= 0) {
            score++;
            directionY = initialDirectionY;
        }
        context.fillStyle = 'blue';
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // print/update score on screen
    context.fillStyle = 'black';
    context.font = "20px Arial";
    context.fillText(score, 10, 20);

    // check if game over to print gameover message
    let randomNum = canvas.width / 3;
    if (window.innerWidth <= 500) {
        randomNum = canvas.width / 20;
    }
    if (gameOver) {
        context.fillText("GAME OVER: Press Space or click to restart", randomNum, canvas.height / 2);

    }
}

// take intput and move runner
function moveRunner(e) {
    if (e.code == 'ArrowRight' || e.code == 'KeyD') {
        directionX = 4;
    } else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
        directionX = -4;
    } else if (e.code == 'Space' && gameOver) {
        window.location.reload();
    }
}

// Touch variables
let touchStartX = null;
let touchEndX = null;

// touch functionality
function touchStart(event) {
    event.preventDefault();
    if (gameOver) {
        window.location.reload();
    }
    touchStartX = event.touches[0].clientX;
}

function touchEnd(event) {
    event.preventDefault();
    touchEndX = event.changedTouches[0].clientX;
    handleTouch();
}

function handleTouch() {
    if (gameOver) {
        window.location.reload();
    }
    if (touchStartX && touchEndX) {
        let touchDiff = touchEndX - touchStartX;
        if (touchDiff > 0) {
            directionX = 4; // Move right
        } else if (touchDiff < 0) {
            directionX = -4; // Move left
        }
    }
    // Reset touch variables
    touchStartX = null;
    touchEndX = null;
}

function placePlatforms() {
    platformArray = [];

    // initial platform
    let platform = {
        x: Math.floor(Math.random() * canvas.width * 3 / 4),
        y: (window.innerHeight / 1.75) + runnerHeight,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);

    let prevX = platform.x;
    let sumNum = 5;
    if (window.innerWidth < 500) {
        sumNum = 2;
    }
    if (window.innerWidth > 800) {
        sumNum = 7;
    }

    for (let i = 0; i < sumNum; i++) {
        let randomX;
        do {
            randomX = Math.floor(Math.random() * canvas.width * 3 / 4);
        } while (Math.abs(randomX - prevX) < minDistanceBetweenPlatforms);
        platform = {
            x: randomX,
            y: (window.innerHeight / 1.75) + runnerHeight,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);

    }
}


let lastPlatformGenerationTime = performance.now(); // Initialize the time of the last platform generation

function movePlatforms() {
    const platformGenerationInterval = 1000;

    // Check if it's time to generate a new platform
    if (performance.now() - lastPlatformGenerationTime > platformGenerationInterval) {
        // Generate a new platform
        placePlatforms();
        lastPlatformGenerationTime = performance.now(); // Update the time of the last platform generation
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}


function adjustGameSize() {
    window.location.reload();
}