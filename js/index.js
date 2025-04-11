let inputDir = { x: 0, y: 0 };
let speed = 1;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const liveScoreElement = document.getElementById("liveScore");
const gameOverModal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const restartButton = document.getElementById('restartButton');
const closeButton = document.getElementById('closeButton');

function showGameOverModal() {
    finalScore.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    gameOverModal.style.display = 'block';
}

restartButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    inputDir = { x: 0, y: 0 };
    food = { x: 6, y: 7 };
    liveScoreElement.textContent = "Score: 0";
});

closeButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
});

function isCollide(sarr) {
    for (let index = 1; index < sarr.length; index++) {
        if (sarr[index].x === sarr[0].x && sarr[index].y === sarr[0].y) {
            return true;
        }
    }
    if (sarr[0].x >= 18 || sarr[0].x <= 0 || sarr[0].y >= 18 || sarr[0].y <= 0) {
        return true;
    }
    return false;
}

function generateFood(sarr) {
    let a = 2;
    let b = 16;
    let newFood;
    do {
        newFood = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
    } while (sarr.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };

        // Set high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        showGameOverModal();
        return;
    }

    // Food eaten
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        score += 1;
        liveScoreElement.textContent = `Score: ${score}`;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = generateFood(snakeArr);
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", e => {
    e.preventDefault();
    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});
