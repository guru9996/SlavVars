let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

//подгрузка фото

let background = new Image();
background.src = "./images/background.png";

background.onload = function() {
    canvas.width = game.width;
    canvas.height = game.height;
    canvasContext.drawImage(background, 0, 0);
}

let enemyTank1 = new Image();
enemyTank1.src = "./images/enemyTank1.png";
enemyTank1.onload = function() {
    canvasContext.drawImage(enemyTank1, rightEnemyTank.x, rightEnemyTank.y);
}

let enemyTank2 = new Image();
enemyTank2.src = "./images/enemyTank2.png";
enemyTank2.onload = function() {
    canvasContext.drawImage(enemyTank2, leftEnemyTank.x, leftEnemyTank.y);
}

let tank = new Image();
tank.src = "./images/tank.png";
tank.onload = function() {
    canvasContext.drawImage(tank, frieldlyTank.x, frieldlyTank.y);
}

let lostScr = new Image()
lostScr.src = "./images/lostScreen.png"

let winScr = new Image()
winScr.src = "./images/winScreen.png"

let projectileModel = new Image()
projectileModel.src = "./images/pula.png"

let restButt = new Image()
restButt.src = "./images/restartButton.png"
//

//объекты и массивы
let content = ["правильное слово", "неправильное слово", "правильное слово", "неправильное слово", "правильное слово", "неправильное слово", "правильное слово", "неправильное слово", "правильное слово", "неправильное слово", "правильное слово", "неправильное слово"]

let i = 0;
i = getRandomInt(content.length - 1)

let ground = {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    model: background,
}

let lostScreen = {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    model: lostScr,
}
let winScreen = {
    width: 1920,
    height: 1080,
    x: 0,
    y: 0,
    model: winScr,
}

let rightEnemyTank = {
    width: 149,
    startx: 270,
    x: 270,
    y: 145, 
    speed: 6.235,//13.55
    model: enemyTank1,
    isDead: false,
    isRightTank: false,
}

let leftEnemyTank = {
    width: 149,
    startx: 1400,
    x: 1400,
    y: 265, 
    speed: 6,//13
    model: enemyTank2,
    isDead: false,
    isRightTank: false,
}

let frieldlyTank = {
    model: tank,
    x: 870,
    y: 850,
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
    x: 896,
    y: 790,
    startx: 896,
    starty: 790,
    model: projectileModel,
    dx: 0,
    dy: 0,
    disX: 0,
    disY: 0,
}

let restartButton = {
    height: 124,
    width: 397,
    x: 796,
    y: 790,
    model: restButt,
}

//

//функции

function initEventsListeners() {
    window.addEventListener("click", clickmouse);
    window.addEventListener("click", restartGame)
}

function restartGame(event) {
    if (!game.isGame){
        if(event.clientX >= restartButton.x && event.clientX < restartButton.x + restartButton.width && event.clientY >= restartButton.y && event.clientY <= restartButton.y + restartButton.height){
            location.reload();
        }
    }
}

function removeObject(obj) {
    obj.x = obj.startx;
    obj.isDead = false;
}


function niceShot(obj) {
    let shotLeft1 = projectile.x < obj.x + obj.width;
    let shotLeft = projectile.x > obj.x;
    let shotTop = projectile.y < obj.y;
    if(shotLeft && shotLeft1 && shotTop){
        obj.isDead = true
    }
}

function clickmouse(event) {
    if (game.isGame === true) {
        projectile.disX = event.clientX;
        projectile.disY = event.clientY;
        if (projectile.dx === 0 && projectile.dy === 0) {
            projectile.dx = Math.round(((projectile.disX - projectile.x) / (((Math.abs(projectile.disX - projectile.x) ** 2) + Math.abs(projectile.disY - projectile.y) ** 2) ** (1 / 2) / projectile.height)));
            projectile.dy = Math.abs(Math.round(((projectile.disY - projectile.y) / (((Math.abs(projectile.disX - projectile.x) ** 2) + Math.abs(projectile.disY - projectile.y) ** 2) ** (1 / 2) / projectile.height ))));
        }
    }
}

function draw(obj) {
    canvasContext.drawImage(obj.model, obj.x, obj.y);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function update(){
    if (projectile.y<0) {
        game.isGame = false
        drawLose()
    }
    projectile.x += projectile.dx;
    projectile.y -= projectile.dy;
    leftEnemyTank.x -= leftEnemyTank.speed
    rightEnemyTank.x += rightEnemyTank.speed
    rightWord.x += rightWord.dx
    wrongWord.x += wrongWord.dx
    niceShot(rightEnemyTank);
    if (rightEnemyTank.isDead === true) {
        if(rightEnemyTank.isRightTank === false){
            game.isPlayerWon = false
        } else {
            game.isPlayerWon = true
        }
        game.isGame = false
        removeObject(rightEnemyTank);
    }
    niceShot(leftEnemyTank)
    if (leftEnemyTank.isDead === true) {
        if(leftEnemyTank.isRightTank === false){
            game.isPlayerWon = false
        } else {
            game.isPlayerWon = true
        }
        game.isGame = false
        removeObject(leftEnemyTank);
    }
    isTankIsAbordBorder()
}

function drawFrame() {
    canvasContext.clearRect(0, 0, ground.width, ground.height);
    draw(ground)
    draw(rightEnemyTank)
    draw(leftEnemyTank)
    draw(frieldlyTank)
    draw(projectile)
    canvasContext.font = " 32px Arial";// глобальным это сделать нельзя, по этому оно тут
    canvasContext.fillText(content[i+1], rightWord.x, rightWord.y);
    canvasContext.fillText(content[i], wrongWord.x, wrongWord.y);
}

function isTankIsAbordBorder(){
    if(leftEnemyTank.x < 20){
        game.isGame = false
    }
}

function drawLose(){
    draw(lostScreen)
    draw(restartButton)
}

function drawWin(){
    draw(winScreen)
    draw(restartButton)
}

function play(){
    if(game.isGame === true){
        drawFrame()
        update()
    } else {
        if(!game.isPlayerWon){
            drawLose()
        } else {
            drawWin()
        }
    }
    requestAnimationFrame(play)
}

function contentSetup() {
    if (i % 2 === 0){
        rightEnemyTank.isRightTank = true
        leftEnemyTank.isRightTank = false
    
        rightWord.y = 290 //да, это оплохое решение, но есть ставить такой же y, как и у танков, то эта штука отказывакется работать(
        rightWord.startx = rightEnemyTank.startx
        wrongWord.startx = leftEnemyTank.startx
        wrongWord.y = 140 //да, это оплохое решение, но есть ставить такой же y, как и у танков, то эта штука отказывакется работать(
    
        rightWord.dx = -leftEnemyTank.speed
        wrongWord.dx = rightEnemyTank.speed
    } else {
        rightEnemyTank.isRightTank = false
        leftEnemyTank.isRightTank = true

        rightWord.y = leftEnemyTank.y
        rightWord.startx = leftEnemyTank.startx
        wrongWord.y = rightEnemyTank.y
        wrongWord.startx = rightEnemyTank.startx

        rightWord.dx = -leftEnemyTank.speed
        wrongWord.dx = rightEnemyTank.speed
    }
}

//

//тело
contentSetup()
initEventsListeners()
play()

//

