import React from 'react'
import { Card, Row, Col } from 'antd'

const WalletOverviewCard = ({ desoProfile, deviceType }) => {
  const { desoBalance, desoBalanceUSD, daoBalance, ccBalance } = desoProfile

  // Format Values
  const formattedDaoBalance = daoBalance.toLocaleString('en-US', { useGrouping: true })

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { background: '#DDE6ED', minHeight: deviceType.isSmartphone ? 30 : 40 },
    rowWrapper: { textAlign: 'center', marginTop: deviceType.isSmartphone ? 0 : deviceType.isTablet ? 4 : 4 },
    divWrapper: {
      backgroundColor: '#D63D00',
      padding: 2,
      borderRadius: '5px',
      fontSize: deviceType.isSmartphone ? 11 : deviceType.isTablet ? 13 : 14
    },
    backgroundColor: '#D63D00',
    backgroundColorDisabled: '#AAA',
    textColor: '#F3F3F3'
  }

  return (
    <Card
      title={<span style={styleProps.title}>Wallet Overview</span>}
      size='small'
      styles={{
        body: styleProps.bodyStyle,
        header: styleProps.headStyle
      }}
    >
      <Row
        gutter={[5, 5]}
        style={styleProps.rowWrapper}
        justify={deviceType.isSmartphone || deviceType.isTablet ? 'center' : 'space-between'}
      >
        <Col xs={12} md={8} lg={6} xl={4}>
          <div style={styleProps.divWrapper}>
            <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>$DESO</div>
            <div style={{ color: styleProps.textColor, marginTop: -5 }}>{`${desoBalance} (~$${desoBalanceUSD})`}</div>
          </div>
        </Col>
        <Col xs={12} md={8} lg={4}>
          <Col span={24}>
            <div style={styleProps.divWrapper}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>DAO Token</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>{formattedDaoBalance}</div>
            </div>
          </Col>
        </Col>
        <Col xs={12} md={8} lg={4}>
          <Col span={24}>
            <div style={styleProps.divWrapper}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>Creator Coin</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>{ccBalance}</div>
            </div>
          </Col>
        </Col>
        <Col xs={12} md={8} lg={4}>
          <Col span={24}>
            <div style={styleProps.divWrapper}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>dUSDC</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>{desoBalanceUSD}</div>
            </div>
          </Col>
        </Col>
        <Col xs={12} md={8} lg={4}>
          <Col span={24}>
            <div style={{ ...styleProps.divWrapper, backgroundColor: styleProps.backgroundColorDisabled }}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>Focus</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>
                <i>Coming Soon</i>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletOverviewCard
