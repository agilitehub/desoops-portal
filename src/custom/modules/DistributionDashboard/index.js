import React, { lazy, Suspense, memo } from 'react'
import { Spin } from 'antd'

const Dashboard = lazy(() => import('./Dashboard'))

const _DistributionDashboard = () => {
  return (
    <Suspense fallback={<Spin />}>
      <Dashboard />
    </Suspense>
  )
}

const DistributionDashboard = memo(_DistributionDashboard)

export default DistributionDashboard
