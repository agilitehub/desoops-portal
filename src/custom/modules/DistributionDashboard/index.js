import React, { lazy, Suspense, memo } from 'react'
import { Spin } from 'antd'

const BatchTransactionsForm = lazy(() => import('./form'))

const _DistributionDashboard = () => {
  return (
    <Suspense fallback={<Spin />}>
      <BatchTransactionsForm />
    </Suspense>
  )
}

const DistributionDashboard = memo(_DistributionDashboard)

export default DistributionDashboard
