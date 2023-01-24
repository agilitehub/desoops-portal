import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import AgiliteReact from 'agilite-react'

import Store from './store'

const firebaseConfig = {
  apiKey: 'AIzaSyBc-VhHqPFEdRAlM1a9DvmQW8Otd27-wvA',
  authDomain: 'creator-admin-portal.firebaseapp.com',
  projectId: 'creator-admin-portal',
  storageBucket: 'creator-admin-portal.appspot.com',
  messagingSenderId: '349812102549',
  appId: '1:349812102549:web:fdaac9f8743da1fbc4d29c',
  measurementId: 'G-Y7M5F17B9N'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize App
const App = () => {
  const state = useSelector((state) => state.agiliteReact)
  return <AgiliteReact state={state} />
}

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

export const analytics = getAnalytics(app)
