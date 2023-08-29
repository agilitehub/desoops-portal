// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React, { useState } from 'react'

import { Row, Modal, Col, Spin } from 'antd'
import Enums from '../../../lib/enums'

const HeroSwapModal = ({ isOpen, onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <Modal
      title='Swap Coins using HeroSwap'
      open={isOpen}
      onOk={onCloseModal}
      closeIcon={false}
      okText='Close'
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose
    >
      <Row style={{ height: 400 }}>
        <Col span={24}>
          {isLoading && (
            <center
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <Spin />
              <span style={{ fontSize: 16, marginTop: 10 }}>Loading...</span>
            </center>
          )}
          <iframe
            title='DeSoOps Coin Swap'
            style={{ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' }}
            src={`https://heroswap.com/widget?depositTicker=SOL&destinationTicker=DESO&affiliateAddress=${Enums.values.DESO_OPS_PUBLIC_KEY}`}
            onLoad={handleLoad}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default HeroSwapModal
