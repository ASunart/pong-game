const NGROK = `${window.location.hostname}`;
//const NGROK = `https://${window.location.hostname}`;
//let socket = io(`${window.location.hostname}:5050`, { path: '/real-time' }); 
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

let deviceWidth, deviceHeight = 0;
let mupiWidth, mupiHeight = 0;

let ball;
let player;
let score = 0;
let gameover = false;


function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    ball = new Ball();
    player = new Player();
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    background(0);
}

function draw() {
    background(0);
    if (!gameover) {
    newCursor(pmouseX, pmouseY);
    ball.ballMovement();
    ball.ballCollision(player);
    ball.showBall();
    player.showPlayer();
    textAlign(CENTER);
    textSize(32);
    text(score, windowWidth/2, 50)
    } else {
        textAlign(CENTER);
        textSize(32);
        text('Game Over', windowWidth/2, windowHeight/2);
    }
    
}

class Ball {
    constructor(){
        this.ballX = windowWidth/2;
        this.ballY = windowHeight/2;
        this.speedX = random(-5, 5);
        this.speedY = random(-5, 5);
        this.ballSize = 20;
    }

    ballMovement(){
        this.ballX += this.speedX;
        this.ballY += this.speedY;

        if (this.ballX < this.ballSize || this.ballX > windowWidth-this.ballSize) {
            this.speedX *= -1;
            
        }
        if (this.ballY < this.ballSize) {
            this.speedY *= -1
        }
        if(this.ballY > windowHeight-this.ballSize){
            gameover = true;
        }
    }

    showBall(){
        fill(255)
        ellipse(this.ballX, this.ballY, this.ballSize)
    }

    ballCollision(player){
        if (this.ballY + this.ballSize > player.y && this.ballX > player.x && this.ballX < player.x + player.w ) {
            this.speedY *= -1;
            score++;
        }
    }
}

class Player {
    constructor(){
        this.w = 200;
        this.h = 10;
        this.x = windowWidth/2 - this.w/2;
        this.y = windowHeight/2 + 250;
    }

    showPlayer(){
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);

}

socket.on('mupi-instructions', instructions => {
    console.log('ID: ' + socket.id);

    let { interactions } = instructions;
    switch (interactions) {
        case 0:
            let { pmouseX, pmouseY } = instructions;
            controllerX = (pmouseX * mupiWidth) / deviceWidth;
            controllerY = (pmouseY * mupiHeight) / deviceHeight;
            console.log({ controllerX, controllerY });
            break;
        case 1:
            let { pAccelerationX, pAccelerationY, pAccelerationZ } = instructions;
            ballSize = pAccelerationY < 0 ? pAccelerationY * -2 : pAccelerationY * 2;
            break;
        case 2:
            let { rotationX, rotationY, rotationZ } = instructions;
            player.x = (rotationY * mupiWidth) / 90;
            break;
    }


});

socket.on('mupi-size', deviceSize => {
    let { deviceType, windowWidth, windowHeight } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    console.log(`User is using an ${deviceType} smartphone size of ${deviceWidth} and ${deviceHeight}`);
});