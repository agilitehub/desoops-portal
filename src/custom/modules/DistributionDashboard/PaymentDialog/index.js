import React, { useEffect, useReducer } from 'react'
import { Modal, Progress, Typography } from 'antd'
import { paymentModal } from '../data-models'

const { Title, Text } = Typography

const reducer = (state, newState) => ({ ...state, ...newState })

const PaymentModal = ({ isOpen, payments, executePayment }) => {
  const [state, setState] = useReducer(reducer, paymentModal())

  useEffect(() => {
    if (isOpen) {
      let successCount = 0
      let failCount = 0
      let remainingCount = 0
      let progress = 0

      executePayment().on('paymentProcessed', ({ success }) => {
        if (success) {
          successCount++
        } else {
          failCount++
        }

        remainingCount = payments.length - successCount - failCount
        progress = ((successCount + failCount) / payments.length) * 100

        setState({ successCount, failCount, remainingCount, progress })
      })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal open={isOpen} footer={null} closable={false}>
      <Title level={3}>Distribution In Progress. Please do not close your browser.</Title>
      <Progress percent={state.progress} />
      <Text>Payments: {payments.length}</Text>
      <Text>Successful: {state.successCount}</Text>
      <Text>Failed: {state.failCount}</Text>
      <Text>Remaining: {state.remainingCount}</Text>
      <div>{/* Here you can display any images or gifs or videos */}</div>
    </Modal>
  )
}

export default PaymentModal
