import React from 'react'

import { Row, Col, Alert, Space, Collapse } from 'antd'
import Enums from '../../../../lib/enums'
import { CaretRightOutlined } from '@ant-design/icons'

const StealthEX = () => {
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
                      <Space direction='vertical'>
                        <span>1. Please swap using the exact amount as stated in the payment details below.</span>
                        <span>2. A minimum amount of around $100 in tokens is required for any swap.</span>
                        <span>
                          3. Transactions can take up to an hour to complete depending on StealthEX's Funding Pool.
                        </span>
                        <span>
                          4. StealthEX performs liquidity maintenance from time to time, making certain exchange-pairs
                          temporarily unavailable.
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
          <iframe
            title={Enums.coinSwap.stealthEX.title}
            id={Enums.coinSwap.stealthEX.id}
            src={`${Enums.coinSwap.stealthEX.url}/${Enums.coinSwap.stealthEX.affiliateId}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0px 0px 32px 0px rgba(0, 0, 0, 0.06)'
            }}
          />
        </Col>
      </Space>
    </Row>
  )
}

export default StealthEX
