// homePage Activity DOM selections
const playerName = document.querySelector("#playerName");
const startBtn = document.querySelector("#startBtn");
const dialogBox = document.querySelector("#dialogBox");
const warnP = document.querySelector("#homePage p");
const homePage = document.querySelector("#homePage");
const firstQuestion = document.querySelector("#firstQuestion");

// function for Start Game Button
// hides button and input and displays Game Rules dialog-box
function rules(){
    if(playerName.value){
        playerName.classList.toggle("dNone");
        startBtn.classList.toggle("dNone");
        dialogBox.classList.toggle("dNone");
        if(!warnP.classList.contains("dNone")){
            warnP.classList.toggle("dNone");
        }
    }
    else{
        warnP.classList.toggle("dNone");
    }
}
startBtn.addEventListener("click",rules);

// gamePage Activity DOM selections
const gamePage = document.querySelector("#gamePage");
const totalScore = document.querySelector("#totalScore span");
const timeLeft = document.querySelector("#timeLeft span");
const questionSpace = document.querySelector("#question");
const options = document.querySelectorAll(".options");
const gameControl = document.querySelector("#gameControl");
const optionsInput = document.querySelectorAll("input[type='radio']");
const quizContainer = document.querySelector("#quizContainer");

// fetching and storing questions data from json file
let QuestionArray;
fetch("questionsData.json")
    .then(response => response.json())
    .then(json => {
        QuestionArray = json;
    });

// Necessary game control variables
// (Score, Total Time)
let score = 0;
let t = 100;
// (random number stores in array for question selection)
let randomArray = [];
let randomNo;
// (total Change, Correct and Incorrect Answers)
let tChange = 0;
let tCorrect = 0;
let tIncorrect = 0;
// check variable controls #gameControl Button
// check = true => submits the answers || check = false => go to the next question
let check = true;
// question count
let questionNo = 1;
// stores the selected option
let selected;

const timeupCont = document.querySelector("#timeupCont");

// this function blurs gamePage and displays backgr div (to disable backgr click)
const backgrDisable = function() {
    backgr.classList.toggle("dNone");
    gamePage.classList.toggle("blurred");
}

// This function handles the timer
const timer = function() {
    t--;
    timeLeft.textContent = t;
    if(t == 0) {
        clearInterval(timeHandler);
        timeupCont.classList.toggle("dNone");
        backgrDisable();
        
    }
}
let timeHandler;

// This function generates a random number for a random question and
// Sets the selected question and options to the "quizContainer"
const newQuestion = function() {
    let randomDone = false;
    do {
        randomNo = (Math.floor(Math.random() * 100));
        // this condition is set because current questions data file consists of 77 questions
        // i.e. QuestionArray.length = 77
        if(randomNo<77) {
            if(!randomArray.includes(randomNo)) {
                randomArray.push(randomNo);
                randomDone = true;
            } else {
                randomDone = false;
            }
        } else {
            randomDone = false;
        }
    } while (randomDone == false);
    console.log(randomArray);
    questionSpace.textContent = QuestionArray[randomNo]["question"];
    for(let i=0; i<4; i++) {
        options[i].textContent = QuestionArray[randomNo]["answers"][i+1];
    }
}

// Function for "firstQuestion" Button (Starts the Game)
const startGame = function() {
    t = 100;
    timeHandler = setInterval(timer,1000);
    homePage.classList.toggle("dNone");
    gamePage.classList.toggle("dNone");
    totalScore.textContent = score;
    newQuestion();
}
firstQuestion.addEventListener("click",startGame);

// resultsPage Activity DOM selections
const resultsPage = document.querySelector("#resultsPage");
const playerDisplay = document.querySelector("#playerDisplay span");
const scoreDisplayElements = document.querySelectorAll("#scoreDisplay span");
const scoreDisplay = scoreDisplayElements[0];
const cAttempt = scoreDisplayElements[1];
const icAttempt = scoreDisplayElements[2];
const uAttempt = scoreDisplayElements[3];
const qChanged = scoreDisplayElements[4];
const playAgainBtn = document.querySelector("#playAgain");
const greetMsg = document.querySelector("#greetDisplay h1");

// This function redirects from gamePage to resultsPage Activity
// Sets all elements textContent (score, correct, incorrect attempts, etc.)
const gotoResult = function() {
    resultsPage.classList.toggle("dNone");
    gamePage.classList.toggle("dNone");
    playerDisplay.textContent = playerName.value;
    scoreDisplay.textContent = score;
    cAttempt.textContent = tCorrect;
    icAttempt.textContent = tIncorrect;
    uAttempt.textContent = 8 - (tCorrect + tIncorrect);
    qChanged.textContent = tChange;
    if(score>680) {
        greetMsg.innerHTML = "<span>EXTRAORDINARY</span><br>Only a few genius minds can solve the questions like you did...";
    } else if(score>560) {
        greetMsg.innerHTML = "<span>VERY GOOD</span><br>Those with sharp minds charming persona... You are among those wise people...";
    } else {
        greetMsg.innerHTML = "<span>GOOD</span><br>That was good performance and seems like you have potential for more...";
    }
    clearInterval(timeHandler);
}

// This function is used with #gameControl Button
const gameHandler = function() {
    // checks whether all questions are done i.e. total 9 questions
    if(questionNo<9) {
        // check = true => submits the answers || check = false => go to the next question
        if(check){
            for(let answer of optionsInput) {
                if(answer.checked) {
                    selected = answer.value;
                    answer.checked = false;
                    break;
                } else {
                    selected = false;
                }
            }
            if(selected == false) {
                for(let option of options) {
                    option.classList.toggle("selectFirst");
                }
                setTimeout(function() {
                    for(let option of options) {
                        option.classList.toggle("selectFirst");
                    }
                },2100);
                return;
            };
            if(selected == QuestionArray[randomNo]["correct"]){
                score += 100;
                tCorrect++;
                totalScore.textContent = score;
                clearInterval(timeHandler);
                options[selected-1].classList.toggle("correctAns");
            } else {
                score -= 10;
                tIncorrect++;
                totalScore.textContent = score;
                clearInterval(timeHandler);
                options[selected-1].classList.toggle("incorrectAns");
                options[QuestionArray[randomNo]["correct"] -1].classList.toggle("correctAns");
            }
            gameControl.textContent = "Next";
            check = false;
            if(questionNo == 8) {
                questionNo++;
                gameControl.textContent = "Results";
            }
        } else {
            // removes any design classes and sets next question
            newQuestion();
            t = 100;
            timeHandler = setInterval(timer,1000);
            for(let option of options) {
                option.classList.remove("correctAns");
                option.classList.remove("incorrectAns");
            }
            // options[selected-1].classList.remove("correctAns");
            // options[selected-1].classList.remove("incorrectAns");
            // options[QuestionArray[randomNo]["correct"] -1].classList.remove("correctAns");
            gameControl.textContent = "Submit";
            check = true;
            questionNo++;
        }
    } else if (questionNo == 9) {
        // results page activity will be displayed if all questions are done i.e. 9 questions
        gotoResult();
    }
}
gameControl.addEventListener("click",gameHandler);

const backgr = document.querySelector("#backgr");
// change question dialog box DOM selections
const chgQuestCont = document.querySelector("#chgQuestCont");
const changeBtn = document.querySelector("#changeBtn");
const rChg = document.querySelector("#chgQuestCont span");
const chgQuestBtn = document.querySelector("#changeQ");
const cancelChgBtn = document.querySelector("#cancelChg");

// This function changes the current question
// used with change question button (#changeQ)
const changeQuestion = function() {
    newQuestion();
    for(let answer of optionsInput) {
        if(answer.checked) {
            answer.checked = false;
            break;
        }
    }
    t = 100;
    timeHandler = setInterval(timer,1000);
    backgrDisable();
    chgQuestCont.classList.toggle("dNone");
    score -= 30;
    totalScore.textContent = score;
    tChange++;
}
chgQuestBtn.addEventListener("click",changeQuestion);

// if the limit (2 tiems) is not reached change question dialog box will display
// else change question button will be disabled
const changeDial = function() {
    console.log("clicked me");
    if(tChange<2){
        backgrDisable();
        chgQuestCont.classList.toggle("dNone");
        rChg.textContent = tChange;
        clearInterval(timeHandler);
    }
    if(tChange == 2) {
        changeBtn.disabled = true;
    }
}
changeBtn.addEventListener("click",changeDial);

// cancel button function for change question dialog-box
const chgCancel = function() {
    backgrDisable();
    chgQuestCont.classList.toggle("dNone");
    timeHandler = setInterval(timer,1000);
}
cancelChgBtn.addEventListener("click",chgCancel);

// exit dialog-box DOM selections
const exitCont = document.querySelector("#exitCont");
const exitBtn = document.querySelector("#exitBtn");
const cancelExitBtn = document.querySelector("#cancelExit");
const exitGameBtn = document.querySelector("#exitG");

// displays exit dialog-box
const exitDial = function() {
    backgrDisable();
    exitCont.classList.toggle("dNone");
    clearInterval(timeHandler)
}
exitBtn.addEventListener("click",exitDial);

// cancel button function for exit dialog-box
const cancelExit = function() {
    backgrDisable();
    exitCont.classList.toggle("dNone");
    timeHandler = setInterval(timer,1000);
}
cancelExitBtn.addEventListener("click",cancelExit);

// function exits the game and redirects to results page activity
const exitGame = function() {
    gotoResult();
    backgrDisable();
    for(let answer of optionsInput) {
        if(answer.checked) {
            answer.checked = false;
            break;
        }
    }
    exitCont.classList.toggle("dNone");
}
exitGameBtn.addEventListener("click",exitGame);

// Function resets game control variables and redirects to homePage activity
const playAgain = function() {
    resultsPage.classList.toggle("dNone");
    homePage.classList.toggle("dNone");
    score = 0;
    t = 100;
    randomArray = [];
    randomNo;
    tChange = 0;
    tCorrect = 0;
    tIncorrect = 0;
    check = true;
    questionNo = 1;
    changeBtn.disabled = false;
    gameControl.textContent = "Submit";
    for(let option of options) {
        option.classList.remove("correctAns");
        option.classList.remove("incorrectAns");
    }
    playerName.classList.toggle("dNone");
    startBtn.classList.toggle("dNone");
    dialogBox.classList.toggle("dNone");
}
playAgainBtn.addEventListener("click",playAgain);

const timeupBtn = document.querySelector("#timeupNextBtn");

// if timer runs out this function will be called
// displays a time-out dialog-box
// sets the next question or if the game is done then redirects to results page
const timeupNextQues = function() {
    if(questionNo != 8) {
        newQuestion();
        for(let answer of optionsInput) {
            if(answer.checked) {
                answer.checked = false;
                break;
            }
        }
        t = 100;
        timeHandler = setInterval(timer,1000);
        for(let option of options) {
            option.classList.remove("correctAns");
            option.classList.remove("incorrectAns");
        }
        gameControl.textContent = "Submit";
        check = true;
        questionNo++;
        timeupCont.classList.toggle("dNone");
        backgrDisable();
    } else if(questionNo == 8) {
        gotoResult();
        timeupCont.classList.toggle("dNone");
        backgrDisable();
    }
}
timeupBtn.addEventListener("click",timeupNextQues);