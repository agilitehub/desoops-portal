import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { ColorModeProvider } from '@chakra-ui/color-mode'

// Utilities
import { initAgilite } from './custom/lib/agilite-controller'
import Store from './store'
// import Core from './core/components/core'
import App from './custom/app'
import Enums from './custom/lib/enums'

import './custom/styles/index.sass'

// Nullify console outputs for production
if (process.env.NODE_ENV === 'production') {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}
  console.info = function () {}
}

// Initiate Agilite Controller
initAgilite()

// Initialize Firebase
let tmpAnalytics = null

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
  tmpAnalytics = getAnalytics(app)
}

// Initialize App
// const App = () => {
//   const state = useSelector((state) => state.core)
//   return <Core state={state} />
// }
const root = createRoot(document.getElementById(Enums.values.DIV_ROOT))

root.render(
  <Provider store={Store}>
    <DeSoIdentityProvider>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </DeSoIdentityProvider>
  </Provider>
)

export const analytics = tmpAnalytics
