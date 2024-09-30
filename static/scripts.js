import { setupEventListeners } from './modules/eventListeners.js';
import { addChannel, resetChannel } from './modules/channelManagement.js';
import { adjustIframeSizes, setGridView } from './modules/layout.js';
import { saveConfiguration, loadConfiguration } from './modules/saveAndLoad.js';

setupEventListeners();

window.addChannel = addChannel;
window.resetChannel = resetChannel;
window.adjustIframeSizes = adjustIframeSizes;
window.setGridView = setGridView;
window.saveConfiguration = saveConfiguration;
window.loadConfiguration = loadConfiguration;

document.addEventListener('DOMContentLoaded', () => {
  adjustIframeSizes();
});
