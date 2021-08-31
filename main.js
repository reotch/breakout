import { canvas, ctx } from './modules/canvas.js';
import { paddleColor } from './modules/paddle.js';
import { heatBall } from './modules/ball.js';
// import * as scoreboard from './modules/scoreboard.js'
// import { x, y, dx, dy, ballRadius, ballVelIncrease } from './modules/ball.js';

// color imports

// game vars
let score = 0;
let lives = 3;
let paused = false;

// ball vars
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // default 2
let dy = -2; // default -2
let ballRadius = 10;
let ballVelIncrease = 0.4; // default to 0.2

// paddle vars
let paddleWidth = 75; // default 75
let paddleHeight = 10;  // default 10
let paddleX = (canvas.width - paddleWidth) / 2; // x val of center of paddle
// sections of paddle
let paddleRightSide = paddleX + (paddleWidth / 2);
let paddleLeftSide = paddleX - (paddleWidth / 2);
// let paddleLeftBorder = paddleX - (paddleWidth / 2);
// let paddleRightBorder = paddleX + (paddleWidth / 2);
let paddleSpeed = 8; // normal setting is 8

// brick vars
let brickRows = 3; // default 3
let brickCols = 7; // default 5
let brickWidth = 50; // calc based on canvas width
let brickHeight = 20; // default 20
let brickPadding = 10; // padding all sides between bricks
let brickOffsetTop = 30; // start drawing bricks from top
let brickOffsetLeft = 30; // start drawing bricks from left
let brickColors = ['#00ddb8', '#0093dd', '#0024dd'];
let bricks = [];
for (let i = 0; i < brickCols; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickRows; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

// input vars
let rightPressed = false;
let leftPressed = false;

// event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key == ' ') {
        togglePause();  
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - (paddleWidth / 2);
    }
}

function togglePause() {
    if (!paused) {
        paused = true;
        console.log(`I should be paused. var paused = ${paused}`)
    } else {
        paused = false;
        console.log(`Game on! var paused = ${paused}`)
    }
}

function collisionDetect() { 
    for (let cols = 0; cols < brickCols; cols++) {
        for (let rows = 0; rows < brickRows; rows++) {
            let brick = bricks[cols][rows];
            if (brick.status == 1) {
                if (x > (brick.x - ballRadius) && x < (brick.x + brickWidth) + ballRadius && y  > brick.y - ballRadius && y < (brick.y + brickHeight) + ballRadius) {
                    dy = -dy;
                    brick.status = 0;
                    score++;
                    if (score == brickRows * brickCols) {
                        alert('You win!')
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Ubuntu';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20) // score + scoreboard x, y
}

function drawLives() {
    ctx.font = '16px Ubuntu';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, (canvas.width - 65), 20);
}

function drawBricks() {
    for (let columns = 0; columns < brickCols; columns++) {
        for (let rows = 0; rows < brickRows; rows++) {
            if (bricks[columns][rows].status == 1) {
                let brickX = (columns * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (rows * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[columns][rows].x = brickX;
                bricks[columns][rows].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[2];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    let ballColor = heatBall(ballRadius);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
    );
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawGameOver() {
    ctx.font = '30px Ubuntu';
    ctx.fillStyle = '#FF6600';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2)
}

// main game function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetect();

    if (rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    // ball bouncing off the walls
    // left and right
    if (x + dx > (canvas.width - ballRadius) || x + dx < ballRadius ) {
        dx = -dx;
    }
    // top
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > (canvas.height - ballRadius)) { 
        if (x + dx > paddleX && x +dx < (paddleX + paddleWidth)) { // paddle collision instead of floor
            dy = -dy;
            dx += ballVelIncrease;
            dy += -ballVelIncrease;
            ballRadius -= 0.5;
            console.log(`Ball radius: ${ballRadius}`)
            if ( ballRadius < 1 ) { // if ball gets too small
                lives--;
                // ball becomes singularity function goes here
                // ballSingularity();
                if (!lives) {
                    drawGameOver()
                    document.location.reload();
                } else {
                    ballRadius = 4; // have a little mercy; reset the ball size up a bit
                    console.log(`Radius increased to ${ballRadius}`)
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
                
            }
        } else {
            lives--;
            if (!lives) {
                // alert('Game Over');
                drawGameOver();
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();
