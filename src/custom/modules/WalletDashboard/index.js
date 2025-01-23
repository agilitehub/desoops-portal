import React from 'react'

import { Row, Col } from 'antd'
import { useSelector } from 'react-redux'

// Components
import ContainerCard from '../../reusables/components/ContainerCard'

// Utils
import WalletDashboard from './components/WalletDashboard'

const WalletDashboardWrapper = () => {
  const { isTablet, isSmartphone, isMobile } = useSelector((state) => state.custom.userAgent)

  const mobileType = { isSmartphone, isTablet, isMobile }

  return (
    <>
      <Row justify='center' gutter={[12, 12]}>
        <Col xs={22} xl={20} xxl={16}>
          <ContainerCard title={'Wallet Dashboard'} deviceType={mobileType}>
            <WalletDashboard />
          </ContainerCard>
        </Col>
      </Row>
      <div style={{ height: '100px' }}></div>
    </>
  )
}

export default WalletDashboardWrapper
