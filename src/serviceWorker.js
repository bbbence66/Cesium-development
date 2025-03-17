/**
 * Service Worker for ScanAudit Cesium Viewer
 * This service worker handles caching of 3D tileset files (PNTS) for faster loading
 * on subsequent visits.
 */

const CACHE_NAME = 'scanaudit-cesium-cache-v1';

// Files to cache immediately on service worker installation
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/runtime.js',
  '/vendors.js',
  '/app.js'
];

// Regex pattern to identify tileset files we want to cache (PNTS)
const TILESET_REGEX = /\.pnts($|\?)/i;

// Known tileset base URLs to ensure we only cache files from trusted sources
const KNOWN_TILESET_ORIGINS = [
  'scanaudit.s3.amazonaws.com'
];

// Whether to notify clients about cache hits
let notifyCacheHits = false;

// Helper function to send cache hit notifications to clients
function notifyClientsAboutCacheHit(url) {
  if (!notifyCacheHits) return;
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'cache-hit',
        url: url
      });
    });
  });
}

// Install event - cache the static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static files');
        // We use addAll for the essential files that should be cached immediately
        return cache.addAll(STATIC_CACHE_FILES);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  
  // Ensure the service worker takes control immediately
  return self.clients.claim();
});

// Helper function to determine if a URL should be cached
function shouldCacheUrl(url) {
  const urlObj = new URL(url);
  
  // Check if this is from one of our known tileset sources
  const isKnownOrigin = KNOWN_TILESET_ORIGINS.some(origin => 
    urlObj.hostname.includes(origin)
  );
  
  // Check if this is a PNTS file
  const isPntsFile = TILESET_REGEX.test(urlObj.pathname);
  
  return isKnownOrigin && isPntsFile;
}

// Fetch event - serve from cache or fetch and cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = event.request.url;
  
  // For PNTS files from our known tileset sources, use cache-first strategy
  if (shouldCacheUrl(url)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // If found in cache, return the cached response
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', url);
          
          // Notify clients about the cache hit
          notifyClientsAboutCacheHit(url);
          
          return cachedResponse;
        }
        
        // Otherwise fetch and cache
        return fetch(event.request)
          .then(response => {
            // If bad response, just return it
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('[Service Worker] Caching new resource:', url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed:', error);
            // Here you could return a fallback if you have one
          });
      })
    );
  } else {
    // For other requests, use network first with cache fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache the resource if it's a successful HTML, CSS, or JS response
          if (response.status === 200 && 
              (response.headers.get('content-type')?.includes('text/html') ||
               response.headers.get('content-type')?.includes('text/css') ||
               response.headers.get('content-type')?.includes('application/javascript'))) {
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request);
        })
    );
  }
});

// Listen for messages from the client
self.addEventListener('message', event => {
  // Handle clear cache request
  if (event.data && event.data.action === 'clearCache') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[Service Worker] Cache cleared by user request');
      event.ports[0].postMessage({ result: 'Cache cleared' });
    });
  }
  
  // Handle enable cache notifications
  if (event.data && event.data.action === 'enableCacheNotifications') {
    notifyCacheHits = true;
    console.log('[Service Worker] Cache hit notifications enabled');
  }
}); 