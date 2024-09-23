import { adjustIframeSizes, setGridView } from './layout.js';
import { extractVideoId, getVideoType } from './utils.js';

function saveConfiguration(event) {
    if (event) event.preventDefault();
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeBoxes = iframeContainer.querySelectorAll('.iframe-box');
    const config = {
        gridSize: iframeBoxes.length,
        columns: iframeContainer.style.gridTemplateColumns.split(' ').length,
        rows: iframeContainer.style.gridTemplateRows.split(' ').length,
        videos: []
    };

    iframeBoxes.forEach((box, index) => {
        const iframe = box.querySelector('iframe');
        if (iframe && iframe.src) {
            const videoId = extractVideoId(iframe.src);
            const videoType = getVideoType(iframe.src);
            if (videoId && videoType) {
                config.videos.push({
                    index: index,
                    videoId: videoId,
                    videoType: videoType
                });
            } else {
                console.warn(`Could not extract video ID or type for box ${index}`);
            }
        }
    });

    console.log('Saving configuration:', config);

    if (config.videos.length === 0) {
        console.warn('No videos found to save.');
        alert('No videos found to save. Please add some videos before saving.');
        return;
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multi-tv-config.json';
    a.style.display = 'none';
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
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    console.log('Loaded config:', config);
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
        }
    };
    input.click();
}

function isValidConfig(config) {
    if (!config || typeof config.gridSize !== 'number' || !Array.isArray(config.videos)) {
        console.error('Invalid config structure:', config);
        return false;
    }
    
    for (let video of config.videos) {
        if (typeof video.index !== 'number' || typeof video.videoId !== 'string' || typeof video.videoType !== 'string') {
            console.error('Invalid video entry:', video);
            return false;
        }
    }
    
    return true;
}

function applyConfiguration(config) {
    console.log('Applying configuration:', config);

    let columns, rows;
    if (config.gridSize <= 2) {
        columns = 1; rows = 2;
    } else if (config.gridSize <= 4) {
        columns = 2; rows = 2;
    } else if (config.gridSize <= 6) {
        columns = 3; rows = 2;
    } else if (config.gridSize <= 9) {
        columns = 3; rows = 3;
    } else if (config.gridSize <= 12) {
        columns = 4; rows = 3;
    } else {
        columns = 4; rows = 4;
    }

    setGridView(columns, rows);

    // Wait for the grid to update before adding videos
    setTimeout(() => {
        const iframeContainer = document.getElementById('iframeContainer');
        const iframeBoxes = iframeContainer.querySelectorAll('.iframe-box');

        // Reset all boxes
        iframeBoxes.forEach((box, index) => {
            box.innerHTML = `
                <div class="input-container">
                    <input type="text" id="url${index}" placeholder="Enter YouTube URL" class="form-control">
                    <button class="btn btn-primary add-button">+</button>
                </div>
            `;
        });

        // Add videos from the configuration
        config.videos.forEach((video) => {
            if (video.index < iframeBoxes.length) {
                const box = iframeBoxes[video.index];
                let embedUrl;
                switch (video.videoType) {
                    case 'youtube':
                        embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1`;
                        break;
                    case 'twitch-video':
                        embedUrl = `https://player.twitch.tv/?video=${video.videoId}&parent=${window.location.hostname}&autoplay=true`;
                        break;
                    case 'twitch-stream':
                        embedUrl = `https://player.twitch.tv/?channel=${video.videoId}&parent=${window.location.hostname}&autoplay=true`;
                        break;
                    case 'kick-video':
                        embedUrl = `https://player.kick.com/${video.videoId}`;
                        break;
                    case 'kick-stream':
                        embedUrl = `https://player.kick.com/${video.videoId}`;
                        break;
                }
                box.innerHTML = `
                    <iframe src="${embedUrl}" allowfullscreen></iframe>
                    <div class="button-container">
                        <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
                        <button class="reset-button">X</button>
                    </div>
                `;
            }
        });

        adjustIframeSizes();
        console.log('Configuration applied successfully');
    }, 100);
}

export { saveConfiguration, loadConfiguration };