import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { DeSoIdentityProvider } from 'react-deso-protocol'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { ApolloProvider } from '@apollo/client/react'
import { RouterProvider } from 'react-router-dom'

// Utilities
import { initFirebase } from './core/infra/firebase-controller'
import Enums from './core/infra/enums'
import Store from './store'

// Import default Stylesheet for application
import './index.sass'
import { initAgilite } from './core/infra/agilite-controller'

import { appRouter } from './routes'

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
    const router = appRouter

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

init()
