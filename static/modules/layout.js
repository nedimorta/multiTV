function adjustIframeSizes() {
  const iframeContainer = document.getElementById('iframeContainer');
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  const channelCount = iframeBoxes.length;

  let columns, rows;
  if (channelCount <= 4) {
    columns = 2; rows = 2;
  } else if (channelCount <= 9) {
    columns = 3; rows = 3;
  } else if (channelCount <= 12) {
    columns = 4; rows = 3;
  } else {
    columns = 4; rows = 4;
  }

  // Set the grid layout
  iframeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Adjust the size of each iframe box
  iframeBoxes.forEach(box => {
    box.style.width = '100%';
    box.style.height = '100%';
  });

  console.log(`Adjusting grid: ${columns} columns, ${rows} rows for ${channelCount} channels`);
}

function setGridView(columns, rows) {
  const iframeContainer = document.getElementById('iframeContainer');
  const totalBoxes = columns * rows;
  const currentBoxes = iframeContainer.querySelectorAll('.iframe-box').length;

  // Add or remove boxes to match the selected grid view
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

  // Set the grid layout
  iframeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  console.log(`Grid view set to: ${columns} columns, ${rows} rows`);
}

// Export the functions so they can be used in other modules
export { adjustIframeSizes, setGridView };