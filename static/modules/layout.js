function adjustIframeSizes() {
  const iframeContainer = document.getElementById('iframeContainer');
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  const channelCount = iframeBoxes.length;

  let columns, rows;
  if (channelCount <= 2) {
    columns = 1; rows = 2;
  } else if (channelCount <= 4) {
    columns = 2; rows = 2;
  } else if (channelCount <= 6) {
    columns = 3; rows = 2;
  } else if (channelCount <= 9) {
    columns = 3; rows = 3;
  } else if (channelCount <= 12) {
    columns = 4; rows = 3;
  } else {
    columns = 4; rows = 4;
  }

  // Set up our grid.
  iframeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Make sure each box and iframe fills its space.
  iframeBoxes.forEach(box => {
    box.style.width = '100%';
    box.style.height = '100%';
    
    const iframe = box.querySelector('iframe');
    if (iframe) {
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';

      // Add this check for Kick videos
      const videoContainer = box.querySelector('.video-container');
      if (videoContainer && (videoContainer.classList.contains('kick-video') || videoContainer.classList.contains('kick-stream'))) {
        iframe.style.objectFit = 'contain';
      }
    }
  });

  console.log(`Grid adjusted: ${columns}x${rows} for ${channelCount} channels.`);
}

function setGridView(columns, rows) {
  const iframeContainer = document.getElementById('iframeContainer');
  const totalBoxes = columns * rows;
  const currentBoxes = iframeContainer.querySelectorAll('.iframe-box').length;

  // Collect current videos and their indexes
  const videos = [];
  iframeContainer.querySelectorAll('.iframe-box').forEach((box, index) => {
    const iframe = box.querySelector('iframe');
    if (iframe) {
      videos.push({ index, src: iframe.src });
    }
  });

  if (totalBoxes > currentBoxes) {
    for (let i = currentBoxes; i < totalBoxes; i++) {
      const box = document.createElement('div');
      box.id = `box${i + 1}`;
      box.className = 'iframe-box';
      box.innerHTML = `
        <div class="input-container">
          <input type="text" id="url${i + 1}" placeholder="Enter YouTube URL" class="form-control"/>
          <button class="btn btn-primary add-button">+</button>
        </div>
      `;
      iframeContainer.appendChild(box);
    }
  } else if (totalBoxes < currentBoxes) {
    for (let i = currentBoxes; i > totalBoxes; i--) {
      const box = document.getElementById(`box${i}`);
      if (box) {
        iframeContainer.removeChild(box);
      }
    }
  }

  // Sets up the grid layout.
  iframeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Reassign videos to the smallest available indexes
  iframeContainer.querySelectorAll('.iframe-box').forEach((box, index) => {
    if (index < videos.length) {
      box.innerHTML = `
        <iframe src="${videos[index].src}" allowfullscreen></iframe>
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div class="input-container">
          <input type="text" id="url${index + 1}" placeholder="Enter YouTube URL" class="form-control"/>
          <button class="btn btn-primary add-button">+</button>
        </div>
      `;
    }
  });

  // Make sure everything fits nicely
  adjustIframeSizes();

  console.log(`Grid view set to ${columns}x${rows}.`);
}

export { adjustIframeSizes, setGridView };