import { adjustIframeSizes, setGridView } from './layout.js';
import { extractMultipleVideoInfo } from './utils.js';

async function saveConfiguration(event) {
    if (event) event.preventDefault();
    
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeBoxes = iframeContainer.querySelectorAll('.iframe-box');
    const config = {
        gridSize: iframeBoxes.length,
        columns: iframeContainer.className.match(/grid-(\d+)x/)[1],
        rows: iframeContainer.className.match(/x(\d+)/)[1],
        videos: []
    };

    iframeBoxes.forEach((box, index) => {
        const iframe = box.querySelector('iframe');
        if (iframe && iframe.src) {
            config.videos.push({
                index: index,
                videoId: iframe.src,
                videoType: box.querySelector('.video-container').className.split(' ')[1]
            });
        }
    });

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multi-tv-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadConfiguration(event) {
    if (event) event.preventDefault();
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                if (isValidConfig(config)) {
                    applyConfiguration(config);
                } else {
                    throw new Error('Invalid configuration file');
                }
            } catch (error) {
                console.error('Error loading configuration:', error);
                alert('Error loading configuration: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function isValidConfig(config) {
    // Implement validation logic here
    return config && typeof config.gridSize === 'number' && Array.isArray(config.videos);
}

function applyConfiguration(config) {
    setGridView(parseInt(config.columns), parseInt(config.rows));
    
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeBoxes = iframeContainer.querySelectorAll('.iframe-box');
    
    config.videos.forEach((video) => {
        if (video.index < iframeBoxes.length) {
            const box = iframeBoxes[video.index];
            box.innerHTML = `
                <div class="video-container ${video.videoType}">
                    <iframe src="${video.videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="button-container">
                    <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
                    <button class="reset-button">X</button>
                </div>
            `;
        }
    });
    
    adjustIframeSizes();
}

export { saveConfiguration, loadConfiguration };