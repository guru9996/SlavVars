let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

//объекты и массивы
// так было раньше

let content = [ // так лучше
    {
        rightWord: 'правильно',
        wrongWord: 'неправильно'
    },
    {
        rightWord: 'правильно',
        wrongWord: 'неправильно'
    }
]

let contentSize = {
    width: 200,
    height: 30,
}

let textFont = "#FFFFFF"

let countRepeatsOfGame = 14;

let score = 0

let rightIndex = 0
let wrongIndex = 0

let rightTankIndex = 1
let leftTankIndex = 0

let rightBorder = 20
let leftBorder = 1800

let currIndex = 0

const textSizeAndFont = "bold 24px ProtoSans56"

const textSizeAndFontForEnGameScreen = "72px ProtoSans56"

const textSizeAndFontForScore = "bold 32px ProtoSans56"

let i = 0;


let ground = {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    model: null,
}


let endGameScr = {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    model: null,
}

let tanks = [
    {
        width: 141,
        height: 141,
        startx: 270,
        starty: 205,
        x: 270,
        y: 205,
        buffer: 15,
        speed: 3.235,//13.55
        model: null,
        isDead: false,
        isRightTank: false,
    },
    {
        width: 141,
        height: 141,
        startx: 1400,
        starty: 370,
        x: 1400,
        y: 370,
        buffer: 15,
        speed: -3,//13
        model: null,
        isDead: false,
        isRightTank: false,
    }
]

let frieldlyTank = {
    model: null,
    width: 134, 
    height: 158,
    x: 868,
    y: 830,
    angle: 34,
}

let game = {
    width: 1920,
    height: 1080,
    isGame: true,
    isPlayerWon: false
}

let wrongWord = {
    color: "gray",
    width: 250,
    height: 150,
    startx: 350,
    starty: 270,
    x: 350,
    y: 270,
    dx: null,
}

let rightWord = {
    color: "gray",
    width: 250,
    height: 150,
    startx: 1350,
    starty: 270,
    x: 1350,
    y: 270,
    dx: null,
}

let projectile = {
    height: 57,
    width: 57,
    x: 906,
    y: 760,
    startx: 906,
    starty: 740,
    model: null,
    dx: 0,
    dy: 0,
    disX: 0,
    disY: 0,
    K: 15
}

let restartButton = {
    height: 124,
    width: 397,
    x: 750,
    y: 790,
    model: null,
}

let gameScore = {
    maxScoreX: 915,
    maxScoreY: 130,
    scoreX: 870,
    scoreY: 130,
    scoreWordX: 860,
    scoreWordY: 50,
}

let endGameScore = {
    maxScoreX: 915,
    maxScoreY: 700,
    scoreX: 800,
    scoreY: 700,
    scoreWordX: 800,
    scoreWordY: 610,
}

//

//подгрузка фото

let font = new FontFace('ProtoSans56', 'url(font/font.ttf)');

font.load().then(function(font) {
    console.log('font ready');
    document.fonts.add(font);
});

let explosionSprite1 = new Image()
explosionSprite1.src = "./images/explosionFrame1.png"

let background = new Image();
background.src = "./images/background.png";
ground.model = background

background.onload = function () {
    canvas.width = game.width;
    canvas.height = game.height;
    canvasContext.drawImage(background, 0, 0);
}

let enemyTank1 = new Image();
enemyTank1.src = "./images/enemyTank1.png";
tanks[0].model = enemyTank1
enemyTank1.onload = function () {
    canvasContext.drawImage(enemyTank1, tanks[0].x, tanks[0].y);
}

let enemyTank2 = new Image();
enemyTank2.src = "./images/enemyTank2.png";
tanks[1].model = enemyTank2
enemyTank2.onload = function () {
    canvasContext.drawImage(enemyTank2, tanks[1].x, tanks[1].y);
}

let tank = new Image();
tank.src = "./images/tank.png";
frieldlyTank.model = tank
tank.onload = function () {
    canvasContext.drawImage(tank, frieldlyTank.x, frieldlyTank.y);
}

let endGameScreen = new Image()
endGameScreen.src = "./images/endGameScr.png"
endGameScr.model = endGameScreen

let projectileModel = new Image()
projectileModel.src = "./images/pula.png"
projectile.model = projectileModel

let restButt = new Image()
restButt.src = "./images/restartButton.png"
restartButton.model = restButt
//


//функции

function initEventsListeners() {
    window.addEventListener("click", clickmouse);
}

function removeObject(obj) {
    obj.dx = 0
    obj.dy = 0
    obj.x = obj.startx;
    obj.y = obj.starty
    obj.isDead = false;
    draw(obj)
}

function explosionAnimation(obj){
    canvasContext.drawImage(explosionSprite1, obj.x + obj.buffer, obj.y + obj.buffer)
}

function niceShot(obj) {
    let shotRight = projectile.x < obj.x + obj.width;
    let shotLeft = projectile.x + projectile.width > obj.x; 
    let shotTop = projectile.y > obj.y;
    let shotDown = projectile.y < obj.y + obj.height; 
    if (shotLeft && shotRight && shotTop && shotDown){
        explosionAnimation(obj)
        setTimeout(3000)
        obj.isDead = true
    }
}

function clickmouse(event) {
    if (game.isGame === true) {
        projectile.disX = event.clientX;
        projectile.disY = event.clientY;
        if (projectile.dx === 0 && projectile.dy === 0) {
            let dx = projectile.disX - projectile.x;
            let dy = projectile.disY - projectile.y;
            let gip = Math.sqrt(dx ** 2 + dy ** 2)
            projectile.dx = (dx / gip) * projectile.K
            projectile.dy = Math.abs((dy / gip) * projectile.K)
        }
    } else {
        if (event.clientX >= restartButton.x && event.clientX < restartButton.x + restartButton.width && event.clientY >= restartButton.y && event.clientY <= restartButton.y + restartButton.height) {
            location.reload();
        }
    }
}

function draw(obj) {
    canvasContext.drawImage(obj.model, obj.x, obj.y, obj.width, obj.height);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function tankShotCheck(tank) {
    if (tank.isDead === true) {
        if (tank.isRightTank === false) {
            countRepeatsOfGame++
        } else {
            score += 1
            countRepeatsOfGame++
        }
        contentSetup()
        wrongWord.x = wrongWord.startx
        rightWord.x = rightWord.startx
        resetGame();
    }
}

function resetGame() {
    removeObject(tanks[rightIndex]);
    removeObject(tanks[wrongIndex]);
    removeObject(projectile)
}

function updateObjects() {
    projectile.x += projectile.dx;
    projectile.y -= projectile.dy;
    tanks[rightIndex].x += tanks[rightIndex].speed
    tanks[wrongIndex].x += tanks[wrongIndex].speed
}

function isProjectileAbord() {
    if (projectile.x + projectile.dx > game.width || projectile.x + projectile.dx < 0 || projectile.y < 100) {
        projectile.x = projectile.startx;
        projectile.y = projectile.starty;
        projectile.dx = 0;
        projectile.dy = 0;
    }
}

function update() {
    isProjectileAbord()
    draw(projectile);
    updateObjects()
    niceShot(tanks[rightIndex]);
    tankShotCheck(tanks[rightIndex])
    niceShot(tanks[wrongIndex])
    tankShotCheck(tanks[wrongIndex])
    isTankIsAbordBorder()
}

function drawContent() {
    canvasContext.fillStyle = textFont;
    canvasContext.font = textSizeAndFont;
    canvasContext.align = "center"
    canvasContext.fillText(content[currIndex].rightWord, tanks[rightIndex].x - tanks[rightIndex].buffer, tanks[rightIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
    canvasContext.fillText(content[currIndex].wrongWord, tanks[wrongIndex].x - tanks[rightIndex].buffer, tanks[wrongIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
}

function drawFrame() {
    canvasContext.clearRect(0, 0, ground.width, ground.height);
    draw(ground)
    drawContent()
    draw(tanks[rightIndex])
    draw(tanks[wrongIndex])
    draw(frieldlyTank)
    draw(projectile)
    drawScore()
}

function isTankIsAbordBorder() {
    if (tanks[1].x < rightBorder || tanks[0].x > leftBorder) {
        tanks[0].x = tanks[0].startx
        tanks[1].x = tanks[1].startx
        rightWord.x = rightWord.startx
        wrongWord.x = wrongWord.startx
        countRepeatsOfGame++
    }
}


function drawEndGame() {
    draw(endGameScr)
    draw(restartButton)
    canvasContext.fillStyle = textFont;
    canvasContext.font = textSizeAndFontForEnGameScreen ;
    canvasContext.fillText("Score: ", endGameScore.scoreWordX, endGameScore.scoreWordY);
    canvasContext.fillText(score, endGameScore.scoreX, endGameScore.scoreY);
    canvasContext.fillText("/  15", endGameScore.maxScoreX, endGameScore.maxScoreY);
}

function drawScore() {
    canvasContext.fillStyle = textFont;
    canvasContext.font = textSizeAndFontForScore;
    canvasContext.fillText("Score: ", gameScore.scoreWordX, gameScore.scoreWordY);
    canvasContext.fillText(score, gameScore.scoreX, gameScore.scoreY);
    canvasContext.fillText("/ 15", gameScore.maxScoreX, gameScore.maxScoreY);
}


function play() {
    drawFrame()
    update()
    if (game.isGame === true) {
        requestAnimationFrame(play)
    }
    if (countRepeatsOfGame === 15) {
        drawEndGame()
        game.isGame = false
    }
}

function contentSetup() {
    i = getRandomInt(content.length)
    if (i % 2 === 0) {
        rightIndex = leftTankIndex;
        wrongIndex = rightTankIndex;
    } else {
        rightIndex = rightTankIndex;
        wrongIndex = leftTankIndex;
    }
    tanks[rightIndex].isRightTank = true
    tanks[wrongIndex].isRightTank = false
}

//
//тело
contentSetup()
initEventsListeners()
play()

//

