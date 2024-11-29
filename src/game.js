const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const rows = 50;
const cols = 50;
const cellSize = 10;
const intervalTime = 100; //game will update every 100 ms

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

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
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let prob = 0.3;
      grid[row][col] = Math.random() < prob ? 1 : 0;
    }
  }
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
