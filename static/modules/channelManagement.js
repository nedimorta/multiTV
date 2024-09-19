import { adjustIframeSizes } from './layout.js';
import { extractVideoId } from './utils.js';

let videoStates = {};

function storeVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  videoStates = {}; // Reset videoStates
  iframeBoxes.forEach(box => {
    const iframe = box.querySelector('iframe');
    if (iframe) {
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
      box.innerHTML = `
        <iframe src="${videoStates[box.id].src}" allowfullscreen></iframe>
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
      const iframe = box.querySelector('iframe');
      iframe.onload = () => {
        const player = new YT.Player(iframe);
        player.seekTo(videoStates[box.id].currentTime, true);
      };
    }
  });
}

function resetChannel(boxId) {
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
  console.log(`Adding channel to box ${boxId} with URL: ${url}`);
  const videoId = extractVideoId(url);
  console.log(`Extracted video ID: ${videoId}`);
  
  if (videoId) {
    const box = document.getElementById(boxId);
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
    console.log(`Channel added successfully to box ${boxId}`);
  } else {
    console.error(`Invalid YouTube URL: ${url}`);
    // Instead of showing an alert, log the error and not interrupt the user
    // alert('Invalid YouTube URL');
  }
}

export { storeVideoStates, restoreVideoStates, resetChannel, addChannel };