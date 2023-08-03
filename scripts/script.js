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

let projectileModel = new Image()
projectileModel.src = "./images/pula.png"

//

//объекты и массивы
let content = ["слово 1", "слово 2"]

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

let rightEnemyTank = {
    width: 149,
    startx: 270,
    x: 270,
    y: 265, 
    speed: 13.55,//13.55
    model: enemyTank1,
    isDead: false,
}

let leftEnemyTank = {
    width: 149,
    startx: 1400,
    x: 1400,
    y: 265, 
    speed: 13,//13
    model: enemyTank2,
    isDead: false,
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
}

let word1 = {
    value: content[0],
    color: "gray", 
    width: 250,
    height: 150,
    x: 350, 
    y: 270,
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

let restart ={
    x: 550,
    x: 500,
    width: 200,
    height: 40,
    text: "RESTART",
    color: "LightCoral"
}

//

//функции

function initEventsListeners() {
    window.addEventListener("click", clickmouse);
}

function removeObject(obj) {
    obj.x = obj.startx;
    obj.isDead = false;
}

function niceShotInLeftTank(obj) {
    let shotLeft = projectile.x < obj.x;
    let shotRight = projectile.x + projectile.width > obj.x + obj.width;
    let shotTop = projectile.y + projectile.height < obj.y;
    let shotBottom = projectile.y < obj.y + obj.height;
    obj.isDead = (shotLeft && shotRight && shotTop && shotBottom);
}

function niceShotInRightTank(obj) {
    let shotLeft1 = projectile.x < obj.x + obj.width;
    let shotLeft = projectile.x > obj.x;
    let shotTop = projectile.y < obj.y;
    if(shotLeft && shotLeft1 && shotTop){
        obj.isDead = true
    }
}

function niceShotInLeftTank(obj) {
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

function update(){
    projectile.x += projectile.dx;
    projectile.y -= projectile.dy;
    leftEnemyTank.x -= leftEnemyTank.speed
    rightEnemyTank.x += rightEnemyTank.speed
    niceShotInRightTank(rightEnemyTank);
    if (rightEnemyTank.isDead === true) {
        console.log('+')
        game.isGame = false
        removeObject(rightEnemyTank);
    }
    niceShotInLeftTank(leftEnemyTank)
    if (leftEnemyTank.isDead === true) {
        console.log('+')
        game.isGame = false
        removeObject(leftEnemyTank);
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, 1920, 1080);
    draw(ground)
    draw(rightEnemyTank)
    draw(leftEnemyTank)
    draw(frieldlyTank)
    draw(projectile)
    isTankIsAbordBorder()
}

function isTankIsAbordBorder(){
    if(leftEnemyTank.x < 20){
        game.isGame = false
    }
}

function play(){
    if(game.isGame === true){
        drawFrame()
        update()
    } else {
        location.reload();
    }
    requestAnimationFrame(play)
}

//

//тело
initEventsListeners()
play()

//

