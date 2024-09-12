let videoStates = {};
let draggedElement = null;
let ghostElement = null;
let originalPosition = null;

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

  console.log(`Adjusting grid: ${columns} columns, ${rows} rows for ${channelCount} channels`);
}

function storeVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
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
          <button class="reset-button" onclick="resetChannel('${box.id}')">X</button>
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
      <button onclick="addChannel('${boxId}', 'url${boxId.replace('box', '')}')" class="btn btn-primary add-button">+</button>
    </div>
  `;
  delete videoStates[boxId];
  adjustIframeSizes();
}

function addChannel(boxId, urlId) {
  const url = document.getElementById(urlId).value;
  const videoId = extractVideoId(url);
  if (videoId) {
    const box = document.getElementById(boxId);
    box.innerHTML = `
      <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1" allowfullscreen></iframe>
      <div class="button-container">
        <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
        <button class="reset-button" onclick="resetChannel('${boxId}')">X</button>
      </div>
    `;
    videoStates[boxId] = {
      src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1`,
      currentTime: 0
    };
    adjustIframeSizes();
  } else {
    alert('Invalid YouTube URL');
  }
}

function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function dragStart(event) {
  if (event.target.classList.contains('drag-button') || event.target.closest('.drag-button')) {
    event.preventDefault();
    draggedElement = event.target.closest('.iframe-box');
    draggedElement.classList.add('dragging');
    
    // Store the original position
    originalPosition = draggedElement.getBoundingClientRect();
    
    // Create a ghost element for smooth dragging
    ghostElement = draggedElement.cloneNode(true);
    ghostElement.classList.add('ghost-box');
    ghostElement.style.width = `${originalPosition.width}px`;
    ghostElement.style.height = `${originalPosition.height}px`;
    ghostElement.style.position = 'fixed';
    ghostElement.style.zIndex = '1000';
    document.body.appendChild(ghostElement);
    
    // Store the initial mouse position relative to the dragged element
    const mouseX = event.clientX - originalPosition.left;
    const mouseY = event.clientY - originalPosition.top;
    ghostElement.dataset.offsetX = mouseX;
    ghostElement.dataset.offsetY = mouseY;
    
    // Add an overlay to prevent iframe interaction during drag
    addOverlay(draggedElement);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }
}

function addOverlay(element) {
  const overlay = document.createElement('div');
  overlay.classList.add('drag-overlay');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.zIndex = '1000';
  element.appendChild(overlay);
}

function removeOverlay(element) {
  const overlay = element.querySelector('.drag-overlay');
  if (overlay) {
    element.removeChild(overlay);
  }
}

function drag(event) {
  if (ghostElement) {
    const offsetX = parseFloat(ghostElement.dataset.offsetX);
    const offsetY = parseFloat(ghostElement.dataset.offsetY);
    
    ghostElement.style.left = `${event.clientX - offsetX}px`;
    ghostElement.style.top = `${event.clientY - offsetY}px`;
    
    // Find the element we're hovering over
    let targetBox = findTargetBox(event.clientX, event.clientY);
    
    document.querySelectorAll('.iframe-box').forEach(box => {
      if (box === targetBox && box !== draggedElement) {
        box.classList.add('drop-target');
      } else {
        box.classList.remove('drop-target');
      }
    });
  }
}

function dragEnd(event) {
  if (draggedElement && ghostElement) {
    const ghostRect = ghostElement.getBoundingClientRect();
    let targetBox = findTargetBox(ghostRect.left + ghostRect.width / 2, ghostRect.top + ghostRect.height / 2);
    
    if (targetBox && targetBox !== draggedElement) {
      // Perform the grid rearrangement
      rearrangeGrid(draggedElement, targetBox);
    } else {
      // Return to original position
      draggedElement.style.transform = 'none';
    }
    
    // Remove dragging class and overlay from all elements
    document.querySelectorAll('.iframe-box').forEach(box => {
      box.classList.remove('dragging');
      box.classList.remove('drop-target');
      removeOverlay(box);
    });

    document.body.removeChild(ghostElement);
    
    // Reset variables
    draggedElement = null;
    ghostElement = null;
    originalPosition = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
    
    adjustIframeSizes();
  }
}

function rearrangeGrid(draggedElement, targetBox) {
  const container = document.getElementById('iframeContainer');
  const boxes = Array.from(container.querySelectorAll('.iframe-box'));
  const draggedIndex = boxes.indexOf(draggedElement);
  const targetIndex = boxes.indexOf(targetBox);
  
  if (draggedIndex < targetIndex) {
    targetBox.parentNode.insertBefore(draggedElement, targetBox.nextSibling);
  } else {
    targetBox.parentNode.insertBefore(draggedElement, targetBox);
  }

  // Trigger a layout recalculation
  container.offsetHeight;

  // Add a class to trigger the snap animation
  draggedElement.classList.add('snapped');
  setTimeout(() => {
    draggedElement.classList.remove('snapped');
  }, 300);
}

function findTargetBox(x, y) {
  const boxes = Array.from(document.querySelectorAll('.iframe-box:not(.dragging)'));
  return boxes.find(box => {
    const rect = box.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedAdjustIframeSizes = debounce(adjustIframeSizes, 250);

window.addEventListener('resize', debouncedAdjustIframeSizes);

window.addEventListener('load', () => {
  adjustIframeSizes();
  restoreVideoStates();
  console.log('Page loaded, adjusting iframe sizes');
});

document.addEventListener('htmx:beforeSwap', storeVideoStates); // Store video states before htmx content swap
document.addEventListener('htmx:afterSwap', () => {
  adjustIframeSizes();
  restoreVideoStates();
});
document.addEventListener('htmx:load', adjustIframeSizes);

window.addEventListener('resize', adjustIframeSizes);
window.addEventListener('load', adjustIframeSizes);

document.addEventListener('htmx:afterSwap', adjustIframeSizes);

document.getElementById('iframeContainer').addEventListener('mousedown', dragStart);
