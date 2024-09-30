import { 
  storeYouTubeState, storeTwitchState, storeKickState,
  restoreYouTubeState, restoreTwitchState, restoreKickState,
  videoStates // Import videoStates
} from './channelManagement.js';
import { addOverlay, removeOverlay } from './overlay.js';
import { adjustIframeSizes } from './layout.js';

let draggedElement = null;
let ghostElement = null;
let originalPosition = null;
let draggedState = null;

function dragStart(event) {
  if (event.target.classList.contains('drag-button') || event.target.closest('.drag-button')) {
    event.preventDefault();
    draggedElement = event.target.closest('.iframe-box');
    draggedElement.classList.add('dragging');
    
    originalPosition = draggedElement.getBoundingClientRect();
    
    ghostElement = draggedElement.cloneNode(true);
    ghostElement.classList.add('ghost-box');
    ghostElement.style.width = `${originalPosition.width}px`;
    ghostElement.style.height = `${originalPosition.height}px`;
    ghostElement.style.position = 'fixed';
    ghostElement.style.zIndex = '1000';
    document.body.appendChild(ghostElement);
    
    const mouseX = event.clientX - originalPosition.left;
    const mouseY = event.clientY - originalPosition.top;
    ghostElement.dataset.offsetX = mouseX;
    ghostElement.dataset.offsetY = mouseY;
    
    addOverlay(draggedElement);
    
    // Store the state of the dragged video
    const iframe = draggedElement.querySelector('iframe');
    const videoType = draggedElement.querySelector('.video-container').className.split(' ')[1];
    draggedState = { type: videoType };
    
    if (videoType.includes('youtube')) {
      storeYouTubeState(draggedElement.id, iframe);
    } else if (videoType.includes('twitch')) {
      storeTwitchState(draggedElement.id, iframe);
    } else if (videoType.includes('kick')) {
      storeKickState(draggedElement.id, iframe);
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }
}

function drag(event) {
  if (ghostElement) {
    const offsetX = parseFloat(ghostElement.dataset.offsetX);
    const offsetY = parseFloat(ghostElement.dataset.offsetY);
    
    ghostElement.style.left = `${event.clientX - offsetX}px`;
    ghostElement.style.top = `${event.clientY - offsetY}px`;

    let targetBox = findTargetBox(event.clientX, event.clientY);
    
    // Highlight potential drop zones.
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
      moveBoxToTarget(draggedElement, targetBox);
    }
    
    document.querySelectorAll('.iframe-box').forEach(box => {
      box.classList.remove('dragging');
      box.classList.remove('drop-target');
      removeOverlay(box);
    });

    // Check if ghostElement is still a child of document.body before removing
    if (document.body.contains(ghostElement)) {
      document.body.removeChild(ghostElement);
    }
    
    // Restore the state of the dragged video
    if (draggedState && videoStates[draggedElement.id]) {
      const fullState = videoStates[draggedElement.id];
      console.log('Restoring state:', fullState);
      if (fullState.type.includes('youtube')) {
        restoreYouTubeState(draggedElement.id, fullState);
      } else if (fullState.type.includes('twitch')) {
        restoreTwitchState(draggedElement.id, fullState);
      } else if (fullState.type.includes('kick')) {
        restoreKickState(draggedElement.id, fullState);
      }
    }
    
    draggedElement = null;
    ghostElement = null;
    originalPosition = null;
    draggedState = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    adjustIframeSizes();
  }
}

function moveBoxToTarget(draggedBox, targetBox) {
  const container = document.getElementById('iframeContainer');
  
  if (targetBox.querySelector('.input-container')) {
    // If it's empty, just swap the contents, easy peasy.
    const draggedContent = draggedBox.innerHTML;
    draggedBox.innerHTML = targetBox.innerHTML;
    targetBox.innerHTML = draggedContent;
  } else {
    // If it's not empty, we need to do some DOM gymnastics
    const nextDragged = draggedBox.nextElementSibling;
    const nextTarget = targetBox.nextElementSibling;
    
    if (nextDragged === targetBox) {
      container.insertBefore(targetBox, draggedBox);
    } else if (nextTarget === draggedBox) {
      container.insertBefore(draggedBox, targetBox);
    } else {
      container.insertBefore(draggedBox, nextTarget);
      container.insertBefore(targetBox, nextDragged);
    }
  }

  // It's like giving the browser a tiny heart attack.
  container.offsetHeight;

  draggedBox.classList.add('snapped');
  targetBox.classList.add('snapped');
  setTimeout(() => {
    draggedBox.classList.remove('snapped');
    targetBox.classList.remove('snapped');
  }, 300);
}

function findTargetBox(x, y) {
  const boxes = Array.from(document.querySelectorAll('.iframe-box:not(.dragging)'));
  return boxes.find(box => {
    const rect = box.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
}

export { dragStart, drag, dragEnd };