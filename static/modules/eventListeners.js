import { storeVideoStates, restoreVideoStates, resetChannel, addChannel } from './channelManagement.js';
import { adjustIframeSizes } from './layout.js';
import { debounce, extractVideoId } from './utils.js';
import { dragStart } from './dragAndDrop.js';

const debouncedAdjustIframeSizes = debounce(adjustIframeSizes, 250);

function setupEventListeners() {
  window.addEventListener('resize', debouncedAdjustIframeSizes);

  window.addEventListener('load', () => {
    adjustIframeSizes();
    restoreVideoStates();
    console.log('Page loaded, adjusting iframe sizes');
  });

  document.addEventListener('htmx:beforeSwap', storeVideoStates);
  document.addEventListener('htmx:afterSwap', () => {
    adjustIframeSizes();
    restoreVideoStates();
  });
  document.addEventListener('htmx:load', adjustIframeSizes);

  window.addEventListener('resize', adjustIframeSizes);
  window.addEventListener('load', adjustIframeSizes);

  document.addEventListener('htmx:afterSwap', adjustIframeSizes);

  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.addEventListener('mousedown', dragStart);

  iframeContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('reset-button')) {
      const boxId = event.target.closest('.iframe-box').id;
      resetChannel(boxId);
    } else if (event.target.classList.contains('add-button')) {
      const box = event.target.closest('.iframe-box');
      const input = box.querySelector('input');
      addChannel(box.id, input.value);
    }
  });

  // Add event listener for "Enter" key on input fields
  iframeContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const box = event.target.closest('.iframe-box');
      if (box) {
        const input = box.querySelector('input');
        addChannel(box.id, input.value);
      }
    }
  });

  // Validate URL and change text color accordingly
  iframeContainer.addEventListener('input', (event) => {
    if (event.target.tagName === 'INPUT') {
      const input = event.target;
      const videoId = extractVideoId(input.value);
      if (videoId) {
        input.style.color = '';
      } else {
        input.style.color = 'red';
      }
    }
  });
}

export { setupEventListeners };