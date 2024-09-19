import { setupEventListeners } from './modules/eventListeners.js';
import { addChannel, resetChannel } from './modules/channelManagement.js';
import { adjustIframeSizes, setGridView } from './modules/layout.js';
import { saveConfiguration, loadConfiguration } from './modules/saveAndLoad.js';

// Initialize event listeners
setupEventListeners();

// Make functions globally accessible
window.addChannel = addChannel;
window.resetChannel = resetChannel;
window.adjustIframeSizes = adjustIframeSizes;
window.setGridView = setGridView;
window.saveConfiguration = (event) => {
  event.preventDefault();
  saveConfiguration(event);
};
window.loadConfiguration = (event) => {
  event.preventDefault();
  loadConfiguration(event);
};

// Call adjustIframeSizes on page load
document.addEventListener('DOMContentLoaded', () => {
  adjustIframeSizes();
});
