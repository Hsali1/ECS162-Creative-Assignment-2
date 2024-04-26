// game
let game;
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight / 2;
let context;
let gameOver = false;
let elapsedTime = 0;
let score = 0;
let restartButton;
let musicOn = false;

// mee
let meWidth = 100;
let meHeight = 100;
let meX = gameWidth / 2 - gameWidth / 2;
let meY = gameHeight / 1.9 - meHeight;
let meImage;

if (gameWidth <= 450) {
    meWidth = 20;
    meHeight = 20;
}

// enemmy
let enemyWidth = meWidth;
let enemyHeight = meHeight;
let enemyX = gameWidth - (gameWidth / 4);
let enemyY = meY
let enemyImage;
let enemySpeed = 5;

// movement
let speedX = 0;
let moveDirection = 1;


let me = {
    img: null,
    x: meX,
    y: meY,
    width: meWidth,
    height: meHeight
}

let enemy = {
    img: null,
    x: enemyX,
    y: enemyY,
    width: enemyWidth,
    height: enemyHeight
}

function updateTimer() {
    score = ++elapsedTime;

    if (score % 100 === 0) {
        enemySpeed += 0.1;
    }
}

function displayScore() {
    // Display the score on the screen
    let scoreElement = document.getElementById("score");
    scoreElement.textContent = "Score: " + score;
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}


window.onload = function () {
    game = document.getElementById("board");
    game.height = gameHeight;
    game.width = gameWidth;
    context = game.getContext("2d");

    // music
    const backgroundMusic = document.getElementById("backgroundMusic");


    // load images
    meImage = new Image();
    meImage.src = "./images/me.png";
    me.img = meImage;
    meImage.onload = function () {
        context.drawImage(me.img, me.x, me.y, me.width, me.height);
    }

    enemyImage = new Image();
    enemyImage.src = "./images/bubba.png";
    enemy.img = enemyImage;
    enemyImage.onload = function () {
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }

    restartButton = document.getElementById("restartButton");

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveMe);
    document.addEventListener("click", moveMe);
    restartButton.addEventListener("click", restartGame);
    window.addEventListener("resize", adjustGameSize);
}

function update() {
    if (!gameOver) {
        requestAnimationFrame(update);
        context.clearRect(0, 0, game.width, gameHeight);

        // me
        me.x += speedX;

        if (me.x > gameWidth) {
            me.x = 0;
        } else if (me.x + me.width < 0) {
            me.x = gameWidth;
        }

        // Move enemy towards the player
        if (enemy.x < me.x) {
            enemy.x += enemySpeed;
        } else if (enemy.x > me.x) {
            enemy.x -= enemySpeed;
        }

        context.drawImage(me.img, me.x, me.y, me.width, me.height);
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

        // Update timer and score
        updateTimer();

        // Display score
        displayScore();


        if (checkCollision(me, enemy)) {
            gameOver = true;
            context.fillStyle = "red";
            context.font = "40px Arial";
            context.fillText("Game Over!", gameWidth / 2 - 100, gameHeight / 2);
            restartButton.classList.remove('hidden');
        }
    }
}

function moveMe(e) {
    if (e.type === "keydown") {
        if (e.code == "ArrowRight" || e.code == "KeyD") {
            speedX = 4;
        } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
            speedX = -4;
        } else if (e.code == "KeyR") {
            restartGame();
        } else if (e.code == "KeyM") {
            backgroundMusic.volume = 0.005;
            if (musicOn == true) {
                backgroundMusic.pause();
                musicOn = false;
            } else {
                backgroundMusic.play();
                musicOn = true;
            }
        }
    } else if (e.type === "click") {
        moveDirection *= -1;
        speedX = 4 * moveDirection;
    }
}

function restartGame() {
    elapsedTime = 0;
    score = 0;
    enemySpeed = 5;
    me.x = meX;
    enemy.x = enemyX;
    gameOver = false;

    restartButton.classList.add('hidden');

    // Start the game loop again
    requestAnimationFrame(update);
}


function adjustGameSize() {
    window.location.reload();
}