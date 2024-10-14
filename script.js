
// Function to convert and download the canvas as an ICO file
async function saveCanvasAsIco(canvas) {
    const imgData = canvas.toDataURL('image/png'); // Get the image data from the canvas
    const blob = dataURLtoBlob(imgData); // Convert the data URL to a Blob

    try {
        // Ensure toIco is defined
        if (typeof toIco !== 'function') {
            throw new Error('toIco is not a function');
        }

        // Convert the Blob to ICO format
        const icoBlob = await toIco([blob]);

        // Create a link to download the ICO
        const url = URL.createObjectURL(icoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.ico';
        document.body.appendChild(a);
        a.click(); // Trigger the download
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error saving ICO:', error);
    }
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

// Event listener for the save button
document.getElementById('saveIcoBtn').addEventListener('click', () => {
    const canvas = document.getElementById('pixelCanvas');
    saveCanvasAsIco(canvas);
});
