// Create variable to hold the state of the game
let mistakes = 0;
let currentQuestion = 0;
let timeLeft = 60; // Timer starts at 60 seconds
let timerInterval; // Variable to store the timer
let score = 0; // NEW: Tracks correct answers
const MAX_LIVES = 5; // Maximum lives allowed
let lives = MAX_LIVES; // Initialize lives


function updateScore() {
    let scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = score;
    } else {
        console.error("❌ ERROR: #score not found in the HTML!");
    }
}

// Generate all answers from the 15x15 times table, including repeated values
let answers = [];
for (let i = 1; i <= 15; i++) {
    for (let j = 1; j <= 15; j++) {
        answers.push(i * j);
    }
}

// Randomize the order of the answers array
answers = answers.sort(() => Math.random() - 0.5);

function showMistakes() {
    let mistakesElement = document.getElementById("mistakes");
    if (mistakesElement) {
        mistakesElement.textContent = mistakes;
    }
}

function showQuestion() {
    let numElement = document.getElementById("num");

    if (numElement) {
        console.log(`✅ Updating Question: ${answers[currentQuestion]}`); // Debugging Log
        numElement.textContent = answers[currentQuestion]; // ✅ Update Question Box
        startTimer(); // ✅ Restart timer when a new question appears
    } else {
        console.error("❌ ERROR: #num not found in the HTML! Check if it's missing.");
    }
}
function showLives() {
    let livesElement = document.getElementById("lives");
    if (livesElement) {
        livesElement.textContent = lives; // ✅ Update display only once
    }
}

function checkAnswer(i) {
    let I = i - 1;
    let row = (I % 15) + 1;
    let col = Math.floor(I / 15) + 1;
    let question = answers[currentQuestion];

    let button = document.getElementById(i);
    let correctValue = row * col;

    if (row * col === question) {
        if (button) {
            button.classList.add("flipped", "correct");
            button.textContent = question;
            button.disabled = true;
        }
        score++;
        updateScore();
        currentQuestion++;
        showQuestion();
    } else {
        if (lives > 0) {
            lives--;
            showLives();
        }

        if (button) {
            button.classList.add("flipped", "incorrect");
            button.textContent = correctValue;

            setTimeout(() => {
                button.classList.remove("flipped", "incorrect");
                button.textContent = "?";
            }, 1000);
        }

        if (lives === 0) {
            gameOver("lives"); // ✅ Trigger lives-based game over
        }
    }
}

function startTimer() {
    let timeElement = document.getElementById("time-left");

    clearInterval(timerInterval); // ✅ Stop any previous timer
    timeLeft = 60;  // ✅ Reset timer to 60 seconds
    timeElement.textContent = timeLeft;

    timerInterval = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--; // ✅ Decrease time
            timeElement.textContent = timeLeft; // ✅ Update UI
        } else {
            clearInterval(timerInterval); // ✅ Stop the timer
            gameOver("time"); // ✅ Trigger game over due to timeout
        }
    }, 1000); // ✅ Run every second
}

function addEventListeners() {
    let buttons = document.querySelectorAll(".main button");
    buttons.forEach(button => {
        let id = parseInt(button.id);
        button.addEventListener("click", function () {
            checkAnswer(id);
    });
}); // ✅ Correctly closes forEach() function
}

document.addEventListener("DOMContentLoaded", function () {
    addEventListeners();
    showQuestion();
});
  
const MAX_MISTAKES = 5;

function showMistakes() {
    let mistakeElement = document.getElementById("mistakes");
    if (mistakeElement) {
        mistakeElement.textContent = mistakes;
    }
    if (mistakes >= MAX_MISTAKES) {
        console.log("💀 Game Over! Too many mistakes.");
        document.querySelector(".question-box").textContent = "Game Over!";
        disableGrid();
    }
}
 function gameOver() {
    console.log("💀 Game Over Triggered!");
    clearInterval(timerInterval); // ✅ Stop the timer

    let messageBox = document.createElement("div");
    messageBox.classList.add("game-over-message");

    if (lives === 0) {
        messageBox.textContent = `You are out of lives! Game Over! Your final score is ${score}. Press the Restart Game button to try again`;
        messageBox.style.backgroundColor = "purple"; // ✅ Purple for lives
    } else if (timeLeft <= 0) {
        messageBox.textContent = `Time's Up! Game Over! Your final score is ${score}. Press the Restart Game button to try again`;
        messageBox.style.backgroundColor = "pink"; // ✅ Pink for time-out
    }

    document.body.appendChild(messageBox);
}

function disableGrid() {
    document.querySelectorAll(".main button").forEach(button => {
        button.disabled = true;
    });
}

// Update restartGame to reset lives
function restartGame() {
    console.log("🔄 Restarting game...");

    // 🛑 Remove the Game Over message if it exists
    let messageElement = document.querySelector(".question-box");
    if (messageElement) {
        messageElement.innerHTML = "Find where number <span id='num'>?</span> belongs."; // ✅ Reset default text
    }

    // 🛑 Remove the floating Game Over message
    let gameOverMessage = document.querySelector(".game-over-message");
    if (gameOverMessage) {
        gameOverMessage.remove(); // ✅ Removes floating message from the screen
    }

    clearInterval(timerInterval); // Stop the timer before restarting
    lives = 5;
    score = 0;
    currentQuestion = 0;
    timeLeft = 60; // ✅ Reset Timer
    answers = answers.sort(() => Math.random() - 0.5);

    document.getElementById("lives").textContent = lives;
    document.getElementById("score").textContent = score;
    document.getElementById("time-left").textContent = timeLeft; // ✅ Reset timer display

    let numElement = document.getElementById("num");
    if (numElement) {  
        numElement.textContent = answers[currentQuestion]; // ✅ Show new question
    }

    let grid = document.querySelector(".main");
    grid.innerHTML = ""; // ✅ Clear grid before rebuilding

    for (let i = 1; i <= 225; i++) {
        let button = document.createElement("button");
        button.id = i;
        button.className = "square";
        button.setAttribute("aria-label", `Select grid position ${i}`);
        button.textContent = "?";
        grid.appendChild(button);
    }

    addEventListeners();
    showQuestion(); // ✅ Ensures a new question appears
    console.log("✅ Game restarted successfully.");
}

function gameOver(type) {
    console.log("💀 Game Over!");

    disableGrid();
    clearInterval(timerInterval);

    let message = document.createElement("div");
    message.classList.add("game-over-message");

    if (type === "time") {
        message.textContent = `Time's Up! Game Over! Your final score is ${score}`;
        message.classList.add("pink");
    } else if (type === "lives") {
        message.textContent = `You are out of lives! Game Over! Your final score is ${score}`;
        message.classList.add("purple");
    }

    document.body.appendChild(message);
}
  
document.addEventListener("DOMContentLoaded", function () {
    let numElement = document.getElementById("num");

    if (!numElement) {
        console.error("❌ ERROR: #num not found in the HTML! Check if it's missing.");
    } else {
        console.log("✅ #num found! Ready to update.");
    }
});  

document.addEventListener("DOMContentLoaded", function () {
    let restartButton = document.getElementById("restart");
    if (restartButton) {
        console.log("✅ Restart button found! Adding event listener...");
        restartButton.addEventListener("click", function () {
            console.log("🔄 Restart button clicked! Restarting game...");
            restartGame();
        });
    } else {
        console.error("❌ Restart button NOT found!");
    }
});