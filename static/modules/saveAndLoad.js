import { adjustIframeSizes, setGridView } from './layout.js';
import { extractMultipleVideoInfo } from './utils.js';
import { videoStates, restoreYouTubeState, restoreTwitchState, restoreKickState, addChannel, storeVideoStates } from './channelManagement.js';

async function saveConfiguration(event) {
    if (event) event.preventDefault();
    
    console.log('Saving configuration...');
    await storeVideoStates();
    
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeBoxes = iframeContainer.querySelectorAll('.iframe-box');
    const config = {
        gridSize: iframeBoxes.length,
        columns: iframeContainer.className.match(/grid-(\d+)x/)[1],
        rows: iframeContainer.className.match(/x(\d+)/)[1],
        videos: []
    };

    for (const box of iframeBoxes) {
        const iframe = box.querySelector('iframe');
        if (iframe && iframe.src) {
            const videoType = box.querySelector('.video-container').className.split(' ')[1];
            const videoState = videoStates[box.id] || {};
            let videoId = videoState.videoId || iframe.src;
            let currentTime = videoState.currentTime || 0;
            
            if (videoType.includes('youtube')) {
                const player = YT.get(iframe.id);
                if (player && player.getCurrentTime) {
                    currentTime = player.getCurrentTime();
                    videoId = player.getVideoData().video_id;
                }
            } else if (videoType.includes('twitch')) {
                if (videoType === 'twitch-video') {
                    videoId = videoId.split('video=')[1]?.split('&')[0] || videoId;
                } else if (videoType === 'twitch-stream') {
                    videoId = videoId.split('channel=')[1]?.split('&')[0] || videoId;
                }
                currentTime = videoState.currentTime || 0;
            }
            
            config.videos.push({
                index: Array.from(iframeBoxes).indexOf(box),
                videoId: videoId,
                videoType: videoType,
                currentTime: currentTime,
                volume: videoState.volume || 1,
                quality: videoState.quality,
            });

            console.log(`${videoType} in ${box.id} current time:`, currentTime);
        }
    }

    console.log('All video states before saving:', JSON.parse(JSON.stringify(videoStates)));
    console.log('Configuration being saved:', JSON.stringify(config, null, 2));

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const filename = 'multi-tv-config.json';

    // Check if the browser supports the showSaveFilePicker API
    if (window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']},
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to save file:', err);
                alert('Failed to save file. Please try again.');
            }
        }
    } else {
        // Fallback for browsers that don't support showSaveFilePicker
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
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
    return config && typeof config.gridSize === 'number' && Array.isArray(config.videos);
}

async function applyConfiguration(config) {
    setGridView(parseInt(config.columns), parseInt(config.rows));
    
    const iframeContainer = document.getElementById('iframeContainer');
    iframeContainer.innerHTML = ''; // Clear existing content
    
    for (let i = 0; i < config.gridSize; i++) {
        const box = document.createElement('div');
        box.id = `box${i + 1}`;
        box.className = 'iframe-box';
        box.innerHTML = `
            <div class="input-container">
                <input type="text" id="url${i + 1}" placeholder="Enter video URL" class="form-control">
                <button class="btn btn-primary add-button">+</button>
            </div>
        `;
        iframeContainer.appendChild(box);
    }
    
    for (const video of config.videos) {
        if (video.index < config.gridSize) {
            const boxId = `box${video.index + 1}`;
            let url;
            switch (video.videoType) {
                case 'youtube-video':
                    url = `https://www.youtube.com/watch?v=${video.videoId}`;
                    break;
                case 'twitch-video':
                    url = `https://www.twitch.tv/videos/${video.videoId}`;
                    break;
                case 'twitch-stream':
                    url = `https://www.twitch.tv/${video.videoId}`;
                    break;
                case 'kick-video':
                case 'kick-stream':
                    url = video.videoId; // Assuming videoId is the full URL for Kick
                    break;
                default:
                    console.error(`Unknown video type: ${video.videoType}`);
                    continue;
            }
            await addChannel(boxId, url);
            
            // Set the saved state
            if (videoStates[boxId]) {
                videoStates[boxId].currentTime = video.currentTime;
                videoStates[boxId].volume = video.volume;
                videoStates[boxId].quality = video.quality;
                
                // Apply the saved time
                if (video.videoType.includes('youtube')) {
                    const player = YT.get(`iframe-${boxId}`);
                    if (player && player.seekTo) {
                        player.seekTo(video.currentTime);
                    }
                } else if (video.videoType.includes('twitch')) {
                    const player = videoStates[boxId].twitchPlayer;
                    if (player && player.seek) {
                        player.seek(video.currentTime);
                    }
                }
            }
        }
    }
    
    adjustIframeSizes();
}

function showSaveModal(defaultFilename) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '5px';
        content.innerHTML = `
            <h3>Save Configuration</h3>
            <input type="text" id="filename" value="${defaultFilename}" style="width: 100%; margin-bottom: 10px;">
            <button id="saveBtn">Save</button>
            <button id="cancelBtn">Cancel</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('saveBtn').onclick = () => {
            const filename = document.getElementById('filename').value;
            document.body.removeChild(modal);
            resolve(filename);
        };

        document.getElementById('cancelBtn').onclick = () => {
            document.body.removeChild(modal);
            resolve(null);
        };
    });
}

export { saveConfiguration, loadConfiguration };