/**
 * Service Worker Registration Utility
 * Handles registration and management of the service worker
 */

/**
 * Register the service worker for caching PNTS files
 * @returns {Promise<ServiceWorkerRegistration|null>} The registration object or null if failed
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported in this browser');
    
    return navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
        return null;
      });
  } else {
    console.warn('Service Worker is not supported in this browser');
    return Promise.resolve(null);
  }
}

/**
 * Manually clear the cache if needed
 * @returns {Promise<string>} A message indicating the result
 */
export function clearCache() {
  if (!navigator.serviceWorker.controller) {
    return Promise.resolve('No active service worker found');
  }
  
  return new Promise(resolve => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = event => {
      if (event.data && event.data.result) {
        resolve(event.data.result);
      }
    };
    
    navigator.serviceWorker.controller.postMessage(
      { action: 'clearCache' },
      [messageChannel.port2]
    );
  });
}

/**
 * Update the service worker
 * @returns {Promise<boolean>} Whether the update was successful
 */
export async function updateServiceWorker() {
  if (!navigator.serviceWorker) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to update service worker:', error);
    return false;
  }
} 