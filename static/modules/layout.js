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
    const videoContainer = box.querySelector('.video-container');
    if (videoContainer) {
      videos.push({ index, html: videoContainer.outerHTML });
    }
  });

  // Clear the container
  iframeContainer.innerHTML = '';

  // Create new boxes
  for (let i = 0; i < totalBoxes; i++) {
    const box = document.createElement('div');
    box.id = `box${i + 1}`;
    box.className = 'iframe-box';
    if (i < videos.length) {
      box.innerHTML = `
        ${videos[i].html}
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div class="input-container">
          <input type="text" id="url${i + 1}" placeholder="Enter video URL" class="form-control"/>
          <button class="btn btn-primary add-button">+</button>
        </div>
      `;
    }
    iframeContainer.appendChild(box);
  }

  // Sets up the grid layout.
  iframeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Make sure everything fits nicely
  adjustIframeSizes();

  console.log(`Grid view set to ${columns}x${rows}.`);
}

export { adjustIframeSizes, setGridView };