import React from 'react'
import { Card, Space, Button, Typography, Avatar, Tag, Row, Col } from 'antd'
import { SwapOutlined, ShoppingCartOutlined, SyncOutlined } from '@ant-design/icons'

const { Text } = Typography

const TokenCard = ({ token, type = 'primary' }) => (
  <Row>
    <Col span={24}>
      <Card styles={{ body: { padding: '16px' } }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Space size='middle'>
              <Avatar src={token.image} size={40} />
              <div>
                <Text strong>{token.name}</Text>
                <Text type='secondary'>
                  {token.owned.toLocaleString()} {token.name}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Tag color={token.change >= 0 ? 'success' : 'error'}>
              {token.change >= 0 ? '+' : ''}
              {token.change}%
            </Tag>
          </Col>
        </Row>
        <Row justify='center'>
          <Col>
            <Space>
              <Text strong>${token.value.toLocaleString()}</Text>
              <Text type='secondary'>${token.priceUSD.toFixed(2)} per token</Text>
            </Space>
          </Col>
        </Row>
        <Row justify='center' style={{ marginTop: '10px' }}>
          <Col>
            <Space>
              <Button type='default' size='middle' icon={<SwapOutlined />}>
                Send
              </Button>
              <Button type='default' size='middle' icon={<ShoppingCartOutlined />}>
                Buy
              </Button>
              <Button type='default' size='middle' icon={<SyncOutlined />}>
                Swap
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
)

export default TokenCard
