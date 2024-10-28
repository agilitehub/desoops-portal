importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

// // Initialize Firebase app
// firebase.initializeApp(defaultConfig)
const messaging = firebase.messaging()

//Listens for background notifications
// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message: ', payload)

//   //customise notification
//   const notificationTitle = payload.notification.title
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon || '/icon.png'
//   }

//   self.registration.showNotification(notificationTitle, notificationOptions)
// })
