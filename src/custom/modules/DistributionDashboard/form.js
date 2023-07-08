import React, { memo, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// UI Components
import { Row, Col, Card, Space, Tag, Button, Dropdown, theme, message, Divider } from 'antd'

// Custom Components
import ContainerCard from '../../reusables/components/ContainerCard'
import QuickActionsCard from './QuickActionsCard'

// Custom Utils
import { deviceDetect } from 'react-device-detect'
import Enums from '../../lib/enums'
import StartHereCard from './StartHereCard'
import ConditionsCard from './ConditionsCard'
import TransactionInfoCard from './TransactionInfoCard'

const styleParams = {
  dividerStyle: { margin: '5px 0', borderBlockStart: 0 }
}

const _BatchTransactionsForm = () => {
  const { token } = theme.useToken()
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)

  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    isMobile: deviceDetect().isMobile
  })

  return (
    <Row justify='center'>
      <Col xs={22} xl={20} xxl={16}>
        <ContainerCard title={'Distribution Dashboard'}>
          <Row gutter={12}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row>
                <Col span={24}>
                  <StartHereCard />
                </Col>
              </Row>
              <Divider style={styleParams.dividerStyle} />
              <Row>
                <Col span={24}>
                  <ConditionsCard desoData={desoData} />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row>
                <Col span={24}>
                  <QuickActionsCard desoData={desoData} />
                </Col>
              </Row>
              <Divider style={styleParams.dividerStyle} />
              <Row>
                <Col span={24}>
                  <TransactionInfoCard desoData={desoData} />
                </Col>
              </Row>
            </Col>
          </Row>
        </ContainerCard>
      </Col>
    </Row>
  )
}

const BatchTransactionsForm = memo(_BatchTransactionsForm)

export default BatchTransactionsForm
