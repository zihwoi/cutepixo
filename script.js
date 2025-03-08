// Get all required DOM elements
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const saveAsBtn = document.getElementById('saveAsBtn');
const fileFormatSelector = document.getElementById('fileFormatSelector');
const pixelArtSelector = document.getElementById('pixelArtSelector');
const generateArtBtn = document.getElementById('generateArtBtn');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
const eraserBtn = document.getElementById('eraserBtn');
const colorPicker = document.getElementById('colorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const transparentBgCheckbox = document.getElementById('transparentBg');

// Setup canvas size and pixel size
const pixelSize = 20; // Size of each pixel in the grid
const canvasSize = 500; // Size of the canvas
canvas.width = canvasSize;
canvas.height = canvasSize;

// Pixel art designs
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
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 1]
    ]
};

// State variables
let painting = false;
let isErasing = false;

// Start painting
function startPosition(e) {
    painting = true;
    draw(e);
}

// End painting
function endPosition() {
    painting = false;
    ctx.beginPath();
}

// Draw on canvas
function draw(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    
    if (isErasing) {
        erasePixel(x, y);
    } else {
        drawPixel(x, y, colorPicker.value);
    }
}

// Draw pixel function to fill the pixel
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Erase pixel function to clear the pixel
function erasePixel(x, y) {
    ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Function to toggle eraser mode
function toggleEraser() {
    isErasing = !isErasing;
    
    if (isErasing) {
        eraserBtn.classList.add('active');
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const artWidth = art[0].length;
    const artHeight = art.length;

    // Calculate offsets to center the pixel art
    const offsetX = Math.floor((canvasSize / pixelSize - artWidth) / 2);
    const offsetY = Math.floor((canvasSize / pixelSize - artHeight) / 2);

    for (let y = 0; y < artHeight; y++) {
        for (let x = 0; x < artWidth; x++) {
            const color = art[y][x] === 1 ? colorPicker.value : 'transparent';
            drawPixel(x + offsetX, y + offsetY, color);
        }
    }
}

// Function to save canvas as an image file
function saveCanvasAs(canvas, format = 'png') {
    try {
        let mimeType;
        let extension;
        let needsBackgroundForJpeg = false;
        
        // Set mime type and file extension based on format
        switch (format.toLowerCase()) {
            case 'jpeg':
            case 'jpg':
                mimeType = 'image/jpeg';
                extension = 'jpg';
                needsBackgroundForJpeg = true;
                break;
            case 'ico':
                // Handle ICO specially
                saveAsSimpleIco(canvas);
                return;
            case 'png':
            default:
                mimeType = 'image/png';
                extension = 'png';
                break;
        }
        
        // For JPEG, we need to handle transparency by filling with a background color
        if (needsBackgroundForJpeg && !transparentBgCheckbox.checked) {
            // Create a temporary canvas with background
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Fill with background color
            tempCtx.fillStyle = bgColorPicker.value;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw the original canvas on top
            tempCtx.drawImage(canvas, 0, 0);
            
            // Get data URL from the temp canvas
            const dataUrl = tempCanvas.toDataURL(mimeType, 0.9); // 0.9 quality for JPEG
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `pixel_art.${extension}`;
            link.click();
        } else {
            // For PNG or if transparency is requested for JPEG (which will still appear black)
            const dataUrl = canvas.toDataURL(mimeType);
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `pixel_art.${extension}`;
            link.click();
        }
    } catch (error) {
        console.error(`Error saving as ${format}:`, error);
        alert(`Failed to save as ${format}. Please try another format.`);
    }
}

// Function to save as a simplified ICO (actually a small PNG with .ico extension)
function saveAsSimpleIco(canvas) {
    try {
        // Create a small 32x32 canvas for the icon (standard ICO size)
        const iconCanvas = document.createElement('canvas');
        iconCanvas.width = 32;
        iconCanvas.height = 32;
        const iconCtx = iconCanvas.getContext('2d');
        
        // If we want a background for the icon
        if (!transparentBgCheckbox.checked) {
            iconCtx.fillStyle = bgColorPicker.value;
            iconCtx.fillRect(0, 0, iconCanvas.width, iconCanvas.height);
        }
        
        // Draw the original canvas content onto the smaller canvas
        iconCtx.drawImage(canvas, 0, 0, 32, 32);
        
        // Get the PNG data
        const iconData = iconCanvas.toDataURL('image/png');
        
        // Create a download link
        const link = document.createElement('a');
        link.href = iconData;
        link.download = 'pixel_art.ico';  // Name it with .ico extension
        link.click();
        
        console.log("Simplified ICO saved successfully");
    } catch (error) {
        console.error("Error creating simplified ICO:", error);
        alert("Failed to create ICO file. Please try another format.");
    }
}

// EVENT LISTENERS

// Clear canvas button
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save original PNG button
saveBtn.addEventListener('click', () => {
    saveCanvasAs(canvas, 'png');
});

// Save As button using format selector
saveAsBtn.addEventListener('click', () => {
    const selectedFormat = fileFormatSelector.value;
    saveCanvasAs(canvas, selectedFormat);
});

// Generate pixel art button
generateArtBtn.addEventListener('click', () => {
    const selectedArt = pixelArtSelector.value;
    generatePixelArt(selectedArt);
});

// Toggle dark mode
toggleDarkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Toggle eraser
eraserBtn.addEventListener('click', toggleEraser);

// Canvas drawing events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', endPosition);

// Make transparent background checkbox toggle bg color picker disabled state
transparentBgCheckbox.addEventListener('change', function() {
    bgColorPicker.disabled = this.checked;
});

// Initialize - clear canvas to start
ctx.clearRect(0, 0, canvas.width, canvas.height);
console.log("CutePixo app initialized successfully");