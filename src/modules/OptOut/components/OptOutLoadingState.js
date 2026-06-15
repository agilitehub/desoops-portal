import React from 'react'
import { Spin } from 'antd'

const OptOutLoadingState = ({ message }) => (
  <section aria-live='polite' aria-busy='true' aria-label={message}>
    <p className='mx-auto mb-12 max-w-2xl text-balance text-lg font-bold leading-snug text-foreground sm:mb-14 sm:text-xl'>
      {message}
    </p>
    <Spin size='large' className='app-loading-spin [&_.ant-spin-dot]:scale-150' />
  </section>
)

export default OptOutLoadingState
