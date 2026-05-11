import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { ApolloProvider } from '@apollo/client/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Utilities
import { initFirebase } from './custom/lib/firebase-controller'
import App from './custom/modules/CoreApp'
import OptOut, { loader as optOutLoader } from './custom/modules/OptOut'
import Enums from './custom/lib/enums'
import Store from './store'

// Import default Stylesheet for application
import './index.sass'
import { initAgilite } from './custom/lib/agilite-controller'

// TODO: Nullify console outputs for production
// if (process.env.NODE_ENV === Enums.values.ENV_PRODUCTION) {
//   console.error = function () {}
//   console.log = function () {}
//   console.warn = function () {}
//   console.info = function () {}
// }

// Init Apollo Client
const client = new ApolloClient({
  link: new HttpLink({ uri: Enums.values.GQL_API_URL }),
  cache: new InMemoryCache()
})

const init = async () => {
  try {
    initAgilite()
    initFirebase()

    // Initialize Router after Firebase is ready
    const router = createBrowserRouter([
      {
        path: '/',
        element: <App />
      },
      {
        path: 'optout/:publicKey?',
        element: <OptOut />,
        loader: optOutLoader
      }
    ])

    // Render the app
    const root = createRoot(document.getElementById('root'))
    root.render(
      <React.StrictMode>
        <Provider store={Store}>
          <DeSoIdentityProvider>
            <ApolloProvider client={client}>
              <RouterProvider router={router} />
            </ApolloProvider>
          </DeSoIdentityProvider>
        </Provider>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Initialization failed:', error)
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
