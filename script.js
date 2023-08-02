let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');


//подгрузка хуйни

let background = new Image();
background.src = "./images/background.png";

background.onload = function() {
    canvas.width = game.width;
    canvas.height = game.height;
    canvasContext.drawImage(background, 0, 0);
}

let enemyTank1 = new Image();
enemyTank1.src = "images/enemyTank1.png";
enemyTank1.onload = function() {
    canvasContext.drawImage(enemyTank1, rightEnemyTank.x, rightEnemyTank.y);
}

let enemyTank2 = new Image();
enemyTank2.src = "images/enemyTank2.png";
enemyTank2.onload = function() {
    canvasContext.drawImage(enemyTank2, leftEnemyTank.x, leftEnemyTank.y);
}

let tank = new Image();
tank.src = "images/tank.png";
tank.onload = function() {
    canvasContext.drawImage(tank, 870, 850);
}

let lostScr = new Image()
lostScr.src = "images/lostScreen.png"

let pulaI = new Image()
pulaI.src = "images/pula.png"

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

let pula = {
    height: 57,
    width: 57,
    x: 896,
    y: 790,
    startx: 896,
    starty: 790,
    model: pulaI,
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

//функции работы поеботы хуёты игроты

function initEventsListeners() {
    window.addEventListener("click", clickmouse);
}

function clickmouse(event) {
    if (game.isGame === true) {
        draw(pula)
    }
}

function removeObject(obj) {
    obj.x = obj.startx;
    obj.isDead = false;
}

function niceShotInLeftTank(obj) {
    let shotLeft = pula.x < obj.x;
    let shotRight = pula.x + pula.width > obj.x + obj.width;
    let shotTop = pula.y + pula.height < obj.y;
    let shotBottom = pula.y < obj.y + obj.height;
    obj.isDead = (shotLeft && shotRight && shotTop && shotBottom);
}

function niceShotInRightTank(obj) {
    let shotLeft1 = pula.x < obj.x + obj.width;
    let shotLeft = pula.x > obj.x;
    let shotTop = pula.y < obj.y;
    if(shotLeft && shotLeft1 && shotTop){
        obj.isDead = true
    }
}

function niceShotInLeftTank(obj) {
    let shotLeft1 = pula.x < obj.x + obj.width;
    let shotLeft = pula.x > obj.x;
    let shotTop = pula.y < obj.y;
    if(shotLeft && shotLeft1 && shotTop){
        obj.isDead = true
    }
}

function clickmouse(event) {
    if (game.isGame === true) {
        pula.disX = event.clientX;
        pula.disY = event.clientY;
        if (pula.dx === 0 && pula.dy === 0) {
            pula.dx = Math.round(((pula.disX - pula.x) / (((Math.abs(pula.disX - pula.x) ** 2) + Math.abs(pula.disY - pula.y) ** 2) ** (1 / 2) / pula.height)));
            pula.dy = Math.abs(Math.round(((pula.disY - pula.y) / (((Math.abs(pula.disX - pula.x) ** 2) + Math.abs(pula.disY - pula.y) ** 2) ** (1 / 2) / pula.height ))));
        }
    }
}

function draw(obj) {
    canvasContext.drawImage(obj.model, obj.x, obj.y);
}

function drawFrame() {
    canvasContext.clearRect(0, 0, 1920, 1080);
    if (pula.coordX + pula.dx > game.width || pula.coordY + pula.dy > game.height || pula.coordX + pula.dx < 0) {
        pula.coordX = pula.startx;
        pula.coordY = pula.starty;
        pula.dx = 0;
        pula.dy = 0;
        draw(pula);
    }
    pula.x += pula.dx;
    pula.y -= pula.dy;
    leftEnemyTank.x -= leftEnemyTank.speed
    rightEnemyTank.x += rightEnemyTank.speed
    draw(ground)
    draw(rightEnemyTank)
    draw(leftEnemyTank)
    draw(frieldlyTank)
    draw(pula)
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

    requestAnimationFrame(play)
}


function play(){
    if(leftEnemyTank.x > 20 && game.isGame === true){
        drawFrame()
    } else {
        location.reload();
    }
}


//

//тело
initEventsListeners()
play()

//

