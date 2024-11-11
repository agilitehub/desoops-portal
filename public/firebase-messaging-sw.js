// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

const CACHE_NAME = 'app-cache-v1'
const messaging = firebase.messaging()

// Function to get current version from version.json
const getCurrentVersion = async () => {
  try {
    const response = await fetch('/version.json')
    const data = await response.json()
    return `${CACHE_NAME}-${data.version}`
  } catch (error) {
    console.error('Error fetching version:', error)
    return CACHE_NAME
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    getCurrentVersion().then((versionedCacheName) => {
      return caches.open(versionedCacheName).then((cache) => {
        return cache.addAll(['/', '/index.html', '/version.json'])
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
          })
        )
      })
    })
  )
})

messaging.onBackgroundMessage(function (payload) {
  //     console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  // const notificationTitle = 'Background Message Title'
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/firebase-logo.png'
  // }
  // self.registration.showNotification(notificationTitle,
  //   notificationOptions)
})
