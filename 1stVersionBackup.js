function isCollision(dinoRect, cactusRect) {  
    // AABB - Axis-aligned bounding box  
    return (
            dinoRect.x < cactusRect.x + cactusRect.width &&
            dinoRect.x + dinoRect.width > cactusRect.x &&
            dinoRect.y < cactusRect.y + cactusRect.height &&
             dinoRect.y + dinoRect.height > cactusRect.y
     );
}

let gameElem = document.querySelector("#game")
let rootElem = document.querySelector(":root")
let dinoElem = document.querySelector(".dino")
let scoreElem = document.querySelector('.score')
let groundElem = document.querySelector('.ground')
let cactusElem = groundElem.querySelector('.cactus')

let  gameSpeed = 5000 /* In ms*/
let jumpSpeed = 600 /* In ms*/
let maxJump = 250 /* In percentage*/
let speedScale = 50; 

let gameStarted = false, gameOver = false
let score = 0;

function setCustomProperty(elem, prop,value){
        elem.style.setProperty (prop, value)
}

let gameID
function startGame(){
        gameStarted = true
        gameElem.classList.add("game-started")
        document.addEventListener("keydown",handleJump)
        // increase the score every 1s
        // we're also storing the interval function into a variable so that we can turn it off later
        gameID = setInterval(()=>{
                updateGame()
        },100)
}

function endGame(){
        let audioDie = document.querySelector('.audio-die')
        audioDie.play()
        gameOver = true
        gameElem.classList.add("game-over")
        document.removeEventListener("keydown",handleJump)
        clearInterval(gameID)
}

function handleJump(e){
        if(e.code!== "Space") return
        let audioJump = document.querySelector('.audio-jump')
        audioJump.play()
        dinoElem.classList.add("jump")
        dinoElem.addEventListener("animationend",()=>{
                dinoElem.classList.remove('jump')
        })
}

// // As long as the game is running, this function is called
function updateGame(){
        setCustomProperty(rootElem, "--game-speed",gameSpeed)
        setCustomProperty(rootElem, "--jump-speed", jumpSpeed)
        setCustomProperty(rootElem, "--max-jump",maxJump)
        setCustomProperty(rootElem, "--speed-scale", speedScale)
        console.log("yoo")
        // Update the score
        updateScore()
        // Update the cactus
        updateCactus()
        // Check if game over
        if(checkGameOver()){
                endGame()
                return  //Wont' recurse
        }
}

function checkGameOver(){
        if (gameOver) return true
        let dinoRect = dinoElem.getBoundingClientRect()
        let cactusRect = cactusElem.getBoundingClientRect()
        if(isCollision(dinoRect,cactusRect)){
                return true 
        }
        return false
}

function updateScore(){
        score += 1
        if(score%100 === 0){
                let audioPoint = document.querySelector('.audio-point')
                audioPoint.play()
                gameSpeed -= speedScale
        }

        let currentScoreElem  = scoreElem.querySelector(".current-score")
        currentScoreElem.innerText = score.toString().padStart(5,"0")
}

function updateCactus(){
        // If the cactus is off the screen, randomization occurs. 
        // When cactus is on the screen, randomization stops
        let cactusXPos = cactusElem.getBoundingClientRect().x
        let isOffScreen = cactusXPos > window.innerWidth
        if (isOffScreen === false) return
        
        let cacti = ["cactus-small-1","cactus-small-2","cactus-small-3"]
        let result = Math.random() * cacti.length
        let randomNum = Math.floor(result)
        console.log("result",result,"randomNum",randomNum)
        let cactus = cacti[randomNum]
        cactusElem.classList.remove("cactus-small-1","cactus-small-2","cactus-small-3")
        cactusElem.classList.add(cactus)
}

function fitScreen(){
        let width = window.innerWidth
        let height = window.innerHeight/2
        gameElem.style.width = width + "px"
        gameElem.style.height = height + "px"
}

// window.addEventListener("load",fitScreen)
// window.addEventListener("resize",fitScreen)
// document.addEventListener('keydown',startGame, {once:true}) //we want to listen to t

window.addEventListener("load",function(){
        fitScreen()
        window.addEventListener("resize",fitScreen)
        document.addEventListener('keydown',startGame, {once:true})
})
 //we want to listen to t