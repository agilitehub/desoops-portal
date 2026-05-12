import React from 'react'
import { Card, Typography } from 'antd'

/**
 * Placeholder route for the Wallet toolbar destination (URL-driven shell).
 */
const WalletDashboard = () => (
  <div style={{ padding: 24 }}>
    <Card>
      <Typography.Title level={4}>Wallet</Typography.Title>
      <Typography.Paragraph type='secondary'>
        Wallet tools and balances will appear here.
      </Typography.Paragraph>
    </Card>
  </div>
)

export default WalletDashboard
