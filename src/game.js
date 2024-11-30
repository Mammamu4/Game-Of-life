const canvas = document.getElementById("gridCavas");
const ctx = canvas.getContext("2d");

const cellSize = 50;
const rows = 50;
const cols = 100;
const intervalTime = 10; //game will update every 100 ms

const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary').trim();
console.log('Primary Color:', primaryColor);

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      const x = col * cellSize;
      const y = row * cellSize;

      // Apply rounded rectangles
      drawRoundedRect(x, y, cellSize, cellSize, 5);
      //ctx.rect(x, y, cellSize, cellSize)

      // Dynamic fill color based on grid state
      ctx.fillStyle = grid[row][col] ? `rgb(${primaryColor})` : "white";
      ctx.fill();

      // Apply border styling
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
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
    intervalId = setInterval(nextGeneration, intervalTime);
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
