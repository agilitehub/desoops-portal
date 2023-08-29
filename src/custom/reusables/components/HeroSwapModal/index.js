// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React from 'react'

import { Row, Modal, Col } from 'antd'
import Enums from '../../../lib/enums'

const HeroSwapModal = ({ isOpen, onCloseModal }) => {
  return (
    <Modal
      title='HeroSwap via DeSoOps'
      open={isOpen}
      onOk={onCloseModal}
      closeIcon={false}
      okText='Close'
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose
    >
      <Row style={{ height: 400 }}>
        <Col span={24}>
          <iframe
            title='DeSoOps Coin Swap'
            style={{ width: '100%', height: '100%' }}
            src={`https://heroswap.com/widget?depositTicker=SOL&destinationTicker=DESO&affiliateAddress=${Enums.values.DESO_OPS_PUBLIC_KEY}`}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default HeroSwapModal
