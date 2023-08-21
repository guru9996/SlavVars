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
let content = ["правильное слово 1", "неправильное слово 1", "правильное слово 2", "неправильное слово 2"]

let score = 0

const tankTextSizeAndFont = "32px Arial"

let i = 0;


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
}

function removeObject(obj) {
    obj.x = obj.startx;
    obj.isDead = false;
    draw(obj)
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
    } else {
        if(event.clientX >= restartButton.x && event.clientX < restartButton.x + restartButton.width && event.clientY >= restartButton.y && event.clientY <= restartButton.y + restartButton.height){
            location.reload();
        }
    }
}

function draw(obj) {
    canvasContext.drawImage(obj.model, obj.x, obj.y);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function rightEnemyTankNiceShotCheck(){
    if (rightEnemyTank.isDead === true) {
        if(rightEnemyTank.isRightTank === false){
            score -= 1
        } else {
            score += 1
        }
        contentSetup()
        wrongWord.x = wrongWord.startx
        rightWord.x = rightWord.startx
        removeObject(rightEnemyTank);
        removeObject(leftEnemyTank);
        removeObject(projectile)
    }
}

function leftEnemyTankNiceShotCheck(){
    if (leftEnemyTank.isDead === true) {
        if(leftEnemyTank.isRightTank === false){
            score -=1
        } else {
            score +=1 
        }
        contentSetup()
        wrongWord.x = wrongWord.startx
        rightWord.x = rightWord.startx
        removeObject(leftEnemyTank);
        removeObject(rightEnemyTank);
        removeObject(projectile)
    }
}

function updateObjects(){
    projectile.x += projectile.dx;
    projectile.y -= projectile.dy;
    leftEnemyTank.x -= leftEnemyTank.speed
    rightEnemyTank.x += rightEnemyTank.speed
    rightWord.x += rightWord.dx
    wrongWord.x += wrongWord.dx
}

function isProjectileAbord(){
    if (projectile.x + projectile.dx > game.width|| projectile.x + projectile.dx < 0 || projectile.y<100) {
        projectile.x = projectile.startx;
        projectile.y = projectile.starty;
        projectile.dx = 0;
        projectile.dy = 0;
        draw(projectile);
    }
}

function update(){
    isProjectileAbord()
    updateObjects()
    niceShot(rightEnemyTank);
    rightEnemyTankNiceShotCheck()
    niceShot(leftEnemyTank)
    leftEnemyTankNiceShotCheck()
    isTankIsAbordBorder()
}

function drawContent(){
    canvasContext.font = tankTextSizeAndFont;// глобальным это сделать нельзя, по этому оно тут
    canvasContext.fillText(content[i+1], rightWord.x, rightWord.y);
    canvasContext.fillText(content[i], wrongWord.x, wrongWord.y);
}

function drawFrame() {
    canvasContext.clearRect(0, 0, ground.width, ground.height);
    draw(ground)
    drawContent()
    draw(rightEnemyTank)
    draw(leftEnemyTank)
    draw(frieldlyTank)
    draw(projectile)
    drawScore()
}



function isTankIsAbordBorder(){
    if(leftEnemyTank.x < 20 || rightEnemyTank.x > 1800){
        score -= 1
        rightEnemyTank.x = rightEnemyTank.startx
        leftEnemyTank.x = leftEnemyTank.startx
        rightWord.x = rightWord.startx
        wrongWord.x = wrongWord.startx
        draw(rightEnemyTank)
        draw(leftEnemyTank)
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

function drawScore(){
    canvasContext.fillText("Score: ", 50, 50);
    canvasContext.fillText(score, 150, 50);
}

function play(){
    drawFrame()
    update()
    if(game.isGame === true){
        requestAnimationFrame(play)
    }
    if(score === -5){
        drawLose()
        game.isGame = false
    }
    if(score === 15){
        drawWin()
        game.isGame = false
    }
}

function contentSetup() {
    i = getRandomInt(content.length - 1)
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
initEventsListeners()
play()

//

