import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { PWA_CONFIG } from '../modules/PWAManager/config'
import Enums from './enums'

let analytics = null
let messaging = null
let firebaseApp = null

const isMessagingSupported = () => {
  // First check if the required APIs are available
  if (!('Notification' in window)) {
    return false
  }

  if (!('serviceWorker' in navigator)) {
    return false
  }

  if (!('PushManager' in window)) {
    return false
  }

  // Check if it's iOS
  if (PWA_CONFIG.env.isIOS) {
    // For iOS, we need both:
    // 1. iOS 16.4+ Safari
    // 2. App installed to home screen
    const isPWA = PWA_CONFIG.env.isInstalled

    if (!isPWA) {
      return false
    }

    // Check if it's Safari and correct version
    const isIOSSafari = PWA_CONFIG.env.isIOSSafari
    const iosVersion = parseFloat((navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/) || [])[1])
    const isVersionSupported = iosVersion >= PWA_CONFIG.minIOSVersion

    if (!isIOSSafari) {
      return false
    }

    if (!isVersionSupported) {
      return false
    }

    return true
  }

  // For Android, check if it's Chrome or Firefox (main browsers supporting push)
  if (/android/i.test(navigator.userAgent)) {
    const isSupportedBrowser = /(chrome|firefox)/i.test(navigator.userAgent)
    if (!isSupportedBrowser) {
      return false
    }
  }

  // For desktop, most modern browsers are supported
  return true
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
  if (!firebaseApp || !isMessagingSupported()) {
    return null
  }

  try {
    // Check for existing service worker registration first
    let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')

    // Only register if we don't have one
    if (!registration) {
      registration = await registerServiceWorker()
    }

    messaging = getMessaging(firebaseApp)

    // Check for existing token before requesting a new one
    const existingToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    })

    if (existingToken) {
      console.log('Using existing FCM token:', existingToken)
    }

    // Handle foreground messages, but exclude iOS. Note this logic is needed for iOS for the Safari Push Notification handler to work
    onMessage(messaging, (payload) => {
      if (!PWA_CONFIG.env.isIOS) {
        // TODO: Handle the notification data here
        console.log('Foreground message received:', payload)
      }
    })

    // For iOS PWA, also set up Safari Push Notification handler
    if (PWA_CONFIG.env.isIOS && PWA_CONFIG.env.isInstalled) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        // TODO: Handle the notification data here
        console.log('Safari Push message received:', event.data)
      })
    }

    return messaging
  } catch (error) {
    console.error('Messaging initialization failed:', error)
    return null
  }
}

export const requestFirebaseToken = async () => {
  if (!messaging || !isMessagingSupported()) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
    if (!registration) {
      throw new Error('No service worker registration found')
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    })

    if (currentToken) {
      return currentToken
    }

    return null
  } catch (error) {
    console.error('Error requesting Firebase token:', error)
    throw error
  }
}

export { analytics, messaging }
