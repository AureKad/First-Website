let canvas;
let ctx;
let key_up = false;
let key_down = false;
let myReq;
let background =new Image();
let flyingLeft = true;
let ballspeed=10;
let pointsRight=0;
let pointsLeft=0;
let degrees=250 + 41*Math.random();
let ballhits=0;

let pc = {
    x:50,
    y:230,
    width:10,
    height:40,
    src: 'img/playerChar.png'
}

let ec = {
    x:740,
    y:230,
    width:10,
    height:40,
    src: 'img/enemyChar.png'
}

let ball = {
    x:395,
    y:245,
    width:10,
    height:10,
    src: 'img/ball.png'
}

document.addEventListener('keydown', (e)=>{
    if (e.code === 'ArrowUp') {
        key_up=true;
    }
    if (e.code === 'ArrowDown') {
        key_down=true;
    }
});

document.addEventListener('keyup', (e)=>{
    if (e.code === 'ArrowUp') {
        key_up=false;
    }
    if (e.code === 'ArrowDown') {
        key_down=false;
    }
});


function gameStart() {
    canvas = document.getElementById('canvasid');
    ctx = canvas.getContext('2d');
    setInterval(update, 40);
    setInterval(checkforBallCollision,40)
    loadImages();
    draw();
}

function checkforBallCollision() {
    if (ball.x< pc.x+pc.width &&
        ball.y< pc.y+pc.height &&
        ball.y> pc.y &&
        ball.x> pc.x ||
        ball.x< pc.x+pc.width &&
        ball.y +ball.height< pc.y+pc.height &&
        ball.y + ball.height> pc.y &&
        ball.x> pc.x ||
        ball.x + ball.width< pc.x+pc.width &&
        ball.y< pc.y+pc.height &&
        ball.y> pc.y &&
        ball.x+ ball.width> pc.x ||
        ball.x+ball.width< pc.x+pc.width &&
        ball.y +ball.height< pc.y+pc.height &&
        ball.y + ball.height> pc.y &&
        ball.x+ball.width> pc.x )  {
            degrees = 270-degrees +90;
            if (key_up) {
                degrees+=10;
            }
            if (key_down) {
                degrees-=10;
            }
            ballhits++;
            ballspeed = ballspeed+ Math.floor(ballhits/5);
        }

    if (ball.x + ball.width< ec.x+ec.width &&
        ball.y< ec.y+ec.height &&
        ball.y> ec.y &&
        ball.x+ ball.width> ec.x ||
        ball.x + ball.width< ec.x+ec.width &&
        ball.y +ball.height< ec.y+ec.height &&
        ball.y + ball.height> ec.y &&
        ball.x + ball.width> ec.x ||
        ball.x < ec.x+ec.width &&
        ball.y< ec.y+ec.height &&
        ball.y> ec.y &&
        ball.x> ec.x ||
        ball.x < ec.x+ec.width &&
        ball.y +ball.height< ec.y+ec.height &&
        ball.y + ball.height> ec.y &&
        ball.x > ec.x)  {
            degrees = 270 - degrees+90;
            ballhits++;
            ballspeed = ballspeed+ Math.floor(ballhits/5);
        }
}

function outOfBounds() {
    if (ball.x<ballspeed) {
        pointsRight++;
        pointright.innerHTML = `${pointsRight}`
        degrees=70 + 41*Math.random();
        reset();
    }
    if(ball.x>800-ballspeed) {
        degrees=250 + 41*Math.random();
        pointsLeft++;
        pointleft.innerHTML = `${pointsLeft}`
        reset();
    }
}

function reset() {
    ball.x =395;
    ball.y =245;
    ballhits=0;
    ballspeed=10;
}

function wallhit() {
    if (ball.y<=16+ballspeed/2 || ball.y>=474-ballspeed/2) {
        if (degrees>180) {
            degrees = 360 - degrees + 180
        } else {
            degrees = 180-degrees;
        }
    }
}

function loadImages() {
    pc.img = new Image();
    pc.img.src = pc.src;
    ec.img = new Image();
    ec.img.src = pc.src;
    ball.img = new Image();
    ball.img.src = ball.src;
    background.src = 'img/background.png'
}

function update() {
    if(key_up&&pc.y>16) {
        pc.y -=8;
    }
    if(key_down&&pc.y<444) {
        pc.y+=8;
    }
    if(ball.y-ball.height/2 < ec.y&&ec.y>16) {
        ec.y -=8;
    }
    if(ball.y-ball.height/2 > ec.y&&ec.y<444) {
        ec.y +=8;
    }
    ball.x +=ballspeed*Math.sin(degrees*Math.PI/180).toFixed(2);
    ball.y +=ballspeed*Math.cos(degrees*Math.PI/180).toFixed(2);
    outOfBounds();
    wallhit();
}

function draw() {
    ctx.drawImage(background,0,0);  
    ctx.drawImage(pc.img, pc.x, pc.y, pc.width, pc.height);
    ctx.drawImage(ec.img, ec.x, ec.y, ec.width, ec.height);
    ctx.drawImage(ball.img, ball.x, ball.y, ball.width, ball.height);
    myReq = requestAnimationFrame(draw);
}