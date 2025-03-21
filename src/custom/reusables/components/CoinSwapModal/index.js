// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React, { useState } from 'react'

import { Modal, Tabs, App } from 'antd'
import HeroSwap from './HeroSwap'
import StealthEX from './StealthEX'

const CoinSwapModal = ({ isOpen, onCloseModal, embedded = false, className, waveEffects }) => {
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
    modal.confirm({
      title: 'Warning',
      content: 'Are you sure you want to close Coin Swap and that your transactions have been completed?',
      okText: 'Confirm',
      okType: 'danger',
      onOk: () => {
        setTab('1')
        onCloseModal()
      }
    })
  }

  if (embedded) {
    return (
      <div className="embedded-coin-swap">
        <h2>Coin Swap</h2>
        {waveEffects}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Tabs onChange={setTab} items={tabItems} activeKey={tab} size='small' />
        </div>
      </div>
    )
  }

  return (
    <Modal
      title='Coin Swap'
      open={isOpen}
      onOk={handleOk}
      closeIcon={false}
      okText='Close'
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose
      className={className}
    >
      {waveEffects}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Tabs onChange={setTab} items={tabItems} activeKey={tab} size='small' />
      </div>
    </Modal>
  )
}

const app = ({ isOpen, onCloseModal, embedded = false }) => {
  return (
    <App>
      <CoinSwapModal isOpen={isOpen} onCloseModal={onCloseModal} embedded={embedded} />
    </App>
  )
}

export default app
