import { setupEventListeners } from './modules/eventListeners.js';
import { addChannel, resetChannel } from './modules/channelManagement.js';

// Initialize event listeners
setupEventListeners();

// Make addChannel and resetChannel globally accessible
window.addChannel = addChannel;
window.resetChannel = resetChannel;
