let main = document.querySelector('.main');
const scoreElem = document.getElementById('score');
const levelElem = document.getElementById('level');
const nextFigureElem = document.getElementById('next-figure');
const startBTN = document.getElementById('start');
const pauseBTN = document.getElementById('pause');
const gameOver = document.getElementById('game-over');
const scoreOver = document.getElementById('score-over');
const levelOver = document.getElementById('level-over');
pauseBTN.style.display = 'none';
document.querySelector('body').style.transform = 'scale(0.8)';// масштаб страницы

// ячейки состояний
let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let gameTimerId = '';
let score = 0;
let currentLevel = 1;
let countCLick = 0;
let isPause = true;

let possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 10
    },
    2: {
        scorePerLine: 20,
        speed: 350,
        nextLevelScore: 50
    },
    3: {
        scorePerLine: 50,
        speed: 300,
        nextLevelScore: 500
    },
    4: {
        scorePerLine: 100,
        speed: 200,
        nextLevelScore: Infinity
    },
};
let figures = {
    o: [
        [1, 1],
        [1, 1],
    ],
    i: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    s: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    l: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    j: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    t: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
};

let activeFigure = getNewFigure();
let nextFigure = getNewFigure();

function getNewFigure() {
    const possibleFigures = 'ioljtsz';
    const rand = Math.floor(Math.random() * 7);
    const newFigure = figures[possibleFigures[rand]];
    return{
        x: Math.floor((10 - newFigure[0].length) / 2),
        y:0,
        shape: newFigure
    }
    //return figures[possibleFigures[rand]];
};

function draw() {
    let mainInnerHTML = '';
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                mainInnerHTML += '<div class="cell movingCell"></div>';
            }
            else if (playfield[y][x] === 2) {
                mainInnerHTML += '<div class="cell fixedCell"></div>';
            }
            else { mainInnerHTML += '<div class="cell"></div>'; }
        }
    }
    main.innerHTML = mainInnerHTML;
};

function drawNextFigure(){
    let nextFigureInnerHTML = '';
    for(let y = 0; y< nextFigure.shape.length; y++){
        for(let x = 0; x<nextFigure.shape[y].length; x++){
            if(nextFigure.shape[y][x] === 1){
                nextFigureInnerHTML += '<div class="cell movingCell"></div>';
            }
            else{
                nextFigureInnerHTML += '<div class="cell"></div>';
            }
        }      
        nextFigureInnerHTML += '<br/>';
    }
    nextFigureElem.innerHTML = nextFigureInnerHTML;
}

function removePrevActiveFigure() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
};

function addActiveFigure() {
    removePrevActiveFigure();
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (activeFigure.shape[y][x] === 1) {
                playfield[activeFigure.y + y][activeFigure.x + x] = activeFigure.shape[y][x];
            }
        }
    }
};

function rotateFigure() {
    const prevFigureState = activeFigure.shape;
    activeFigure.shape = activeFigure.shape[0].map((val, index) =>
        activeFigure.shape.map((row) => row[index]).reverse()
    )
    if (hasCollisions()) {
        activeFigure.shape = prevFigureState;// создаем новый массив на пред.состоянии
    }
};

function hasCollisions() {
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (
                activeFigure.shape[y][x] &&
                (playfield[activeFigure.y + y] === undefined ||
                    playfield[activeFigure.y + y][activeFigure.x + x] === undefined ||
                    playfield[activeFigure.y + y][activeFigure.x + x] === 2)
            ) {
                return true;
            }
        }
    }
    return false;
};

function fixedFigure() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;                
            }
        }
    }
    removeFullLines();
};
function moveFigureDown() {
    if(!isPause){
        activeFigure.y += 1;
        if (hasCollisions()) {
            activeFigure.y -= 1;
            fixedFigure();
            activeFigure = nextFigure;
            if(hasCollisions()){                
                reset();
            }
            nextFigure = getNewFigure();
        }
    }  
};
function reset(){            
    document.getElementById('context-menu-title').innerText = 'Game Over';
    startBTN.style.display = 'inline-block';        
    startBTN.classList.add('overEffect');   
    pauseBTN.style.display = 'none';
    setTimeout(()=>{
        startBTN.classList.remove('overEffect');                
    },1250)
    isPause = true;
    clearTimeout(gameTimerId);
    for(let y = 0; y < playfield.length; y++){
        for(let x = 0; x <playfield[y].length; x++){
            playfield[y][x] = 0;
        }
    }
    draw();        
    gameOver.style.display = 'block';
    gameOver.classList.add('slideDown');
    scoreOver.innerHTML = score;
    levelOver.innerHTML = currentLevel;
}
// ------------------------------------checkLines-------------------------------------
function removeFullLines() {    
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;                                
                break;
            }
        }        
        if (canRemoveLine) {                        
            filledLines += 1;                                       
            setTimeout(()=>{            
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);            
            },150);
            
        }
        canRemoveLine = true;
    }
    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        default:
            break;
    }
    scoreElem.innerHTML = score;
    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
};

function dropFigure(){
    for(let i = activeFigure.y; i<playfield.length;i++){
        activeFigure.y += 1;
        if(hasCollisions()){
            activeFigure.y -= 1;
        }
    }
}

function updateGameState(){
    if(!isPause){
    addActiveFigure();        
    drawNextFigure();
    draw();
    }
}
// ------------------------------------keyDown--------------------------------------
document.onkeydown = function (e) {
    if(!isPause){
        if (e.keyCode === 37) {
            // move to left        
            activeFigure.x -= 1;
            if (hasCollisions()) {
                activeFigure.x += 1;
            }
        }
        else if (e.keyCode === 39) {
            // move to right        
            activeFigure.x += 1;
            if (hasCollisions()) {
                activeFigure.x -= 1;
            }    
        }
        else if (e.keyCode === 38) {
            rotateFigure();
        }
        else if (e.keyCode === 40) {
            // faster moving to down   
            moveFigureDown();
        }
        else if(e.keyCode === 32){
            dropFigure();
        }
        updateGameState();
    }    
}
pauseBTN.addEventListener('click',(e)=>{    
    scoreOver.innerHTML = score;
    levelOver.innerHTML = currentLevel;
    if(e.target.innerHTML === 'Pause'){
        e.target.innerHTML = 'Play';
        clearTimeout(gameTimerId);
        gameOver.style.display = 'block';
        gameOver.classList.add('scaleDownPause');
        document.getElementById('context-menu-title').innerText = 'Paused';
    }
    else{
        e.target.innerHTML = 'Pause';
        gameOver.classList.remove('scaleDownPause');
        gameOver.classList.add('scaleUpPause');
        setTimeout(()=>{
            gameOver.style.display = 'none';
            gameOver.classList.remove('scaleUpPause');
        },250)
        gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }    
    isPause = !isPause;    
})

startBTN.addEventListener('click',(e)=>{        
    countCLick++;         
    startBTN.classList.add('startEffect');
    setTimeout(()=>{
        startBTN.style.display = 'none';
        startBTN.classList.remove('startEffect');        
        pauseBTN.style.display = 'inline-block';
    },1000);

    e.target.innerHTML = 'Start again';
    gameOver.classList.remove('slideDown');    
    isPause = false;
    gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed);      
    score = 0;
    currentLevel = 1;    
    scoreElem.innerHTML = score;
    levelElem.innerHTML = currentLevel;   
    
    if(countCLick >= 2){
    gameOver.classList.add('slideUp');
    setTimeout(()=>{
        gameOver.classList.remove('slideUp');
        gameOver.style.display = 'none';
    },400)
    }
})
// ------------------------------------startGame--------------------------------------

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

draw();

function startGame() {
    moveFigureDown();
    if(!isPause) {        
        updateGameState();
        gameTimerId = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }    
};