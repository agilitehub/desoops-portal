import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import CoreApp from './modules/CoreApp'
import DistributionDashboard from './modules/DistributionDashboard'
import WalletDashboard from './modules/WalletDashboard'
import OptOut, { loader as optOutLoader } from './modules/OptOut'
import { ROUTE_SEGMENTS } from './constants/paths'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <CoreApp />,
    children: [
      { index: true, element: <Navigate to={ROUTE_SEGMENTS.DISTRIBUTE} replace /> },
      { path: ROUTE_SEGMENTS.DISTRIBUTE, element: <DistributionDashboard /> },
      { path: ROUTE_SEGMENTS.WALLET, element: <WalletDashboard /> }
    ]
  },
  {
    path: '/optout/:publicKey?',
    element: <OptOut />,
    loader: optOutLoader
  }
])
