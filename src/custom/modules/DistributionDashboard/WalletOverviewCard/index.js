import React from 'react'
import { Card, Row, Col } from 'antd'

const WalletOverviewCard = ({ desoProfile }) => {
  const { desoBalance, desoBalanceUSD, daoBalance, ccBalance } = desoProfile

  // Format Values
  const formattedDaoBalance = daoBalance.toLocaleString('en-US', { useGrouping: true })

  return (
    <Card title='Wallet Overview' size='small' bodyStyle={{ height: 75 }}>
      <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
        <Col span={8}>
          <Col span={24}>
            <div
              style={{ backgroundColor: '#FFA07A', paddingTop: 2, paddingBottom: 2, borderRadius: '5px', fontSize: 14 }}
            >
              <div style={{ color: '#F3F3F3', fontWeight: 'bold' }}>$DESO</div>
              <div style={{ color: '#F3F3F3', marginTop: -5 }}>{`${desoBalance} (~$${desoBalanceUSD})`}</div>
            </div>
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <div
              style={{ backgroundColor: '#FFA07A', paddingTop: 2, paddingBottom: 2, borderRadius: '5px', fontSize: 14 }}
            >
              <div style={{ color: '#F3F3F3', fontWeight: 'bold' }}>DAO Token</div>
              <div style={{ color: '#F3F3F3', marginTop: -5 }}>{formattedDaoBalance}</div>
            </div>
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <div
              style={{ backgroundColor: '#FFA07A', paddingTop: 2, paddingBottom: 2, borderRadius: '5px', fontSize: 14 }}
            >
              <div style={{ color: '#F3F3F3', fontWeight: 'bold' }}>Creator Coin</div>
              <div style={{ color: '#F3F3F3', marginTop: -5 }}>{ccBalance}</div>
            </div>
          </Col>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletOverviewCard
