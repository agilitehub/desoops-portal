import React from 'react'
import { Card, Space, Button, Typography, Avatar, Row, Col } from 'antd'
import { CopyOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import styles from '../style.module.sass'

const { Text } = Typography

const BalanceOverview = ({ totalBalance, userProfile, onCopyToClipboard }) => (
  <Card>
    <Row justify='space-around' className={styles.userRow}>
      <Col>
        <Space direction='vertical' size='large'>
          <Space size='middle'>
            <Avatar src={userProfile.profilePicUrl} size={48} />
            <Space direction='vertical' size={0}>
              <Text strong>{userProfile.username}</Text>
              <Button
                type='text'
                size='small'
                icon={<CopyOutlined />}
                onClick={() => onCopyToClipboard(userProfile.publicKey)}
              >
                <span>
                  {userProfile.publicKey.slice(0, 6)}...{userProfile.publicKey.slice(-4)}
                </span>
              </Button>
            </Space>
          </Space>
          <Button type='primary' icon={<ShoppingCartOutlined />} size='middle'>
            Purchase Creator Coin
          </Button>
        </Space>
      </Col>
      <Col className={styles.balanceCol}>
        <Text type='secondary'>Total Balance</Text>
        <h1 className={styles.balanceTitle}>${totalBalance.toLocaleString()}</h1>
        <Text type='secondary'>*Includes $USDC, $DESO, creator tokens and project tokens</Text>
      </Col>
    </Row>
  </Card>
)

export default BalanceOverview
