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
    messaging = getMessaging(app)

    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload)
      })
    
    getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY }).then((currentToken) => {
        if (currentToken) {
            console.log('Firebase token:', currentToken)
            // Send the token to your server and update the UI if necessary
            // ...
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.')
            // ...
        }
    }).catch((err) => {
        console.log('Error requesting Firebase token', err)
    })
  }
}

export { analytics, messaging }