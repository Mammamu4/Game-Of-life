const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const rows = 50;
const cols = 50;
const cellSize = 20;
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

function clearGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
  drawGrid();
}

let intervalId;

const startButton = document.getElementById("startButton");
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

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
  clearGrid();
});

const randomValueSlider = document.getElementById("randomValueSlider");
const randomValue = document.getElementById("randomValue");

randomValueSlider.addEventListener("input", () => {
  randomValue.value = randomValueSlider.value;
});

randomValue.addEventListener("input", () => {
  randomValueSlider.value = randomValue.value;
});

const randomizeButton = document.getElementById("randomizeButton");
randomizeButton.addEventListener("click", () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let val = document.getElementById("randomValueSlider").value;
      grid[row][col] = Math.random() < val ? 1 : 0;
    }
  }
  drawGrid();
});

let isMouseDown = false; // Track if the mouse is down

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const row = Math.floor(y / cellSize);
  const col = Math.floor(x / cellSize);
  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid();
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Scale factor for x coordinates
    const scaleY = canvas.height / rect.height; // Scale factor for y coordinates
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col] = 1;
      drawGrid();
    }
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

canvas.addEventListener("mouseleave", () => {
  isMouseDown = false;
});
