import React, { memo, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// UI Components
import { Row, Col, Card, Space, Tag, Button, Dropdown, theme, message, Divider } from 'antd'

// Custom Components
import ContainerCard from '../../reusables/components/ContainerCard'
import WalletOverviewCard from './WalletOverviewCard'
import SetupCard from './SetupCard'
import QuickActionsCard from './QuickActionsCard'
import StepThreeCard from './StepThreeCard'

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
  rulesEnabled: false,
  tokenToUse: Enums.values.EMPTY_STRING,
  spreadAmountBasedOn: 'Ownership',
  filterUsers: false,
  filterAmountIs: '>',
  filterAmount: '',
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

  // Use a useEffect hook to determine if state.rulesEnabled should be True or False
  // rulesEnabled state is dependent on state.distributeTo, state.distributionType, and state.tokenToUse having values
  useEffect(() => {
    let rulesEnabled = false

    if (state.distributeTo && state.distributionType) {
      if (state.distributionType === Enums.paymentTypes.DAO || state.distributionType === Enums.paymentTypes.CREATOR) {
        console.log('1', state.tokenToUse)
        if (state.tokenToUse) rulesEnabled = true
      } else {
        console.log('2', state.distributionType)
        rulesEnabled = true
      }
    }

    if (state.rulesEnabled !== rulesEnabled) setState({ rulesEnabled })
  }, [state.distributeTo, state.distributionType, state.tokenToUse]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setState({ distributionType, tokenToUse: Enums.values.EMPTY_STRING, distributionAmount: Enums.values.EMPTY_STRING })
  }

  const handleTokenToUse = (tokenToUse) => {
    setState({ tokenToUse, distributionAmount: Enums.values.EMPTY_STRING })
  }

  return (
    <Row justify='center'>
      <Col xs={22} xl={20} xxl={16}>
        <ContainerCard title={'Distribution Dashboard'}>
          <Row gutter={12}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row>
                <Col span={24}>
                  <WalletOverviewCard desoProfile={desoData.profile} />
                </Col>
              </Row>
              <Divider style={styleParams.dividerStyle} />
              <Row>
                <Col span={24}>
                  <SetupCard
                    desoData={desoData}
                    state={state}
                    onDistributeTo={handleDistributeTo}
                    onDistributionType={handleDistributionType}
                    onTokenToUse={handleTokenToUse}
                    onSetState={setState}
                  />
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
                  <StepThreeCard desoData={desoData} state={state} onSetState={setState} />
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
