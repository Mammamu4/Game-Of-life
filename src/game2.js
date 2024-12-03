const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const cellSize = 50;
const rows = 50;
const cols = 100;
let intervalTime = 10; // game will update every n ms

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

// Initial glider setup
grid[25][50] = 1;
grid[26][50] = 1;
grid[26][49] = 1;
grid[27][50] = 1;
grid[27][51] = 1;

const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d");
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

function drawGrid() {
  population = 0;
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height); // Clear entire canvas

  // Loop through each cell and render it on the offscreen canvas
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      if (grid[row][col] === 1) {
        population += 1;
        offscreenCtx.fillStyle = `rgb(${primaryColor})`;
        offscreenCtx.fillRect(x, y, cellSize, cellSize); // Draw filled cell for alive state
      } else {
        offscreenCtx.fillStyle = "white";
        offscreenCtx.fillRect(x, y, cellSize, cellSize); // Draw filled cell for dead state (white)
      }
    }
  }

  // Update population and generations text
  populationText.textContent = population;
  totalGenerationsText.textContent = totalGenerations;

  // Copy the offscreen canvas to the main canvas
  ctx.drawImage(offscreenCanvas, 0, 0);
}

function nextGeneration() {
  totalGenerations += 1;
  const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row++) {
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
  grid = Array.from({ length: rows }, () => Array(cols).fill(0));
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
resetButton.addEventListener("click", clearGrid);

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
      let val = randomValueSlider.value;
      grid[row][col] = Math.random() < val ? 1 : 0;
    }
  }
  drawGrid();
});

let isMouseDown = false;
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
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
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    toggleInterval();
  } else if (e.key === "r" || e.key("R")){
    clearGrid();
    drawGrid();
  }

});
drawGrid();
