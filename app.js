// Get references to the canvas, color picker, and buttons
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

// Set up canvas size and grid size
const pixelSize = 20;
const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Function to draw pixel
function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Event listener to handle drawing on canvas
let isDrawing = false;
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    const x = Math.floor(e.offsetX / pixelSize);
    const y = Math.floor(e.offsetY / pixelSize);
    drawPixel(x, y, colorPicker.value);
  }
});

// Clear canvas button functionality
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save canvas to an image
saveBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'pixel_logo.png';
  link.click();
});
