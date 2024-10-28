import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Utilities
import { initAgilite } from './custom/lib/agilite-controller'
import { initFirebase } from './custom/lib/firebase-controller'
import App from './custom/modules/CoreApp'
import OptOut, { loader as optOutLoader } from './custom/modules/OptOut'
import Enums from './custom/lib/enums'
import Store from './store'

// Import default Stylesheet for application
import './index.sass'

// TODO: Nullify console outputs for production
// if (process.env.NODE_ENV === Enums.values.ENV_PRODUCTION) {
//   console.error = function () {}
//   console.log = function () {}
//   console.warn = function () {}
//   console.info = function () {}
// }

// Init Apollo Client
const client = new ApolloClient({
  uri: Enums.values.GQL_API_URL,
  cache: new InMemoryCache()
})

// Initiate Controllers
initAgilite()
initFirebase()

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
        <RouterProvider router={router} />
      </DeSoIdentityProvider>
    </ApolloProvider>
  </Provider>
)
