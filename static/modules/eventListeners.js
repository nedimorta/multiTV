import { storeVideoStates, restoreVideoStates } from './channelManagement.js';
import { adjustIframeSizes } from './layout.js';
import { debounce } from './utils.js';
import { dragStart } from './dragAndDrop.js';

const debouncedAdjustIframeSizes = debounce(adjustIframeSizes, 250);

function setupEventListeners() {
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
}

export { setupEventListeners };