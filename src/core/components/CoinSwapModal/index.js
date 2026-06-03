// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React, { useState } from 'react'

import { Modal, Tabs, App } from 'antd'
import { showConfirm } from 'core/utils/confirmModal'
import HeroSwap from './HeroSwap'
import StealthEX from './StealthEX'

const CoinSwapModal = ({ isOpen, onCloseModal }) => {
  const { modal } = App.useApp()
  const [tab, setTab] = useState('1')

  const tabItems = [
    {
      key: '1',
      label: 'HeroSwap',
      children: <HeroSwap />
    },
    {
      key: '2',
      label: 'StealthEX',
      children: <StealthEX />
    }
  ]

  const handleOk = () => {
    showConfirm(modal, {
      title: 'Close Coin Swap?',
      content: 'Are you sure you want to close Coin Swap and that your transactions have been completed?',
      okText: 'Yes, close',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: () => {
        setTab('1')
        onCloseModal()
      }
    })
  }

  return (
    <Modal
      title={
        <span className='coin-swap-modal-title'>
          Coin{' '}
          <span className='text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit] text-deso-orange'>
            Swap
          </span>
        </span>
      }
      open={isOpen}
      onOk={handleOk}
      closeIcon={false}
      okText='Close'
      width={600}
      centered
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ className: 'coin-swap-close-btn' }}
      destroyOnClose
      classNames={{
        content: 'coin-swap-modal-content',
        header: 'coin-swap-modal-header',
        body: 'coin-swap-modal-body',
        footer: 'coin-swap-modal-footer'
      }}
    >
      <Tabs onChange={setTab} items={tabItems} activeKey={tab} size='small' />
    </Modal>
  )
}

const app = ({ isOpen, onCloseModal }) => {
  return (
    <App>
      <CoinSwapModal isOpen={isOpen} onCloseModal={onCloseModal} />
    </App>
  )
}

export default app
