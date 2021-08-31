// ----- [ Variables ] ----- //
// canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// game vars
let score = 0;
let lives = 3;
let paused = true;
const gameFont = 'Ubuntu';
const scoreColor = '#FFFFFF';

// ball vars
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = Math.random() * 2; // default 2
let dy = -2; // default -2
let ballRadius = 10;
let ballVelIncrease = 0.4;
let ballColors = {
    faintRedGlow: '#990000',
    darkRed: '#CC0000',
    brightRed: '#FF0000',
    brightOrange: '#FF6600',
    paleOrange: '#FFA64D',
    yellowWhite: '#FFFF33',
    white: '#FFFFFF',
    blue: '#9999FF',
};

// paddle vars
let paddleWidth = 75; // default 75
let paddleHeight = 10;  // default 10
let paddleX = (canvas.width - paddleWidth) / 2; // x val of center of paddle
const paddleColor = '#5C8BA2';
const paddleSpeed = 8; // default 8
const paddleRightSide = paddleX + (paddleWidth / 2);
const paddleLeftSide = paddleX - (paddleWidth / 2);

// brick vars
let brickRows = 3; // default 3
let brickCols = 7; // default 5
let brickWidth = 50; // if 5, default 75; if 7, default 50
let brickHeight = 20; // default 20
let brickPadding = 10; // padding all sides between bricks
let brickOffsetTop = 30; // start drawing bricks from top
let brickOffsetLeft = 30; // start drawing bricks from left
let brickColors = ['#00ddb8', '#0093dd', '#0024dd']; // Future update
let brickGrd = ctx.createLinearGradient(0, 0, brickWidth, brickHeight);
brickGrd.addColorStop(0, brickColors[2]);
brickGrd.addColorStop(1, brickColors[1]);
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

// ----- [ Event Listeners & Input Handler Functions ] ----- //
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key == 's') {
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
    paused = !paused;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw();
}

// ----- [ Ball Behavior Functions ] ----- //
// collision detection with bricks
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
                        drawWin();
                        setTimeout(function() {
                            document.location.reload();
                        }, 3000)
                    }
                }
            }
        }
    }
}

// ball turns "hotter" when hitting paddle
function heatBall(radius) {
    if (radius >= 1 && radius <= 2) {
        return ballColors.blue;
    } else if (radius > 2 && radius <= 3) {
        return ballColors.white;
    } else if (radius > 3 && radius <= 4) {
        return ballColors.yellowWhite;
    } else if (radius > 4 && radius <= 5) {
        return ballColors.paleOrange;
    } else if (radius > 5 && radius <= 6) {
        return ballColors.brightOrange;
    } else if (radius > 6 && radius <= 7) {
        return ballColors.brightRed;
    } else if (radius > 7 && radius <= 8) {
        return ballColors.darkRed;
    } else {
        return ballColors.faintRedGlow;
    }
}

// ----- [ Draw Scoreboard and Lives ] ----- //
function drawScore() {
    ctx.font = '16px ' + gameFont;
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20) // score + scoreboard x, y
}

function drawLives() {
    ctx.font = '16px ' + gameFont;
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, (canvas.width - 65), 20);
}

// ----- [ Draw Ball, Bricks, Paddle  ] ----- //
function drawBricks() {
    for (let columns = 0; columns < brickCols; columns++) {
        for (let rows = 0; rows < brickRows; rows++) {
            if (bricks[columns][rows].status == 1) {
                let brickX = (columns * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (rows * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[columns][rows].x = brickX;
                bricks[columns][rows].y = brickY;
                ctx.beginPath();
                // ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // ctx.fillStyle = brickColors[2];
                ctx.fillStyle = brickGrd;
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
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

// draw game over text
function drawGameOver() {
    togglePause();
    ctx.font = '45px Ubuntu';
    ctx.strokeStyle = '#FF6600';
    ctx.textAlign = 'center';
    ctx.strokeText('Game Over!', canvas.width / 2, canvas.height / 2)
    
}

// ball gets too hot, too dense
function drawSingularity() {
    togglePause();
    ctx.font = '30px Ubuntu';
    ctx.strokeStyle = '#FF6600';
    ctx.textAlign = 'center';
    ctx.strokeText('You\'ve created a singularity!', canvas.width / 2, canvas.height / 2)
}

// draw win text when all blocks destroyed
function drawWin() {
    togglePause();
    ctx.font = '45px Ubuntu';
    ctx.strokeStyle = '#FF6600';
    ctx.textAlign = 'center';
    ctx.strokeText('You win!', canvas.width / 2, canvas.height / 2)
}

// ----- [ Main game function ] ----- //
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
                if (!lives) {
                    drawGameOver();
                    setTimeout(function() {
                        document.location.reload();
                    }, 3000);
                } else {
                    drawSingularity();
                    setTimeout(function() {
                        togglePause();
                    }, 2000)
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
                drawGameOver();
                setTimeout(function() {
                    document.location.reload();
                }, 3000);
                
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // set ball in motion
    x += dx;
    y += dy;
    

    if (!paused) {
        requestAnimationFrame(draw);
    }
}

draw();
