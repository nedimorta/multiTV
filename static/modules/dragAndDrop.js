import { addOverlay, removeOverlay } from './overlay.js';
import { adjustIframeSizes } from './layout.js';
import { storeVideoStates } from './channelManagement.js';

let draggedElement = null;
let ghostElement = null;
let originalPosition = null;

function dragStart(event) {
  // Only start dragging if we're grabbing the handle.
  if (event.target.classList.contains('drag-button') || event.target.closest('.drag-button')) {
    event.preventDefault();
    draggedElement = event.target.closest('.iframe-box');
    draggedElement.classList.add('dragging');
    
    // Remember where we started. It's like leaving a trail of breadcrumbs.
    originalPosition = draggedElement.getBoundingClientRect();
    
    // Create a ghost element. It's like your video's spirit animal.
    ghostElement = draggedElement.cloneNode(true);
    ghostElement.classList.add('ghost-box');
    ghostElement.style.width = `${originalPosition.width}px`;
    ghostElement.style.height = `${originalPosition.height}px`;
    ghostElement.style.position = 'fixed';
    ghostElement.style.zIndex = '1000';
    document.body.appendChild(ghostElement);
    
    // Calculate where the mouse grabbed the element.
    const mouseX = event.clientX - originalPosition.left;
    const mouseY = event.clientY - originalPosition.top;
    ghostElement.dataset.offsetX = mouseX;
    ghostElement.dataset.offsetY = mouseY;
    
    addOverlay(draggedElement);
    
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
    // Hopefully not in the void.
    const ghostRect = ghostElement.getBoundingClientRect();
    let targetBox = findTargetBox(ghostRect.left + ghostRect.width / 2, ghostRect.top + ghostRect.height / 2);
    
    if (targetBox && targetBox !== draggedElement) {
      // Swap 'em if you got 'em
      moveBoxToTarget(draggedElement, targetBox);
    }
    
    // Mom would be proud.
    document.querySelectorAll('.iframe-box').forEach(box => {
      box.classList.remove('dragging');
      box.classList.remove('drop-target');
      removeOverlay(box);
    });

    // Say goodbye to our ghost friend.
    document.body.removeChild(ghostElement);
    
    // It's like it never even happened.
    draggedElement = null;
    ghostElement = null;
    originalPosition = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);

    adjustIframeSizes();
    storeVideoStates();
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