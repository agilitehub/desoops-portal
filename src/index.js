import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Utilities
import { initAgilite } from 'custom/lib/agilite-controller'
import Store from 'store'
import App from 'custom/modules/CoreApp'
import OptOut, { loader as optOutLoader } from 'custom/modules/OptOut'
import Enums from 'custom/lib/enums'

// Import default Stylesheet for application
import 'index.sass'

// Mantine UI Styles - https://mantine.dev/
import '@mantine/core/styles.css'

// Mantine UI Wrapper
import { MantineProvider } from '@mantine/core'

// Nullify console outputs for production
if (process.env.NODE_ENV === Enums.values.ENV_PRODUCTION) {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}
  console.info = function () {}
}

// Init Apollo Client
const client = new ApolloClient({
  uri: Enums.values.GQL_API_URL,
  cache: new InMemoryCache()
})

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

// Initialize Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
    // errorElement: <ErrorPage />
  },
  {
    path: 'optout/:publicKey?',
    element: <OptOut />,
    loader: optOutLoader
  }
])

// Initialize App
const root = createRoot(document.getElementById(Enums.values.DIV_ROOT))

root.render(
  <Provider store={Store}>
    <ApolloProvider client={client}>
      <DeSoIdentityProvider>
        <MantineProvider>
          <RouterProvider router={router} />
        </MantineProvider>
      </DeSoIdentityProvider>
    </ApolloProvider>
  </Provider>
)

export const analytics = tmpAnalytics
