import React, { useState, useEffect } from 'react'
import { Layout, Card, Input, List, message, Tabs, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import BalanceOverview from './BalanceOverview'
import TokenCard from './TokenCard'
import BottomNavigation from './BottomNavigation'
import { primaryTokens, otherCrypto, generateCreatorCoins } from '../data/tokens'

import styles from '../style.module.sass'

const { Content } = Layout

const WalletDashboard = () => {
  const [totalBalance] = useState(125750.45)
  const [isMobile, setIsMobile] = useState(false)
  const [creatorCoins, setCreatorCoins] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filteredCreatorCoins, setFilteredCreatorCoins] = useState([])

  const [userProfile] = useState({
    username: 'JohnJardin',
    profilePic:
      'https://blockproducer.deso.org/api/v0/get-single-profile-picture/BC1YLhmfDtNX88bmVdiWEypafM2nRcyFHMeoW9gy8TT5PbNCevXkT8L',
    publicKey: 'BC1YLgm1z1rURwQKbV1d3gtdMqHtKLVx6LAQgrqLv9HZP9DTqMSdKqS',
    creatorCoinPrice: 13.92,
    foundersReward: 15
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCreatorCoins(generateCreatorCoins())
    setFilteredCreatorCoins(generateCreatorCoins())
  }, [])

  const handleSearch = (value) => {
    setSearchText(value)
    const filtered = creatorCoins.filter((coin) => coin.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredCreatorCoins(filtered)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    message.success('Public key copied to clipboard')
  }

  return (
    <Layout>
      <Content>
        <div>
          <div>
            <BalanceOverview
              totalBalance={totalBalance}
              userProfile={userProfile}
              onCopyToClipboard={copyToClipboard}
            />
            <Card className={styles.card} title={<center>Primary Tokens</center>} size='small'>
              <Row justify='center' gutter={[12, 12]}>
                {primaryTokens.map((token) => (
                  <Col sm={24} md={12} lg={10} xl={8}>
                    <TokenCard key={token.name} token={token} type='primary' />
                  </Col>
                ))}
              </Row>
            </Card>
            <Card className={styles.card} size='small'>
              <Tabs
                size='small'
                centered
                defaultActiveKey='crypto'
                items={[
                  {
                    key: 'crypto',
                    label: 'Other Crypto',
                    children: (
                      <Row justify='center' gutter={[12, 12]}>
                        {otherCrypto.map((token) => (
                          <Col sm={24} md={12} lg={8}>
                            <TokenCard key={token.name} token={token} type='crypto' />
                          </Col>
                        ))}
                      </Row>
                    )
                  },
                  {
                    key: 'creator',
                    label: 'Creator Coins',
                    children: (
                      <div>
                        <Input
                          placeholder='Search creator coins'
                          prefix={<SearchOutlined />}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div>
                          <List
                            dataSource={filteredCreatorCoins}
                            renderItem={(token) => <TokenCard key={token.name} token={token} type='creator' />}
                            pagination={{
                              simple: true,
                              pageSize: 10,
                              size: 'small'
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </div>
        </div>
      </Content>
      <BottomNavigation />
    </Layout>
  )
}

export default WalletDashboard
