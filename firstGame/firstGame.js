let gameStarted = false;
let KEY_SPACE = false;
let KEY_UP = false;
let KEY_DOWN = false;
let canvas;
let ctx;
let backgroundImage = new Image();
let ufos = [];
let shots = []; 
let shotdelay = false;
let upd;
let createufo;
let myReq;
let score=0;
const HIGH_SCORES = 'highscore';
const highScoreString = localStorage.getItem(HIGH_SCORES);
const highscore = JSON.parse(highScoreString) ?? [];
let ufosDestroyed =0;
let difficulty =0;

let rocket ={
    x: 50,
    y: 250,
    width: 100,
    height: 55,
    src: 'images/Rocket.png'
};

document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowUp") {
        KEY_UP= true;
    } 
    if (e.code === "ArrowDown") {
        KEY_DOWN = true; 
    }
    if (e.code === "Space") {
        KEY_SPACE = true;
    }
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
});
document.addEventListener('keyup', (e)=> {
    if (e.code === "ArrowUp") {
        KEY_UP= false;
    } 
    if (e.code === "ArrowDown") {
        KEY_DOWN = false; 
    }
    if (e.code === "Space") {
        KEY_SPACE = false;
    }
});
function startGame() {
    if (!gameStarted) {
        ufos = [];
        shots =[];
        rocket.y=250;
        score=0;
        difficulty=0;
        ufosDestroyed=0;
        gameStarted=true;

        canvas = document.getElementById('canvasid');
        ctx = canvas.getContext('2d');
        loadImages();
        createUfos();
        upd = setInterval(update, 40);
        createufo = setInterval(createUfos,5000);
        setInterval(checkforCollision, 40);
        draw();
    }
}

function checkforCollision() {
    ufos.forEach(function(ufo) {
        if (rocket.x + rocket.width > ufo.x &&
            rocket.y + rocket.height > ufo.y && 
            rocket.x < ufo.x &&
            rocket.y < ufo.y) {
                rocket.img.src = 'images/boom.png'
                console.log("Collision!!!");
                ufos = ufos.filter(u => u != ufo);
                gameOver();
            }
        else if (rocket.x + rocket.width > ufo.x &&
            rocket.y + rocket.height > ufo.y+ufo.height && 
            rocket.x < ufo.x &&
            rocket.y < ufo.y+ufo.height) {
                rocket.img.src = 'images/boom.png'
                console.log("Collision!!!");
                ufos = ufos.filter(u => u != ufo);
                gameOver();
            }
        else if (rocket.x + rocket.width > ufo.x+ufo.width &&
            rocket.y + rocket.height > ufo.y+ufo.height && 
            rocket.x < ufo.x+ufo.width &&
            rocket.y < ufo.y+ufo.height) {
                rocket.img.src = 'images/boom.png'
                console.log("Collision!!!");
                ufos = ufos.filter(u => u != ufo);
                gameOver();
            }
    });
}

function createUfos() {
    let ufo = {
        x: 800,
        y: Math.random()*421,
        width: 100,
        height: 45,
        health: 3,
        src: 'images/ufo.png',
        img: new Image()
    };
    ufo.img.src = ufo.src;
    ufos.push(ufo);
}

function createShot() {
    let shot = {
        x: rocket.x +rocket.width,
        y: rocket.y + 20,
        width: 48,
        height: 16,
        src: 'images/laser.png',
        img: new Image()
    };
    shot.img.src = shot.src;
    shots.push(shot);
}

function update() {
    if(KEY_UP && rocket.y>backgroundImage.y) {
        rocket.y -= 6+difficulty; 
    }
    if(KEY_DOWN && rocket.y<500-rocket.height) {
        rocket.y += 6+difficulty; 
    }
    if (KEY_SPACE) {
        if (!shotdelay) {
            createShot();
            shotdelay=true;
            setTimeout(shotreload, 500-50*difficulty);
        }
        
    }
    shots.forEach(function(shot) {
        shot.x += 10;
        if (shot.x>backgroundImage.width) {
            shots = shots.filter (u => u != shot);
        }
    }) 

    ufos.forEach(function(ufo) {
        ufo.x  -= 5;
    });
    checkIfShotHit();
    let tmp = difficulty;
    difficulty = Math.min(Math.floor(ufosDestroyed/3),4);
    if (tmp!= difficulty) {
        clearInterval(createufo);
        createufo = setInterval(createUfos,5000-1000*difficulty);
    }
    checkIfUfoGotThrough();
}

function checkIfUfoGotThrough () {
    ufos.forEach(function(ufo) {
        if (ufo.x<-80) {
            gameOver();
        }
    });
}


function checkIfShotHit () {
    ufos.forEach(function(ufo) {
        shots.forEach(function(shot) {
            if(shot.x + shot.width> ufo.x +10 &&
                shot.y + shot.height< ufo.y+ufo.height+10 &&
                shot.x < ufo.x+ufo.width-5 &&
                shot.y > ufo.y-10) {
                    console.log('shot hit');
                    shots = shots.filter (u => u != shot);
                    ufo.health -=1;
                    score+=10*Math.pow(2,difficulty);
                    if (ufo.health==0) {
                        score+=20*Math.pow(2,difficulty);
                        ufosDestroyed++;
                        ufos = ufos.filter (u => u != ufo);
                    }
                }
        });
    });
}

function shotreload() {
    shotdelay=false;
}

function gameOver() {
    clearInterval(upd);
    clearInterval(createufo);
    window.cancelAnimationFrame(myReq);
    draw();
    window.cancelAnimationFrame(myReq);
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Verloren",canvas.width/2-110,canvas.height/2);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.fillText("Click to play again",canvas.width/2-135,canvas.height/2+100);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`,canvas.width/2-90,100);
    updatehighscore();
    gameStarted=false;
}

function loadImages() {
    backgroundImage.src = 'images/background.png';
    rocket.img = new Image();
    rocket.img.src = rocket.src;
}

function draw() {
    ctx.drawImage(backgroundImage,0,0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);
    ufos.forEach(function(ufo) {
    ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
    });
    shots.forEach(function(shot) {
    ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
    });
    scoreid.innerHTML = `Score: ${score}`;
    difficultyid.innerHTML = `Difficulty: ${difficulty}`;
    myReq = requestAnimationFrame(draw);
}

function pregame() {
    canvas = document.getElementById('canvasid');
    ctx = canvas.getContext('2d');
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.fillText("CLICK TO PLAY",canvas.width/2-110,canvas.height/2);
}

function highscorecreate() {
    const highscore = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    for (let i=0; i<10; i++) {
        highscoreid.innerHTML += `${i+1}. ${highscore[i]}<br/>`; 
    }
}

function updatehighscore() {
    for (let i=0; i<10; i++) {
        if (highscore[i]<score || highscore[i]==undefined) {
            let tmp = highscore[i];
            highscore[i]= score;
            score = tmp;
        }
    }
    highscoreid.innerHTML = "";
    for (let i=0; i<10; i++) {
        highscoreid.innerHTML += `${i+1}. ${highscore[i]}<br/>`; 
    }
    localStorage.setItem(HIGH_SCORES,JSON.stringify(highscore));
}