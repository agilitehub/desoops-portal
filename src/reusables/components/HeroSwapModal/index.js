// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React, { useState } from 'react'
import { Row, Modal, Col, Spin } from 'antd'
import { useColorMode } from '@chakra-ui/color-mode'
import Enums from 'lib/enums'

import './style.sass'

const HeroSwapModal = ({ isOpen, onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { colorMode } = useColorMode()

  const handleLoad = () => {
    setIsLoading(false)
  }

  // URL Variables
  const url = process.env.REACT_APP_HERO_SWAP_URL
  const theme = colorMode === Enums.colorMode.LIGHT ? Enums.heroSwap.THEME_LIGHT : Enums.heroSwap.THEME_DARK
  const depositTicker = Enums.heroSwap.DESPOSIT_TICKER
  const destinationTicker = Enums.heroSwap.DESTINATION_TICKER
  const affiliateAddress = Enums.values.DESO_OPS_PUBLIC_KEY

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
      <Row className='cs-iframe-wrapper'>
        <Col span={24}>
          {isLoading && (
            <div className='cs-spin-wrapper'>
              <Spin />
              <span>Loading...</span>
            </div>
          )}
          <iframe
            title='DeSoOps Coin Swap'
            className='cs-iframe'
            style={{ display: isLoading ? 'none' : 'block' }}
            src={`${url}?depositTicker=${depositTicker}&destinationTicker=${destinationTicker}&affiliateAddress=${affiliateAddress}&theme=${theme}`}
            onLoad={handleLoad}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default HeroSwapModal
