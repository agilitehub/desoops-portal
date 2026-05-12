import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import Enums from './enums'

let analytics = null
let messaging = null
let firebaseApp = null

export const initFirebase = async () => {
  if (process.env.REACT_APP_FIREBASE_ENABLED !== Enums.values.YES) {
    return null
  }

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  }

  try {
    firebaseApp = initializeApp(firebaseConfig)
    analytics = getAnalytics(firebaseApp)
    return { app: firebaseApp, analytics }
  } catch (error) {
    console.error('Firebase initialization failed:', error)
    throw error
  }
}

// New function to initialize messaging after user gesture
export const initializeMessaging = async () => {
  try {
    // First check if the service worker is registered
    let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')

    if (!registration) {
      registration = await registerServiceWorker()
    }

    if (!messaging) {
      messaging = getMessaging(firebaseApp)

      // Handle foreground messages, but exclude iOS. Note this logic is needed for iOS for the Safari Push Notification handler to work
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload)
        // For iOS standalone mode (installed to home screen), manually show notification
        // if (navigator.standalone) {
        //   new Notification(payload.data.title || 'New Message', {
        //     body: payload.data.body || 'You have a new notification'
        //   })
        //   return
        // }

        // TODO: Handle non-iOS standalone notifications here

      })

      // For iOS PWA, also set up Safari Push Notification handler
      // if (PWA_CONFIG.env.isIOS && PWA_CONFIG.env.isInstalled) {
      //   navigator.serviceWorker.addEventListener('message', (event) => {
      //     // TODO: Handle the notification data here
      //     console.log('Safari Push message received:', event.data)
      //   })
      // }
    }

    // Check for existing token before requesting a new one
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    })

    return token
  } catch (error) {
    console.error('Messaging initialization failed:', error)
    return null
  }
}

const registerServiceWorker = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported')
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    })

    await navigator.serviceWorker.ready
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    throw error
  }
}


export { analytics, messaging }
