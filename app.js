
console.log(typeof toIco); // This should log 'function' if loaded correctly
console.log("App.js loaded!");

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');


const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const saveIcoBtn = document.getElementById('saveIcoBtn');
const pixelArtSelector = document.getElementById('pixelArtSelector');
const generateArtBtn = document.getElementById('generateArtBtn');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
const eraserBtn = document.getElementById('eraserBtn');

// Setup canvas size and pixel size
const pixelSize = 20; // Size of each pixel in the grid
const canvasSize = 500; // Size of the canvas
canvas.width = canvasSize;
canvas.height = canvasSize;

const pixelArtObjects = {
    heart: [
        [0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 0],
        [0, 0, 1, 0, 0, 0]
    ],
    smiley: [
        [0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 0]
    ],
    star: [
        [0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0]
    ],
    // Add more pixel designs here
};


//State variables
let painting = false; // Flag to track if the user is currently painting
let isErasing = false; // Flag to track if the eraser is active

// Start painting
function startPosition(e) {
    painting = true;
    draw(e);
}

// End painting
function endPosition() {
    painting = false;
    ctx.beginPath(); // Start a new path
}

// Draw on canvas
function draw(e) {
    if (!painting) return;

    const x = Math.floor((e.clientX - canvas.offsetLeft) / pixelSize);
    const y = Math.floor((e.clientY - canvas.offsetTop) / pixelSize);
    
    if (isErasing) {
        erasePixel(x, y); // Call the erase function
    } else {
        drawPixel(x, y, colorPicker.value); // Use the color selected from the color picker
    }
}


// Draw pixel function to fill the pixel
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Erase pixel function to clear the pixel
function erasePixel(x, y) {
    ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); // Clear the pixel
}

// Function to toggle eraser mode
function toggleEraser() {
    isErasing = !isErasing; // Toggle the eraser flag
    
    if (isErasing) {
        eraserBtn.classList.add('active'); // Optionally add an active class for styling
    } else {
        eraserBtn.classList.remove('active');
    }
}

// Function to generate pixel art
function generatePixelArt(artName) {
    const art = pixelArtObjects[artName];

    if (!art) {
        console.error('Pixel art not found');
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first

    const artWidth = art[0].length; // Width of the pixel art
    const artHeight = art.length; // Height of the pixel art

    // Calculate offsets to center the pixel art
    const offsetX = Math.floor((canvasSize / pixelSize - artWidth) / 2);
    const offsetY = Math.floor((canvasSize / pixelSize - artHeight) / 2);

    for (let y = 0; y < artHeight; y++) {
        for (let x = 0; x < artWidth; x++) {
            const color = art[y][x] === 1 ? 'black' : 'transparent'; // Fill with black or leave transparent
            drawPixel(x + offsetX, y + offsetY, color); // Draw pixel with offsets
        }
    }
}

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

// Add an event listener to the "Save as ICO" button
saveIcoBtn.addEventListener('click', async () => {
    const dataUrl = canvas.toDataURL('image/png');
    const imageData = dataUrl.split(',')[1]; // Extract the base64 data
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));

    // Use to-ico package to convert PNG to ICO
    try {
        const icoBuffer = await toIco([imageBuffer]);

        // Create a blob for the ICO file and download it
        const blob = new Blob([icoBuffer], { type: 'image/x-icon' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pixel_art.ico';
        link.click();
    } catch (error) {
        console.error('Error saving as ICO:', error);
    }
});

// Generate pixel art button functionality
generateArtBtn.addEventListener('click', () => {
    const selectedArt = pixelArtSelector.value;
    generatePixelArt(selectedArt);
});



toggleDarkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); // Toggle the dark mode class
});

// Attach eraser toggle functionality to the button
eraserBtn.addEventListener('click', toggleEraser);

// Mouse event listeners for drawing functionality
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
