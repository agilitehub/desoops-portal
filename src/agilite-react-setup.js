import React, { Suspense } from 'react'
import { Spin } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

// Custom Imports
import Enums from './utils/enums'

// Custom Components
import BatchTransactions from './custom/batch-transactions/components/app-wrapper'

// Custom Reducers

export const initLeftMenuItems = () => {
  return [
    {
      key: Enums.tabKeys.BATCH_TRANSACTIONS,
      title: (
        <>
          <UnorderedListOutlined style={{ marginRight: 10 }} /> {Enums.appTitles.BATCH_TRANSACTIONS}
        </>
      )
    }
  ]
}

export const generateContent = (key) => {
  switch (key) {
    case Enums.tabKeys.BATCH_TRANSACTIONS:
      return {
        key,
        title: Enums.appTitles.BATCH_TRANSACTIONS,
        closable: true,
        content: (
          <Suspense fallback={<Spin />}>
            <BatchTransactions />
          </Suspense>
        )
      }
    default:
  }
}

export const initCustomReducers = () => {
  return {}
}
