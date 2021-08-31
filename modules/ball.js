import { canvas, ctx } from "./canvas.js";

// ball vars
export let x = canvas.width / 2;
export let y = canvas.height - 30;
export let dx = 2; // default 2
export let dy = -2; // default -2
export let ballRadius = 10;
export let ballVelIncrease = 0.4; // default to 0.2

export let ballColors = {
    faintRedGlow: '#990000',
    darkRed: '#CC0000',
    brightRed: '#FF0000',
    brightOrange: '#FF6600',
    paleOrange: '#FFA64D',
    yellowWhite: '#FFFF33',
    white: '#FFFFFF',
    blue: '#9999FF'
}

export function heatBall(radius) {
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

function ballSingularity() {
    if (!lives) {
        alert('Game Over');
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