import { adjustIframeSizes } from './layout.js';
import { extractVideoInfo } from './utils.js';

// This is where we keep track of video states.
let videoStates = {};

function storeVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  videoStates = {}; // Clear out the old stuff
  iframeBoxes.forEach(box => {
    const iframe = box.querySelector('iframe');
    if (iframe) {
      const videoType = box.querySelector('.video-container').className.split(' ')[1];
      videoStates[box.id] = {
        src: iframe.src,
        currentTime: 0, // Default to 0
        type: videoType
      };

      // Handle different video types
      if (videoType.includes('youtube') && window.YT && window.YT.Player) {
        const player = YT.get(iframe.id);
        if (player && player.getCurrentTime) {
          videoStates[box.id].currentTime = player.getCurrentTime();
        }
      }
      // For Twitch and Kick, we currently can't store the current time
    }
  });
}

function restoreVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  iframeBoxes.forEach(box => {
    if (videoStates[box.id]) {
      const state = videoStates[box.id];
      // Rebuild the box with the saved video
      box.innerHTML = `
        <div class="video-container ${state.type}">
          <iframe id="iframe-${box.id}" src="${state.src}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
      const iframe = box.querySelector('iframe');
      iframe.onload = () => {
        // Jump to where we left off for YouTube videos
        if (state.type.includes('youtube')) {
          new YT.Player(`iframe-${box.id}`, {
            events: {
              'onReady': (event) => {
                event.target.seekTo(state.currentTime);
              }
            }
          });
        }
        // For other video types, we currently can't restore the time
      };
    }
  });
}

function resetChannel(boxId) {
  // Back to square one for this box
  const box = document.getElementById(boxId);
  box.innerHTML = `
    <div class="input-container">
      <input type="text" id="url${boxId.replace('box', '')}" placeholder="Enter video URL" class="form-control">
      <button class="btn btn-primary add-button">+</button>
    </div>
  `;
  delete videoStates[boxId];
  adjustIframeSizes();
}

async function addChannel(boxId, url) {
  console.log(`Trying to add a video to ${boxId}. Let's see if this URL works: ${url}`);
  
  const box = document.getElementById(boxId);
  const input = box.querySelector('input');
  const addButton = box.querySelector('.add-button');

  // Show loading indicator
  addButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  addButton.disabled = true;

  try {
    const { videoId, videoType } = await extractVideoInfo(url);
    console.log(`Alright, we got a video ID: ${videoId} and type: ${videoType}`);

    let embedSrc;
    let videoClass;
    switch (videoType) {
      case 'youtube-video':
        embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1`;
        videoClass = 'youtube-video';
        break;
      case 'youtube-live':
        embedSrc = `https://www.youtube.com/embed/live_stream?channel=${videoId}&autoplay=1&mute=1&controls=1&enablejsapi=1`;
        videoClass = 'youtube-live';
        break;
      case 'twitch-video':
        embedSrc = `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=true`;
        videoClass = 'twitch-video';
        break;
      case 'twitch-stream':
        embedSrc = `https://player.twitch.tv/?channel=${videoId}&parent=${window.location.hostname}&autoplay=true`;
        videoClass = 'twitch-stream';
        break;
      case 'kick-video':
        embedSrc = `https://player.kick.com/${videoId}`; // videoId already includes "videos/" prefix
        videoClass = 'kick-video';
        break;
      case 'kick-stream':
        embedSrc = `https://player.kick.com/${videoId}`; // videoId already includes "channel/" prefix
        videoClass = 'kick-stream';
        break;
      default:
        throw new Error(`Unsupported video type: ${videoType}`);
    }

    box.innerHTML = `
      <div class="video-container ${videoClass}">
        <iframe id="iframe-${boxId}" src="${embedSrc}" frameborder="0" allowfullscreen scrolling="no"></iframe>
      </div>
      <div class="button-container">
        <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
        <button class="reset-button">X</button>
      </div>
    `;
    videoStates[boxId] = {
      src: embedSrc,
      currentTime: 0,
      type: videoType
    };

    // Initialize YouTube player if it's a YouTube video
    if (videoClass.includes('youtube')) {
      new YT.Player(`iframe-${boxId}`, {
        events: {
          'onReady': (event) => {
            // The player is ready
          }
        }
      });
    }

    adjustIframeSizes();
    console.log(`Boom! Video added to ${boxId}. Looking good!`);
  } catch (error) {
    console.error(`Error adding video to ${boxId}:`, error);
    input.style.color = 'red';
    alert(`Uh oh, that URL didn't work out:\n${error.message}`);
  } finally {
    // Reset button state
    addButton.innerHTML = '+';
    addButton.disabled = false;
  }
}

export { storeVideoStates, restoreVideoStates, resetChannel, addChannel };