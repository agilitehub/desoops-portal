import React from 'react'
import { Card, Space, Button, Typography, Avatar, Row, Col, Tooltip, Dropdown } from 'antd'
import { SwapOutlined, ShoppingCartOutlined, SyncOutlined, EllipsisOutlined } from '@ant-design/icons'

import styles from '../style.module.sass'

const { Text } = Typography

const TokenCard = ({ token }) => {
  const menuItems = [
    { key: 'comingSoon', label: 'Coming Soon!' },
    { key: 'send', icon: <SwapOutlined />, label: 'Send', disabled: true },
    { key: 'buy', icon: <ShoppingCartOutlined />, label: 'Buy', disabled: true },
    { key: 'swap', icon: <SyncOutlined />, label: 'Swap', disabled: true }
  ]

  return (
    <Row>
      <Col span={24}>
        <Card styles={{ body: { padding: '16px' } }}>
          <Row justify='end' style={{ marginBottom: -10, padding: 0 }}>
            <Col>
              {/* Mobile view */}
              <div className={styles['mobile-actions']}>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                  <EllipsisOutlined rotate={90} style={{ fontSize: '20px' }} />
                </Dropdown>
              </div>
            </Col>
          </Row>
          <Row justify='space-between' align='middle'>
            <Col>
              <Space size='middle'>
                <Avatar src={token.image} size={40} />
                <Space>
                  <Text strong>{token.name}</Text>
                  {!token.comingSoon ? (
                    <Text type='secondary'>
                      {token.owned.toLocaleString()} {token.name}
                    </Text>
                  ) : undefined}
                </Space>
              </Space>
            </Col>
          </Row>
          <Row justify='center'>
            <Col>
              {!token.comingSoon ? (
                <Space>
                  <Text strong>${token.value.toLocaleString()}</Text>
                  <Text type='secondary'>${token.priceUSD.toFixed(2)} per token</Text>
                </Space>
              ) : (
                <Text>
                  <i>Coming Soon!</i>
                </Text>
              )}
            </Col>
          </Row>
          <Row justify='center' style={{ marginTop: '10px' }}>
            <Col>
              <Tooltip title='Coming Soon' placement='bottom'>
                {/* Desktop view */}
                <Space className={styles['desktop-actions']}>
                  <Button disabled type='default' size='middle' icon={<SwapOutlined />}>
                    Send
                  </Button>
                  <Button disabled type='default' size='middle' icon={<ShoppingCartOutlined />}>
                    Buy
                  </Button>
                  <Button disabled type='default' size='middle' icon={<SyncOutlined />}>
                    Swap
                  </Button>
                </Space>
              </Tooltip>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default TokenCard
