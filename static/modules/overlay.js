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

export { addOverlay, removeOverlay };