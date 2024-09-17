import { setupEventListeners } from './modules/eventListeners.js';
import { addChannel, resetChannel } from './modules/channelManagement.js';
import { adjustIframeSizes } from './modules/layout.js';

// Initialize event listeners
setupEventListeners();

// Make addChannel, resetChannel, and adjustIframeSizes globally accessible
window.addChannel = addChannel;
window.resetChannel = resetChannel;
window.adjustIframeSizes = adjustIframeSizes;

// Call adjustIframeSizes on page load
document.addEventListener('DOMContentLoaded', () => {
  adjustIframeSizes();
});
