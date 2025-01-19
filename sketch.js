let backgroundCol = 128;
let grid = new Array(3);
let scale = 150, canvasSize = scale * 3;
let inGridOffset = scale / 4;
let playerTurn = 1;
let winLine = null;
let winner = false;
let resetButton;
let canvas;

let xWins = 0, oWins = 0, ties = 0;

function setup() {
  for (let i = 0; i < 3; ++i) {
    grid[i] = new Array(3);
  }
  canvas = createCanvas(canvasSize, canvasSize);

  resetButton = createButton('Reset Game');
  resetButton.position(canvas.x, 20);
  resetButton.mousePressed(resetGame);
}

function draw() { // visualize the game
  background(backgroundCol);
  // Draw grid  
  strokeWeight(5);
  stroke(0, 0, 0);
    line(canvasSize / 3, 0, canvasSize / 3, canvasSize);
    line(canvasSize * 2 / 3, 0, canvasSize * 2 / 3, canvasSize);
    line(0, canvasSize / 3, canvasSize, canvasSize / 3);
    line(0, canvasSize * 2 / 3, canvasSize, canvasSize * 2 / 3);

  // Draw X and O
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      fill(backgroundCol);
      strokeWeight(15);
      if (grid[i][j] == 1) {
        circle(+ scale / 2 + i * scale, scale / 2 + j * scale, scale / 2)
      } else if (grid[i][j] == 2) {
        line(i * scale + inGridOffset, j * scale + inGridOffset, (i + 1) * scale - inGridOffset, (j + 1) * scale - inGridOffset);
        line(i * scale + inGridOffset, (j + 1) * scale - inGridOffset, (i + 1) * scale - inGridOffset, j * scale + inGridOffset);
      }
    }
  }

  // Draw winning line if there is one
  if (winner) {
    strokeWeight(10);
    stroke(255, 0, 0);
    line(winLine.x1, winLine.y1, winLine.x2, winLine.y2);
  }
}

function resetGame() { // restart the game
  console.log("Reset Game");
  resetGrid();
  xWins = 0, oWins = 0, ties = 0;
  document.getElementById('ties').innerHTML = "Ties: " + ties;
  document.getElementById('xWins').innerHTML = "X Wins: " + xWins;
  document.getElementById('oWins').innerHTML = "O Wins: " + oWins;
  loop();
}

function resetGrid() { // clears the grid
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      grid[i][j] = 0;
    }
  }
  winner = false;
  winLine = null;
  playerTurn = 1;
}

// player functionality 
function mouseClicked() {
  if (mouseX >= 0 && mouseX <= canvasSize && mouseY >= 0 && mouseY <= canvasSize) { // check if mouse is in canvas
    if (!isLooping()) { // check if game is over
      resetGrid();
      loop();
      return;
    }
    let posX = Math.floor(mouseX / scale), posY =  Math.floor(mouseY / scale);
    if (!grid[posX][posY]) { // check if cell is empty and marks it 
      grid[posX][posY] = playerTurn;
      // change player turn
      if (playerTurn == 1) { 
        playerTurn = 2;
      } else {
        playerTurn = 1;
      }
    }
    let status = checkStatus();
    if (status != undefined && status != 0) {
      if (status == 3) { // tie
        ties++;
        document.getElementById('ties').innerHTML = "Ties: " + ties;
      } else { 
        winner = true;
        if (playerTurn == 2) { 
          xWins++;
          document.getElementById('xWins').innerHTML = "X Wins: " + xWins;
        } else {
          oWins++;
          document.getElementById('oWins').innerHTML = "O Wins: " + oWins;
        }
        console.log("Player " + playerTurn + " wins!");
      }
      noLoop(); // Stop the draw loop
    }
  }
}
// checks game status
function checkStatus() {
  // Check rows
  for (let i = 0; i < 3; ++i) {
    if (grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2] && grid[i][0] != 0) {
      winLine = { x1: i * scale + scale / 2, y1: 0, x2: i * scale + scale / 2, y2: canvasSize };
      return grid[i][0];
    }
  }
  // Check columns
  for (let i = 0; i < 3; ++i) {
    if (grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i] && grid[0][i] != 0) {
      winLine = { x1: 0, y1: i * scale + scale / 2, x2: canvasSize, y2: i * scale + scale / 2 };
      return grid[0][i];
    }
  }
  // Check diagonals
  if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2] && grid[0][0] != 0) {
    winLine = { x1: 0, y1: 0, x2: canvasSize, y2: canvasSize };
    return grid[0][0];
    
  }
  if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0] && grid[0][2] != 0) {
    winLine = { x1: 0, y1: canvasSize, x2: canvasSize, y2: 0 };
    return grid[0][2];
  }
  // Check is over
  let turns = 0;
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (grid[i][j] == 1 || grid[i][j] == 2) {
        ++turns;
      }
    }
  }
  // tie
  if (turns == 9) {
    return 3;
  }
  return 0;
} 