const playBoard = document.querySelector(".playing-board");
const scoreEl = document.querySelector("#score");
const highscoreEl = document.querySelector("#high-score");
const controls= document.querySelectorAll(".buttons svg");

let score_count= 0;

//getting highscore from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highscoreEl.innerHTML= "High-Score: "+highScore;


let gameOver = false;
let foodX ,foodY;
let snakeX=5, snakeY=9;
let snakeBody= [];
let velocityX= 0, velocityY = 0;
let setIntervalId;

const changeFoodPosition= () =>{
    //random position of the food along the x and y axis between 0-30 of the 30 grid pockets or spaces
    foodX= Math.floor(Math.random() * 30)+1
    foodY= Math.floor(Math.random() * 30)+1
}

const handleGameOver =() =>{
    clearInterval(setIntervalId);
    alert("Game over! Press any key to continue...");
    location.reload();
}

const changeDirection= (e) =>{
    //changing the velocity based on the key pressed
    //console.log(e);
    if(e.key==="ArrowUp" && velocityY != 1){
        velocityX= 0;
        velocityY= -1;
    }else if(e.key==="ArrowDown"  && velocityY != -1){
        velocityX= 0;
        velocityY= 1;
    }else if(e.key==="ArrowLeft"  && velocityX != 1){
        velocityX= -1;
        velocityY= 0;
    }else if(e.key==="ArrowRight"  && velocityX != -1){
        velocityX= 1;
        velocityY= 0;
    }
    
}

controls.forEach(key => {
    //calling changeDirection for each of the key pressed and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame =() =>{
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

    //checking to see if snake eats the food
    if(snakeX===foodX && snakeY===foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY]); //pushing food position to snake body array
        score_count++;

        highScore= score_count >= highScore ? score_count : highScore;
        localStorage.setItem("high-score", highScore);
        scoreEl.innerHTML= "Score: "+score_count;
        highscoreEl.innerHTML= "High-Score: "+highScore;
        // console.log(snakeBody);
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        //shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i-1];
        
    }

    snakeBody[0] = [snakeX, snakeY]; //setting first element of snake body to current snake position


    //changing the position of the snake's head based on the key pressed
    snakeX+= velocityX;
    snakeY+= velocityY;

    //show game over when the snake goes out of the board
    if(snakeX <=0 || snakeX > 30 || snakeY <=0 || snakeY > 30){
        gameOver= true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        //checking to see if the snake hits its body, the game over is true
        if(i !==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver=true;
        }
        
    }


    
    playBoard.innerHTML = htmlMarkup;
}

// if(snakeX>30 && snakeY>30){
//     console.log("ouch");
// }

changeFoodPosition();
setIntervalId= setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);