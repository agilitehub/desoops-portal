// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

const CACHE_NAME = 'app-cache-v1'
const messaging = firebase.messaging()

const CACHE_URLS = [
  '/',
  '/index.html',
  '/version.json',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add other critical assets
];

// Helper function for cache operations
const safeCacheOpen = async (cacheName) => {
  try {
    return await caches.open(cacheName);
  } catch (error) {
    console.error('Cache open failed:', error);
    throw error;
  }
};

// Function to get current version from version.json
const getCurrentVersion = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('/version.json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    return `${CACHE_NAME}-${data.version}`;
  } catch (error) {
    console.error('Error fetching version:', error);
    return CACHE_NAME;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
  event.waitUntil(
    getCurrentVersion().then((versionedCacheName) => {
      return safeCacheOpen(versionedCacheName).then((cache) => {
        return cache.addAll(CACHE_URLS)
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    getCurrentVersion().then((currentCacheName) => {
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith(CACHE_NAME) && cacheName !== currentCacheName) {
              return caches.delete(cacheName)
            }
            return Promise.resolve()
          })
        )
      })
    })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone()
          return safeCacheOpen(CACHE_NAME)
            .then(cache => {
              return cache.put(event.request, responseToCache)
                .then(() => response)
                .catch(error => {
                  console.error('Cache put failed:', error);
                  return response;
                });
            })
            .catch(error => {
              console.error('Cache open failed:', error);
              return response;
            });
        })
        .catch(() => caches.match(event.request))
    )
  } else {
    // Cache-first strategy for other requests
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response
          }
          return fetch(event.request)
            .then(response => {
              // Cache only successful responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
              }
              const responseToCache = response.clone()
              safeCacheOpen(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache)
              })
              return response
            })
        })
    )
  }
})

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }
  self.registration.showNotification(notificationTitle,
    notificationOptions)
})

// Check for updates periodically
const CHECK_INTERVAL = 60 * 1000; // 1 minute in milliseconds

// Track the last check time to prevent duplicate checks
let lastCheckTime = Date.now();

// Utility function for structured error logging
const logError = (context, error, details = {}) => {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    ...details
  };
  console.error('ServiceWorker Error:', errorInfo);
};

const checkForUpdates = async () => {
  try {
    const now = Date.now();
    if (now - lastCheckTime < CHECK_INTERVAL / 2) {
      return;
    }
    lastCheckTime = now;

    let newVersion;
    try {
      newVersion = await getCurrentVersion();
    } catch (error) {
      logError('getCurrentVersion', error, { lastCheckTime });
      return;
    }

    let cacheNames;
    try {
      cacheNames = await caches.keys();
    } catch (error) {
      logError('getCacheKeys', error, { newVersion });
      return;
    }

    const currentCache = cacheNames.find(name =>
      name.startsWith(CACHE_NAME) && name !== newVersion
    );

    if (currentCache) {
      let clients;
      try {
        clients = await self.clients.matchAll();
      } catch (error) {
        logError('getClients', error, {
          currentCache,
          newVersion,
          cacheNames
        });
        return;
      }

      if (clients.length > 0) {
        const message = {
          type: 'VERSION_UPDATE',
          version: newVersion,
          timestamp: now,
          previousVersion: currentCache.replace(`${CACHE_NAME}-`, '')
        };

        const messageResults = await Promise.allSettled(
          clients.map(async (client) => {
            try {
              await client.postMessage(message);
              return { clientId: client.id, status: 'success' };
            } catch (error) {
              logError('clientMessage', error, {
                clientId: client.id,
                message
              });
              return { clientId: client.id, status: 'error', error };
            }
          })
        );

        // Log summary of message delivery
        const failedClients = messageResults
          .filter(result => result.value?.status === 'error')
          .map(result => result.value.clientId);

        if (failedClients.length > 0) {
          logError('messageSummary', new Error('Some clients failed to receive update'), {
            totalClients: clients.length,
            failedClients,
            message
          });
        }
      }
    }
  } catch (error) {
    logError('checkForUpdates', error, {
      lastCheckTime,
      currentTime: Date.now()
    });
  }
};

// Initial check on service worker activation
self.addEventListener('activate', event => {
  event.waitUntil(checkForUpdates());
});

// Periodic checks
setInterval(checkForUpdates, CHECK_INTERVAL);
