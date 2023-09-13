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

let countRepeatsOfGame = 0;

let baseSpeed = 4

let score = 0

let rightIndex = 0
let wrongIndex = 0

let rightTankIndex = 1
let leftTankIndex = 0

let rightBorder = 20
let leftBorder = 1760

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
        isTankShooted: false,
        width: 141,
        canTankMove: true,
        height: 141,
        startx: 270,
        starty: 205,
        x: 270,
        y: 205,
        buffer: 15,
        speed: 2.235,//13.55
        model: null,
        isDead: false,
        isRightTank: false,
    },
    {
        isTankShooted: false,
        width: 141,
        canTankMove: true,
        height: 141,
        startx: 1400,
        starty: 370,
        x: 1400,
        y: 370,
        buffer: 15,
        speed: -2,//13
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
    isShooted: false,
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

let explodesFrames = {
    isSpriteOnGoing: false,
    model: undefined,
    start: false,
    frameSizeX: 64,
    frameSizeY: 68,
    selectedSprite: 0,
    count: 2,
    x: 300,
    y: 300,
    width: 170,
    height: 120,
    spriteDuration: 1000,
    spritesInterval: undefined,
    canDraw: false,
}

//

//подгрузка фото

let font = new FontFace('ProtoSans56', 'url(font/font.ttf)');

font.load().then(function (font) {
    document.fonts.add(font);
});

let explodedRightEnemyTankTank = new Image()
explodedRightEnemyTankTank.src = "./images/ExplodedEnemyTank2.png"

let explodedLeftEnemyTankTank = new Image()
explodedLeftEnemyTankTank.src = "./images/ExplodedEnemyTank1.png"

let explosionSprite1 = new Image()
explosionSprite1.src = "./images/explosionFrame1.png"

let background = new Image();
background.src = "./images/background.png";
ground.model = background;


let explodes = new Image();
explodes.src = "./images/explodes.png";
explodesFrames.model = explodes;

explodes.onload = function () {
    canvasContext.drawImage(explodes, 0, 0);
}

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
    draw(obj)
    obj.isDead = false;
}

function explosionAnimation(obj) {
    canvasContext.drawImage(explosionSprite1, obj.x + obj.buffer, obj.y + obj.buffer)
}

function changeTankModel(){
    if(tanks[0].isTankShooted){
        tanks[0].model = explodedLeftEnemyTankTank
    }
    if(tanks[1].isTankShooted){
        tanks[1].model = explodedRightEnemyTankTank
    }
}

function returnModel(){
    tanks[0].model = enemyTank1
    tanks[1].model = enemyTank2
}

function niceShot(obj) {
    let shotRight = projectile.x < obj.x + obj.width;
    let shotLeft = projectile.x + projectile.width > obj.x;
    let shotTop = projectile.y > obj.y;
    let shotDown = projectile.y < obj.y + obj.height;
    if (shotLeft && shotRight && shotTop && shotDown) {
        obj.isTankShooted = true
        explodesFrames.start = true;
        removeObject(projectile);
        explodesFrames.x = obj.x
        explodesFrames.y = obj.y
        changeTankModel()
        explodesFrames.canDraw = true;   
        explodesFrames.isSpriteOnGoing = true; 
        setTimeout(() => {
            obj.isDead = true
            returnModel()
            obj.isTankShooted = false
        }, 2000)
        obj.canTankMove = false
    }
}

function drawSprites(obj) {
    if (obj.canDraw) {
        drawImageSpite(obj);
        if (obj.start) {
            obj.spritesInterval = setInterval(() => {
                obj.selectedSprite += 1;
                if (obj.selectedSprite > obj.count - 1){
                    clearInterval(obj.spritesInterval)
                    obj.canDraw = false;
                    explodesFrames.isSpriteOnGoing = false; 
                    obj.selectedSprite = 0 
                }
            }, obj.spriteDuration);
            obj.start = false;
        }
    }
}

function clickmouse(event) {
    if (game.isGame === true) {
        if(!projectile.isShooted){
            projectile.disX = event.clientX;
            projectile.disY = event.clientY;
            if (projectile.dx === 0 && projectile.dy === 0) {
                let dx = projectile.disX - projectile.x;
                let dy = projectile.disY - projectile.y;
                let gip = Math.sqrt(dx ** 2 + dy ** 2)
                projectile.dx = (dx / gip) * projectile.K
                projectile.dy = Math.abs((dy / gip) * projectile.K)
            }
            projectile.isShooted = true
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

function drawImageSpite(obj) {
    canvasContext.drawImage(obj.model, obj.frameSizeX * obj.selectedSprite, 0, obj.frameSizeX, obj.frameSizeY, obj.x, obj.y, obj.width, obj.height)
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
    projectile.isShooted = false
    tanks[rightIndex].canTankMove = true
    tanks[wrongIndex].canTankMove = true
}

function updateObjects() {
    projectile.x += projectile.dx;
    projectile.y -= projectile.dy;
    if(tanks[rightIndex].canTankMove){
        tanks[rightIndex].x += tanks[rightIndex].speed
    }
    if(tanks[wrongIndex].canTankMove){
        tanks[wrongIndex].x += tanks[wrongIndex].speed
    }
}

function isProjectileAbord() {
    if (projectile.x + projectile.dx > game.width || projectile.x + projectile.dx < 0 || projectile.y < 100) {
        projectile.x = projectile.startx;
        projectile.y = projectile.starty;
        projectile.dx = 0;
        projectile.dy = 0;
        if(!tanks[wrongIndex].isTankShooted || !tanks[rightIndex].isTankShooted){
            projectile.isShooted = false
        }
    }
}

function update() {
    isTankIsAbordBorder()
    isProjectileAbord()
    draw(projectile);
    updateObjects()
    niceShot(tanks[rightIndex]);
    tankShotCheck(tanks[rightIndex])
    niceShot(tanks[wrongIndex])
    tankShotCheck(tanks[wrongIndex])
}

function drawContent() {
    canvasContext.font = textSizeAndFont;
    canvasContext.align = "center"
    if(!tanks[rightIndex].canTankMove || !tanks[wrongIndex].canTankMove){
        canvasContext.fillStyle = "#00ff15";
        canvasContext.fillText(content[currIndex].rightWord, tanks[rightIndex].x - tanks[rightIndex].buffer, tanks[rightIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
        canvasContext.fillStyle = "#732c2c";
        canvasContext.fillText(content[currIndex].wrongWord, tanks[wrongIndex].x - tanks[rightIndex].buffer, tanks[wrongIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
    } else {
        canvasContext.fillStyle = textFont;
        canvasContext.fillText(content[currIndex].rightWord, tanks[rightIndex].x - tanks[rightIndex].buffer, tanks[rightIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
        canvasContext.fillText(content[currIndex].wrongWord, tanks[wrongIndex].x - tanks[rightIndex].buffer, tanks[wrongIndex].y - tanks[rightIndex].buffer, contentSize.width, contentSize.height);
    }
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
    drawSprites(explodesFrames)
}

function isTankIsAbordBorder() {
    if (tanks[1].x < rightBorder || tanks[0].x > leftBorder) {
        if(!explodesFrames.isSpriteOnGoing){
            tanks[0].x = tanks[0].startx
            tanks[1].x = tanks[1].startx
            rightWord.x = rightWord.startx
            wrongWord.x = wrongWord.startx
            tanks[0].canTankMove = true
            tanks[1].canTankMove = true
            projectile.isShooted = false
            countRepeatsOfGame++
        } else {
            tanks[0].canTankMove = false
            tanks[1].canTankMove = false
        }
    }
}


function drawEndGame() {
    draw(endGameScr)
    draw(restartButton)
    canvasContext.fillStyle = textFont;
    canvasContext.font = textSizeAndFontForEnGameScreen;
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
        console.log(countRepeatsOfGame)
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

