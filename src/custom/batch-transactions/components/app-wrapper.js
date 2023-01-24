import React, { lazy, Suspense, memo } from 'react'
import { Spin } from 'antd'

// Components Lazy Import
const BatchTransactionsForm = lazy(() => import('./form'))

const _AppWrapper = () => {
  return (
    <Suspense fallback={<Spin />}>
      <BatchTransactionsForm />
    </Suspense>
  )
}

const AppWrapper = memo(_AppWrapper)

export default AppWrapper
