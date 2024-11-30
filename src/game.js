const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const cellSize = 50;
const rows = 50;
const cols = 100;
let intervalTime = 25; //game will update every 100 ms

let totalGenerations = 0;
let population = 0;
const populationText = document.getElementById("population");
const totalGenerationsText = document.getElementById("totalGenerations");

const root = document.documentElement;
const primaryColor = getComputedStyle(root)
  .getPropertyValue("--primary")
  .trim();

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

grid[25][50] = 1;
grid[26][50] = 1;
grid[26][49] = 1;
grid[27][50] = 1;
grid[27][51] = 1;

function drawGrid() {
  population = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      const x = col * cellSize;
      const y = row * cellSize;

      // Apply rounded rectangles
      drawRoundedRect(x, y, cellSize, cellSize, 5);
      //ctx.rect(x, y, cellSize, cellSize)

      if (grid[row][col] === 1) {
        population += 1;
        ctx.fillStyle = `rgb(${primaryColor})`;
      } else {
        ctx.fillStyle = `white`;
      }
      ctx.fill();
      // Apply border styling
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  populationText.textContent = population;
  totalGenerationsText.textContent = totalGenerations;
}

// Helper function for rounded rectangles
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

drawGrid();

function nextGeneration() {
  totalGenerations += 1;
  const newGrid = [];
  for (let row = 0; row < rows; row++) {
    newGrid[row] = [];
    for (let col = 0; col < cols; col++) {
      let aliveNeighbours = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue; // Skip the current cell
          const neighbourRow = (row + i + rows) % rows; // Wrap vertically
          const neighbourCol = (col + j + cols) % cols; // Wrap horizontally
          aliveNeighbours += grid[neighbourRow][neighbourCol];
        }
      }
      // Apply the rules of the Game of Life
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
  totalGenerations = 0;
  drawGrid();
}

let intervalId;

const startButton = document.getElementById("startButton");

function toggleInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Start";
  } else {
    intervalId = setInterval(nextGeneration, intervalTime);
    startButton.textContent = "Stop";
  }
}

startButton.addEventListener("click", toggleInterval);

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

document.addEventListener("keydown", (e) => {
  if (event.code === "Space" || event.key === " ") {
    e.preventDefault();
    toggleInterval();
  }
});

// const speedValueSlider = document.getElementById("speedValueSlider");
// const speedValue = document.getElementById("speedValue");

// function setSpeed(speed) {
//   // Map the speed (1-100) to a time interval (10 ms to 1000 ms)
//   intervalTime = Math.max(1000 - speed * 20, 10); // Ensure the interval is at least 10ms
// }
// setSpeed(speedValue.value);
// speedValueSlider.addEventListener("input", () => {
//   setSpeed(speedValueSlider.value);
//   speedValue.value = speedValueSlider.value;
// });

// speedValue.addEventListener("input", () => {
//   setSpeed(speedValue.value);
//   speedValueSlider.value = speedValue.value;
// });
