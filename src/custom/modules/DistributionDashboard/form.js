import React, { memo, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// UI Components
import { Row, Col, Card, Space, Tag, Button, Dropdown, theme, message, Divider } from 'antd'

// Custom Components
import ContainerCard from '../../reusables/components/ContainerCard'
import QuickActionsCard from './QuickActionsCard'
import StepOneCard from './StepOneCard'
import StepTwoCard from './StepTwoCard'
import StepThreeCard from './StepThreeCard'
import WalletOverview from './WalletOverview'

// Custom Utils
import Enums from '../../lib/enums'
import { setupHodlers } from './controller'

const styleParams = {
  dividerStyle: { margin: '5px 0', borderBlockStart: 0 }
}

const initialState = {
  loading: false,
  isExecuting: false,
  distributeTo: Enums.values.EMPTY_STRING,
  distributionType: Enums.values.EMPTY_STRING,
  distributionAmount: Enums.values.EMPTY_STRING,
  allHodlers: [],
  finalHodlers: []
}

const reducer = (state, newState) => ({ ...state, ...newState })

const _BatchTransactionsForm = () => {
  const { token } = theme.useToken()
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const distDashboardState = useSelector((state) => state.custom.distDashboard)

  const [state, setState] = useReducer(reducer, initialState)

  const resetState = () => {
    setState(initialState)
  }

  const handleDistributeTo = async (distributeTo) => {
    let tmpResult = []
    let allHodlers = []
    let coinTotal = 0

    try {
      // If user selects the current value, do nothing
      if (distributeTo === state.distributeTo) return

      // Reset Dashboard State, as all values depend on this selection, especially if user selects nothing
      resetState()
      if (!distributeTo) return

      // Then, if user selects NFT or Post, no extra work is needed
      if (distributeTo === Enums.values.NFT || distributeTo === Enums.values.POST) {
        setState({ distributeTo })
        return
      }

      setState({ loading: true })
      tmpResult = await setupHodlers(desoData.profile, distributeTo)

      allHodlers = tmpResult.allHodlers
      coinTotal = tmpResult.coinTotal

      // Update State
      setState({ distributeTo, allHodlers, finalHodlers: allHodlers, coinTotal })
    } catch (e) {
      message.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionType = (distributionType) => {
    setState({ distributionType, distributionAmount: Enums.values.EMPTY_STRING })
  }

  return (
    <Row justify='center'>
      <Col xs={22} xl={20} xxl={16}>
        <ContainerCard title={'Distribution Dashboard'}>
          <Row gutter={12}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row>
                <Col span={24}>
                  <WalletOverview desoProfile={desoData.profile} />
                </Col>
              </Row>
              <Divider style={styleParams.dividerStyle} />
              <Row>
                <Col span={24}>
                  <StepOneCard
                    desoData={desoData}
                    state={state}
                    onDistributeTo={handleDistributeTo}
                    onDistributionType={handleDistributionType}
                    onSetState={setState}
                  />
                </Col>
              </Row>
              <Divider style={styleParams.dividerStyle} />
              <Row>
                <Col span={24}>
                  <StepTwoCard desoData={desoData} />
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
                  <StepThreeCard desoData={desoData} />
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
