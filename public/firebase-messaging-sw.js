importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyB8jidJZvQ6dm0xP6IRCEaw24XScVbzY6U',
  authDomain: 'deso-ops-portal.firebaseapp.com',
  projectId: 'deso-ops-portal"',
  storageBucket: 'deso-ops-portal.appspot.com',
  messagingSenderId: '1017377581725',
  appId: '1:1017377581725:web:cc17d5f762838642b38274'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
