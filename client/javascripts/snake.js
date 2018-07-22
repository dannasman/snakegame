var gameCanvas = document.getElementById("gameCanvas");

var ctx = gameCanvas.getContext("2d");

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
];

let score = 0;

let dx = 10;
let dy = 0;

const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';

var main = function () {
    "use strict";

    getScoreBoard();

    document.addEventListener("keydown", changeDirection);

    createFood();

    updateCanvas();
}

function getScoreBoard() {
    $.getJSON("scores.json", function (foundScores) {
        var scoreNumbers = foundScores.map(function (foundScore) {
            return foundScore.singleScore;
        });
        $(".scoreBoard").append("<ol class='scoreList'></ol>");
        scoreNumbers.sort(function (first, last) { return last - first }).splice(10);
        scoreNumbers.forEach(function (scoreNumber) {
            $(".scoreList").append($("<li>").text(scoreNumber));
        });
    });
}

function updateCanvas() {

    if (didGameEnd()) {
        var scoreObject = { "singleScore": score };
        $.post("scores", scoreObject, function (result) {
            console.log(result);
        });
        return;
    }

    setTimeout(function () {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        updateCanvas();
    }, 100);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokesStyle = SNAKE_BORDER_COLOUR;

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;

        createFood();
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokesStyle = CANVAS_BORDER_COLOUR

    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function idFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake)
            createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokesStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y

        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

$(document).ready(main);