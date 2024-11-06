import React from 'react'
import { Card, Row, Col } from 'antd'

const WalletOverviewCard = ({ desoProfile, deviceType }) => {
  const { desoBalance, desoBalanceUSD, daoBalance, ccBalance } = desoProfile

  // Format Values
  const formattedDaoBalance = daoBalance.toLocaleString('en-US', { useGrouping: true })

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { background: '#DDE6ED', minHeight: deviceType.isSmartphone ? 30 : 40 },
    bodyStyle: { height: deviceType.isSmartphone ? 58 : deviceType.isTablet ? 70 : 75 },
    rowWrapper: { textAlign: 'center', marginTop: deviceType.isSmartphone ? 0 : deviceType.isTablet ? 4 : 4 },
    divWrapper: {
      backgroundColor: '#FFA07A',
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: '5px',
      fontSize: deviceType.isSmartphone ? 11 : deviceType.isTablet ? 13 : 14
    },
    backgroundColor: '#FFA07A',
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
      <Row gutter={[5, 5]} style={styleProps.rowWrapper}>
        <Col span={8}>
          <div style={styleProps.divWrapper}>
            <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>$DESO</div>
            <div style={{ color: styleProps.textColor, marginTop: -5 }}>{`${desoBalance} (~$${desoBalanceUSD})`}</div>
          </div>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <div style={styleProps.divWrapper}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>DAO Token</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>{formattedDaoBalance}</div>
            </div>
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <div style={styleProps.divWrapper}>
              <div style={{ color: styleProps.textColor, fontWeight: 'bold' }}>Creator Coin</div>
              <div style={{ color: styleProps.textColor, marginTop: -5 }}>{ccBalance}</div>
            </div>
          </Col>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletOverviewCard
