// Import and configure the Firebase SDK
importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  const notificationTitle = payload.data.title || 'New Message'
  const notificationOptions = {
    body: payload.data.body || 'You have a new notification'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
