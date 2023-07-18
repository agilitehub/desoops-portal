import React, { memo, useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'

// UI Components
import { Row, Col, message, Divider } from 'antd'

// Custom Components
import ContainerCard from '../../reusables/components/ContainerCard'
import WalletOverviewCard from './WalletOverviewCard'
import SetupCard from './SetupCard'
import QuickActionsCard from './QuickActionsCard'
import SummaryCard from './SummaryCard'
import TableData from './TableData'

// Custom Utils
import Enums from '../../lib/enums'
import { calculateEstimatedPayment, setupHodlers, updateHodlers } from './controller'
import { initDistributionDashboardState } from '../../lib/templates'

const styleParams = {
  dividerStyle: { margin: '5px 0', borderBlockStart: 0 }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const _BatchTransactionsForm = () => {
  const desoData = useSelector((state) => state.custom.desoData)
  const [state, setState] = useReducer(reducer, initDistributionDashboardState())

  const resetState = () => {
    setState(initDistributionDashboardState())
  }

  // Use a useEffect hook to determine if state.rulesEnabled and state.distributionAmountEnabled should be True or False
  // state.rulesEnabled is dependent on state.distributeTo, state.distributionType, and state.tokenToUse having values
  // state.distributionAmountEnabled is dependent on state.distributeTo and state.distributionType having values, however...
  // ...if state.distributionType is DAO or CREATOR, then state.tokenToUse must also have a value
  useEffect(() => {
    let rulesEnabled = false
    let distributionAmountEnabled = false

    if (state.distributeTo && state.distributionType) {
      if ([Enums.paymentTypes.DAO, Enums.paymentTypes.CREATOR].includes(state.distributionType)) {
        if (state.tokenToUse) {
          rulesEnabled = true
          distributionAmountEnabled = true
        }
      } else {
        rulesEnabled = true
        distributionAmountEnabled = true
      }
    }

    setState({ rulesEnabled, distributionAmountEnabled })
  }, [state.distributeTo, state.distributionType, state.tokenToUse]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDistributeTo = async (distributeTo) => {
    let tmpResult = null
    let finalHodlers = null
    let selectedTableKeys = null
    let tokenTotal = 0

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
      tmpResult = await setupHodlers(
        desoData.profile,
        distributeTo,
        state.distributionAmount,
        state.spreadAmountBasedOn,
        desoData.desoPrice
      )

      finalHodlers = tmpResult.finalHodlers
      tokenTotal = tmpResult.tokenTotal
      selectedTableKeys = tmpResult.selectedTableKeys

      // Update State
      setState({ distributeTo, finalHodlers, tokenTotal, selectedTableKeys })
    } catch (e) {
      message.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionType = async (distributionType) => {
    const tmpHodlers = Array.from(state.finalHodlers)
    const tmpSelectedTableKeys = Array.from(state.selectedTableKeys)
    const tmpConditions = {
      filterUsers: false,
      filterAmountIs: '>',
      filterAmount: null
    }

    const { finalHodlers, selectedTableKeys, tokenTotal } = await updateHodlers(
      tmpHodlers,
      tmpSelectedTableKeys,
      tmpConditions,
      ''
    )

    setState({
      ...tmpConditions,
      finalHodlers,
      selectedTableKeys,
      tokenTotal,
      distributionType,
      tokenToUse: Enums.values.EMPTY_STRING,
      distributionAmount: null,
      spreadAmountBasedOn: 'Ownership'
    })
  }

  const handleTokenToUse = async (tokenToUse) => {
    const finalHodlers = Array.from(state.finalHodlers)
    await calculateEstimatedPayment(finalHodlers, '')
    setState({ finalHodlers, tokenToUse, distributionAmount: null })
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
                  <SummaryCard desoData={desoData} parentState={state} onSetState={setState} />
                </Col>
              </Row>
            </Col>
          </Row>
          {state.distributeTo ? (
            <Row>
              <TableData desoData={desoData} state={state} onSetState={setState} />
            </Row>
          ) : null}
        </ContainerCard>
      </Col>
    </Row>
  )
}

const BatchTransactionsForm = memo(_BatchTransactionsForm)

export default BatchTransactionsForm
