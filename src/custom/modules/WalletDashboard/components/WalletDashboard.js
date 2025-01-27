import React, { useState, useEffect } from 'react'
import { Layout, Card, Input, message, Tabs, Row, Col, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import BalanceOverview from './BalanceOverview'
import TokenCard from './TokenCard'

import styles from '../style.module.sass'
import { useSelector } from 'react-redux'

// Hooks
import { useOtherCrypto, usePrimaryTokens } from '../hooks/useWalletDashboard'

const { Content } = Layout

const WalletDashboard = () => {
  const desoData = useSelector((state) => state.custom.desoData)
  const primaryTokens = usePrimaryTokens(desoData)
  const otherCrypto = useOtherCrypto(desoData)

  const [totalBalance, setTotalBalance] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [creatorCoins, setCreatorCoins] = useState([])
  const [filteredCreatorCoins, setFilteredCreatorCoins] = useState([])

  const [daoTokens, setDAOTokens] = useState([])
  const [filteredDAOTokens, setFilteredDAOTokens] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setTotalBalance(
      primaryTokens.reduce((acc, token) => acc + token.value, 0) +
        otherCrypto.reduce((acc, token) => acc + token.value, 0) +
        creatorCoins.reduce((acc, token) => acc + token.value, 0) +
        daoTokens.reduce((acc, token) => acc + token.value, 0)
    )
  }, [primaryTokens, otherCrypto, creatorCoins, daoTokens])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const creatorCoins = formatTokens(desoData.profile.ccHodlings)
    const daoTokens = formatTokens(desoData.profile.daoHodlings)

    setCreatorCoins(creatorCoins)
    setFilteredCreatorCoins(creatorCoins)

    setDAOTokens(daoTokens)
    setFilteredDAOTokens(daoTokens)

    // eslint-disable-next-line
  }, [desoData.profile.daoHodlings, desoData.profile.ccHodlings])

  const formatTokens = (tokens) => {
    const tmpTokens = []

    tokens.map((token) =>
      tmpTokens.push({
        ...token,
        image: token.profilePicUrl,
        name: token.username,
        owned: token.tokenBalance,
        value: 0,
        priceUSD: 0
      })
    )

    return tmpTokens.filter((token) => token.publicKey !== desoData.profile.publicKey)
  }

  const handleSearchCreatorCoins = (value) => {
    setSearchText(value)
    setCurrentPage(1)
    const filtered = creatorCoins.filter((coin) => coin.username.toLowerCase().includes(value.toLowerCase()))
    setFilteredCreatorCoins(filtered)
  }

  const handleSearchDAOTokens = (value) => {
    setSearchText(value)
    setCurrentPage(1)
    const filtered = daoTokens.filter((token) => token.username.toLowerCase().includes(value.toLowerCase()))
    setFilteredDAOTokens(filtered)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    message.success('Public key copied to clipboard')
  }

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  const getPaginatedCreatorCoins = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredCreatorCoins.slice(startIndex, endIndex)
  }

  const getPaginatedDAOTokens = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredDAOTokens.slice(startIndex, endIndex)
  }

  return (
    <Layout>
      <Content>
        <BalanceOverview
          totalBalance={totalBalance}
          userProfile={desoData.profile}
          onCopyToClipboard={copyToClipboard}
        />
        <Card
          className={styles.card}
          title={
            <center>
              <h3>Primary Tokens</h3>
            </center>
          }
          size='small'
        >
          <Row justify='center' gutter={[12, 12]}>
            {primaryTokens.map((token) => (
              <Col xs={24} sm={12} md={10} lg={8}>
                <TokenCard key={token.name} token={token} type='primary' />
              </Col>
            ))}
          </Row>
        </Card>
        <Card className={styles.card} size='small'>
          <Tabs
            centered
            defaultActiveKey='crypto'
            items={[
              {
                key: 'crypto',
                label: 'Other Crypto',
                children: (
                  <Row justify='center' gutter={[12, 12]}>
                    {otherCrypto.map((token) => (
                      <Col xs={24} sm={24} md={12} lg={8} key={token.name}>
                        <TokenCard key={token.name} token={token} />
                      </Col>
                    ))}
                  </Row>
                )
              },
              {
                key: 'creator',
                label: 'Creator Coins',
                children: (
                  <>
                    <Row justify='center'>
                      <Col xs={24} md={12} lg={8}>
                        <Input
                          placeholder='Search Creator Coins'
                          prefix={<SearchOutlined />}
                          value={searchText}
                          onChange={(e) => handleSearchCreatorCoins(e.target.value)}
                          allowClear
                          style={{ marginBottom: '16px' }}
                        />
                      </Col>
                    </Row>
                    <Row justify='center' gutter={[12, 12]}>
                      {getPaginatedCreatorCoins().map((token) => (
                        <Col xs={24} sm={24} md={12} lg={8} key={token.name}>
                          <TokenCard key={token.name} token={token} />
                        </Col>
                      ))}
                      <Col span={24}>
                        <Pagination
                          align='center'
                          current={currentPage}
                          pageSize={pageSize}
                          total={filteredCreatorCoins.length}
                          showSizeChanger
                          onChange={handlePageChange}
                          onShowSizeChange={handlePageChange}
                        />
                      </Col>
                    </Row>
                  </>
                )
              },
              {
                key: 'dao',
                label: 'DAO Tokens',
                children: (
                  <>
                    <Row justify='center'>
                      <Col xs={24} md={12} lg={8}>
                        <Input
                          placeholder='Search DAO Tokens'
                          prefix={<SearchOutlined />}
                          value={searchText}
                          onChange={(e) => handleSearchDAOTokens(e.target.value)}
                          allowClear
                          style={{ marginBottom: '16px' }}
                        />
                      </Col>
                    </Row>
                    <Row justify='center' gutter={[12, 12]}>
                      {getPaginatedDAOTokens().map((token) => (
                        <Col xs={24} sm={24} md={12} lg={8} key={token.name}>
                          <TokenCard key={token.name} token={token} />
                        </Col>
                      ))}
                      <Col span={24}>
                        <Pagination
                          align='center'
                          current={currentPage}
                          pageSize={pageSize}
                          total={filteredCreatorCoins.length}
                          showSizeChanger
                          onChange={handlePageChange}
                          onShowSizeChange={handlePageChange}
                        />
                      </Col>
                    </Row>
                  </>
                )
              }
            ]}
          />
        </Card>
      </Content>
    </Layout>
  )
}

export default WalletDashboard
