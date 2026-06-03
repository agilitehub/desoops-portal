import React from 'react'
import { Card, Row, Col } from 'antd'

const WalletOverviewCard = ({ desoProfile, deviceType }) => {
  const { desoBalance, desoBalanceUSD, focusBalance, focusBalanceUSD, daoBalance, ccBalance } = desoProfile

  const formattedDaoBalance = daoBalance.toLocaleString('en-US', { useGrouping: true })
  const focusUsdLabel =
    focusBalanceUSD != null && !Number.isNaN(focusBalanceUSD) ? focusBalanceUSD : '—'

  const colSpan = { xs: 12, sm: 12, md: 6, lg: 6 }
  const bodyMinHeight = deviceType.isSmartphone ? 64 : deviceType.isTablet ? 78 : 82

  return (
    <Card
      title={<span className='font-semibold text-foreground text-sm sm:text-base'>Wallet Overview</span>}
      size='small'
      className='dashboard-card h-full'
      styles={{ body: { minHeight: bodyMinHeight } }}
    >
      <Row gutter={[8, 8]} className='text-center'>
        <Col {...colSpan}>
          <div className='dashboard-stat-tile'>
            <div className='dashboard-stat-tile-label'>$DESO</div>
            <div className='dashboard-stat-tile-value'>{`${desoBalance} (~$${desoBalanceUSD})`}</div>
          </div>
        </Col>
        <Col {...colSpan}>
          <div className='dashboard-stat-tile'>
            <div className='dashboard-stat-tile-label'>Focus</div>
            <div className='dashboard-stat-tile-value'>{`${focusBalance} (~$${focusUsdLabel})`}</div>
          </div>
        </Col>
        <Col {...colSpan}>
          <div className='dashboard-stat-tile'>
            <div className='dashboard-stat-tile-label'>DAO Token</div>
            <div className='dashboard-stat-tile-value'>{formattedDaoBalance}</div>
          </div>
        </Col>
        <Col {...colSpan}>
          <div className='dashboard-stat-tile'>
            <div className='dashboard-stat-tile-label'>Creator Coin</div>
            <div className='dashboard-stat-tile-value'>{ccBalance}</div>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletOverviewCard
