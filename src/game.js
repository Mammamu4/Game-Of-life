const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const rows = 50;
const cols = 50;
const cellSize = 10;
const intervalTime = 100; //game will update every 100 ms

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

grid[10][10] = 1;
grid[11][10] = 1;
grid[9][10] = 1;
grid[10][11] = 1;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      const x = col * cellSize;
      const y = row * cellSize;
      ctx.rect(x, y, cellSize, cellSize);
      ctx.fillStyle = grid[row][col] ? "black" : "white";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  }
}

drawGrid();

function nextGeneration() {
  const newGrid = [];
  for (let row = 0; row < rows; row++) {
    newGrid[row] = [];
    for (let col = 0; col < cols; col++) {
      let aliveNeighbours = 0;
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (
            i >= 0 &&
            i < rows &&
            j >= 0 &&
            j < cols &&
            (i !== row || j !== col)
          ) {
            aliveNeighbours += grid[i][j];
          }
        }
      }
      if (grid[row][col] === 1) {
        newGrid[row][col] =
          aliveNeighbours === 2 || aliveNeighbours === 3 ? 1 : 0;
      } else {
        newGrid[row][col] = aliveNeighbours === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
  drawGrid();
}

let intervalId;

const startButton = document.getElementById("startButton");
console.log(startButton);
startButton.addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Start";
  } else {
    intervalId = setInterval(nextGeneration, 100);
    startButton.textContent = "Stop";
  }
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(x + " | " + y);
  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  console.log("Row: " + row + " | " + "Col: " + col);
});
