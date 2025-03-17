/**
 * CacheIndicator.js
 * Utility for showing when content is loaded from the cache
 */

let indicatorElement = null;
let hideTimeout = null;

/**
 * Create the cache indicator element in the DOM
 * @returns {HTMLElement} The created indicator element
 */
function createIndicator() {
  // If already exists, return it
  if (indicatorElement) {
    return indicatorElement;
  }
  
  // Create the indicator element
  indicatorElement = document.createElement('div');
  indicatorElement.className = 'cache-indicator';
  indicatorElement.textContent = 'Loading from cache';
  
  // Add to the DOM
  document.body.appendChild(indicatorElement);
  
  return indicatorElement;
}

/**
 * Show the cache indicator
 * @param {string} [message='Loading from cache'] - Optional custom message
 * @param {number} [duration=2000] - How long to show the indicator in ms
 */
export function showCacheIndicator(message = 'Loading from cache', duration = 2000) {
  // Create or get the indicator
  const indicator = createIndicator();
  
  // Update message
  indicator.textContent = message;
  
  // Clear any existing timeout
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  
  // Make visible
  indicator.classList.add('visible');
  
  // Hide after duration
  hideTimeout = setTimeout(() => {
    indicator.classList.remove('visible');
  }, duration);
}

/**
 * Initialize message passing with service worker to show cache indicator
 */
export function initCacheIndicator() {
  if (!navigator.serviceWorker) {
    return;
  }
  
  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'cache-hit') {
      showCacheIndicator(`Loaded from cache: ${event.data.url.split('/').pop()}`);
    }
  });
  
  // Tell the service worker we're listening for cache events
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'enableCacheNotifications'
    });
  }
} 