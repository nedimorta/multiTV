import { setupEventListeners } from './modules/eventListeners.js';
import { addChannel, resetChannel } from './modules/channelManagement.js';
import { adjustIframeSizes } from './modules/layout.js';
import { saveConfiguration, loadConfiguration } from './modules/saveAndLoad.js';

// Initialize event listeners
setupEventListeners();

// Make functions globally accessible
window.addChannel = addChannel;
window.resetChannel = resetChannel;
window.adjustIframeSizes = adjustIframeSizes;
window.saveConfiguration = (event) => saveConfiguration(event);
window.loadConfiguration = (event) => loadConfiguration(event);

// Call adjustIframeSizes on page load
document.addEventListener('DOMContentLoaded', () => {
  adjustIframeSizes();
});
