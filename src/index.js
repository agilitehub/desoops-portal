import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import AgiliteReact from 'agilite-react'

import Store from './store'
import Enums from './utils/enums'

// VARIABLES
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  tmpAnalytics = getAnalytics(app)
}

// Initialize App
const App = () => {
  const state = useSelector((state) => state.agiliteReact)
  return <AgiliteReact state={state} />
}

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById(Enums.values.DIV_ROOT)
)

export const analytics = tmpAnalytics
