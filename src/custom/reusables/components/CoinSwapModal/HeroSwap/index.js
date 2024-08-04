import React, { useState } from 'react'

import { Row, Col, Spin, Alert, Space, Collapse } from 'antd'
import Enums from '../../../../lib/enums'
import { CaretRightOutlined } from '@ant-design/icons'

const HeroSwap = () => {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <Row style={{ height: '100%' }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Col span={24}>
          <Alert
            type='warning'
            message={
              <Collapse
                size='small'
                bordered={false}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                items={[
                  {
                    key: '1',
                    label: 'Important Notes:',
                    children: (
                      <Space>
                        <span>
                          1. Transactions usually take a few minutes, but can take up to an hour depending on HeroSwap's
                          Funding Pool.
                        </span>
                      </Space>
                    )
                  }
                ]}
              />
            }
          />
        </Col>
        <Col span={24} style={{ height: 450 }}>
          {isLoading && (
            <center
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <Spin />
              <span style={{ fontSize: 16, marginTop: 10 }}>Loading...</span>
            </center>
          )}
          <iframe
            title={Enums.coinSwap.heroSwap.title}
            style={{
              width: '100%',
              height: '100%',
              display: isLoading ? 'none' : 'block',
              border: 'none',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
            }}
            src={`${Enums.coinSwap.heroSwap.url}?depositTicker=${Enums.coinSwap.heroSwap.depositTicker}&destinationTicker=${Enums.coinSwap.heroSwap.destinationTicker}&affiliateAddress=${Enums.values.DESO_OPS_PUBLIC_KEY}`}
            onLoad={handleLoad}
          />
        </Col>
      </Space>
    </Row>
  )
}

export default HeroSwap
