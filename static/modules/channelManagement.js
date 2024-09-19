import { adjustIframeSizes } from './layout.js';
import { extractVideoId } from './utils.js';

// This is where we keep track of video states.
let videoStates = {};

function storeVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  videoStates = {}; // Clear out the old stuff
  iframeBoxes.forEach(box => {
    const iframe = box.querySelector('iframe');
    if (iframe) {
      // YouTube API magic happening here
      const player = new YT.Player(iframe);
      player.getCurrentTime().then(currentTime => {
        videoStates[box.id] = {
          src: iframe.src,
          currentTime: currentTime
        };
      });
    }
  });
}

function restoreVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  iframeBoxes.forEach(box => {
    if (videoStates[box.id]) {
      // Rebuild the box with the saved video
      box.innerHTML = `
        <iframe src="${videoStates[box.id].src}" allowfullscreen></iframe>
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
      const iframe = box.querySelector('iframe');
      iframe.onload = () => {
        // Jump to where we left off
        const player = new YT.Player(iframe);
        player.seekTo(videoStates[box.id].currentTime, true);
      };
    }
  });
}

function resetChannel(boxId) {
  // Back to square one for this box
  const box = document.getElementById(boxId);
  box.innerHTML = `
    <div class="input-container">
      <input type="text" id="url${boxId.replace('box', '')}" placeholder="Enter YouTube URL" class="form-control">
      <button class="btn btn-primary add-button">+</button>
    </div>
  `;
  delete videoStates[boxId];
  adjustIframeSizes();
}

function addChannel(boxId, url) {
  console.log(`Trying to add a video to ${boxId}. Let's see if this URL works: ${url}`);
  const videoId = extractVideoId(url);
  console.log(`Alright, we got a video ID: ${videoId}`);
  
  const box = document.getElementById(boxId);
  const input = box.querySelector('input');

  if (videoId) {
    box.innerHTML = `
      <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1" allowfullscreen></iframe>
      <div class="button-container">
        <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
        <button class="reset-button">X</button>
      </div>
    `;
    videoStates[boxId] = {
      src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1`,
      currentTime: 0
    };
    adjustIframeSizes();
    console.log(`Boom! Video added to ${boxId}. Looking good!`);
  } else {
    input.style.color = 'red';
    alert(`Uh oh, that URL didn't work out:\n${url}`);
  }
}

export { storeVideoStates, restoreVideoStates, resetChannel, addChannel };