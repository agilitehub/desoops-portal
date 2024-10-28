import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import Enums from './enums'

// Initialize Firebase
let analytics = null
let messaging = null

export const initFirebase = () => {
  if (process.env.REACT_APP_FIREBASE_ENABLED === Enums.values.YES) {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    }

    const app = initializeApp(firebaseConfig)
    analytics = getAnalytics(app)

    // Initialize Firebase Cloud Messaging
    messaging = getMessaging(app)

    onMessage(messaging, (payload) => {
      console.log('incoming msg', payload)
    })
  }
}

const requestForPushNotifications = async (setToken) => {
  const permission = await Notification.requestPermission()

  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    })

    //We can send token to server
    console.log('Token generated : ', token)
    setToken(token)
  } else if (permission === 'denied') {
    //notifications are blocked
    alert('You denied for the notification')
  }
}

export { messaging, analytics, requestForPushNotifications }
