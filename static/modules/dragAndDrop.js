import { addOverlay, removeOverlay } from './overlay.js';
import { adjustIframeSizes } from './layout.js';

let draggedElement = null;
let ghostElement = null;
let originalPosition = null;

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

export { dragStart, drag, dragEnd };