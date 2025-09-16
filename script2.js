var board = document.getElementById("gameBoard");
var retryBtn = document.getElementById("retryBtn");
var statusText = document.getElementById("statusText");
var singlePlayerBtn = document.getElementById("singlePlayerBtn");
var twoPlayerBtn = document.getElementById("twoPlayerBtn");
var modeSelectiondiv = document.getElementById("mode-selection");
var levelSelectiondiv = document.getElementById("level-selection");
var returnDiv = document.getElementById('returnDiv');
var returnBtn = document.getElementById('returnBtn');
var level1 = document.getElementById('level-1');
var level2 = document.getElementById('level-2');
var level3 = document.getElementById('level-3');

const ROWS = 6;
const COLS = 7;
let currentPlayer = "red"; // 'red' or 'yellow'
let gameBoard = []; // 2D array representing the board state
let winCells = [];
let gameover = true;
let singlePlayerStart = false;
returnDiv.style.display = 'none';

function returnButton () {
  window.location.href = "connect-four.html";
}

// Function to toggle the visibility of an element
function toggleVisibilityFlex(element) {
  if (element.style.display === 'none') {
      element.style.display = 'flex';
  } else {
      element.style.display = 'none';
  }
}

// Function to initialize the board
function createBoard() {
  gameBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  board.innerHTML = ""; // Clear any previous board

  // Generate cells dynamically
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleMove);
      board.appendChild(cell);
    }
  }

  currentPlayer = "red";
}

// Function to handle a move
function handleMove(event) {
  if (gameover) return;

  const col = parseInt(event.target.dataset.col, 10); // parseInt important

  // Find the lowest empty row in this column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!gameBoard[row][col]) {
      gameBoard[row][col] = currentPlayer; // Update board state
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cell.classList.add(currentPlayer); // Add color to the cell
      if (checkWin()) {
        gameover = true; // Prevent further moves
        highlightWinCells();
        statusText.textContent = `${currentPlayer === "red" ? "Red" : "Yellow"} wins!`;
        retryBtn.classList.remove("hidden");
        return;
      }
      if (gameover) return;
      togglePlayer(); // Switch turn
      return;
    }
  }

  // If column is full, display a message
  statusText.textContent = "Column is full! Choose another.";
}

// Function to toggle between players
function togglePlayer() {
  currentPlayer = currentPlayer === "red" ? "yellow" : "red";
  statusText.textContent = `${currentPlayer === "red" ? "Red" : "Yellow"}'s turn!`;
}

// Function to highlight winning cells
function highlightWinCells() {
  if (!Array.isArray(winCells) || winCells.length === 0) return;
  winCells.forEach(([r, c]) => {
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (cell) {
      cell.classList.add('win');
    }
  });
}

function checkWin() {
    // winCells will hold the 4 winning coordinates as arrays [row, col]
    winCells = [];

    // Row win check
    for (let row = 0; row < ROWS; row++) {
        let count = 0;
        let tempCells = [];
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[row][col] === currentPlayer) {
                count++;
                tempCells.push([row, col]);
                if (count >= 4) {
                    // keep only the last 4 in case there are >4 in a row
                    winCells = tempCells.slice(tempCells.length - 4);
                    return true;
                }
            } else {
                count = 0;
                tempCells = [];
            }
        }
    }

    // Column win check
    for (let col = 0; col < COLS; col++) {
        let count = 0;
        let tempCells = [];
        for (let row = 0; row < ROWS; row++) {
            if (gameBoard[row][col] === currentPlayer) {
                count++;
                tempCells.push([row, col]);
                if (count >= 4) {
                    winCells = tempCells.slice(tempCells.length - 4);
                    return true;
                }
            } else {
                count = 0;
                tempCells = [];
            }
        }
    }

    // Left Diagonal (\) win check
    // iterate over all possible starts and walk down-right
    for (let startRow = 0; startRow < ROWS; startRow++) {
        for (let startCol = 0; startCol < COLS; startCol++) {
            let r = startRow;
            let c = startCol;
            let count = 0;
            let tempCells = [];
            while (r < ROWS && c < COLS) {
                if (gameBoard[r][c] === currentPlayer) {
                    count++;
                    tempCells.push([r, c]);
                    if (count >= 4) {
                        winCells = tempCells.slice(tempCells.length - 4);
                        return true;
                    }
                } else {
                    count = 0;
                    tempCells = [];
                }
                r++;
                c++;
            }
        }
    }

    // Right Diagonal (/) win check
    // iterate and walk down-left
    for (let startRow = 0; startRow < ROWS; startRow++) {
        for (let startCol = 0; startCol < COLS; startCol++) {
            let r = startRow;
            let c = startCol;
            let count = 0;
            let tempCells = [];
            while (r < ROWS && c >= 0) {
                if (gameBoard[r][c] === currentPlayer) {
                    count++;
                    tempCells.push([r, c]);
                    if (count >= 4) {
                        winCells = tempCells.slice(tempCells.length - 4);
                        return true;
                    }
                } else {
                    count = 0;
                    tempCells = [];
                }
                r++;
                c--;
            }
        }
    }

    // Check for a tie (all filled, no winner)
    if (gameBoard.flat().every((cell) => cell !== null)) {
        gameover = true;
        statusText.textContent = "It's a tie!";
        retryBtn.classList.remove("hidden");
        return false;
    }

    return false;
}

// Retry button logic
retryBtn.addEventListener("click", () => {
  retryBtn.classList.add("hidden");
  gameover = false;
  createBoard(); // Restart the game
  statusText.textContent = "Red starts!";
});

// Mode selection buttons
singlePlayerBtn.addEventListener("click", () => {
  createBoard(); // Restart the game
  statusText.textContent = "Choose the difficulity level!";
  levelSelectiondiv.style.display = 'block';
  modeSelectiondiv.style.display = 'none';
  returnDiv.style.display = 'Block';
});

twoPlayerBtn.addEventListener("click", () => {
  gameover = false;
  createBoard(); // Restart the game
  modeSelectiondiv.style.display = 'none';
  returnDiv.style.display = 'Block';
  statusText.textContent = "Red starts!";
});

function levelChoice (button) {
  toggleVisibilityBlock(levelSelectiondiv);
  statusText.textContent = "Choose a position!";
  //toggleVisibilityFlex(textbtn);
  //toggleVisibilityBlock(score);
  turnCount = 1;
  gameCount = 1;
  singlePlayerStart = true;
  if (button.textContent.trim() === "Regular") {
    statusText.textContent = "Regular mode: Choose a position!";
    currentGameMode = "Regular";
  } 
  else if (button.textContent.trim() === "Hard") {
    statusText.textContent = "Hard mode: Choose a position!";
    currentGameMode = "Hard";
  }
  else if (button.textContent.trim() === "Impossible") {
    statusText.textContent = "Impossible mode: Choose a position!";
    currentGameMode = "Impossible";
  }
}

// Function to toggle the visibility of an element
function toggleVisibilityBlock(element) {
  if (element.style.display === 'none') {
      element.style.display = 'block';
  } else {
      element.style.display = 'none';
  }
}

// Function to toggle the visibility of an element
function toggleVisibilityFlex(element) {
  if (element.style.display === 'none') {
      element.style.display = 'flex';
  } else {
      element.style.display = 'none';
  }
}

level1.addEventListener('click', function () { levelChoice(level1); });
level2.addEventListener('click', function () { levelChoice(level2); });
level3.addEventListener('click', function () { levelChoice(level3); });

returnBtn.addEventListener('click', function () { returnButton(); }); 

// Initialize the board on page load
createBoard();