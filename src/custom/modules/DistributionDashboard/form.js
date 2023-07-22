import React, { memo, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import { distributionDashboardState, paymentModal } from './data-models'
import { setDeSoData, setAgiliteData, updateNFTHodlers } from '../../reducer'
import { cloneDeep } from 'lodash'
import { generateProfilePicUrl, getDeSoData, getDeSoPricing, getDeSoUser } from '../../lib/deso-controller'
import PaymentModal from './PaymentModal'
import { getAgiliteData } from '../../lib/agilite-controller'

const styleParams = {
  dividerStyle: { margin: '5px 0', borderBlockStart: 0 }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const _BatchTransactionsForm = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const agiliteData = useSelector((state) => state.custom.agiliteData)
  const [state, setState] = useReducer(reducer, distributionDashboardState(agiliteData.transactionFeeUSD))

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

  const resetState = async () => {
    setState(distributionDashboardState(agiliteData.transactionFeeUSD))
  }

  const handleRefreshWallet = async () => {
    let desoBalance = 0
    let desoBalanceUSD = 0

    try {
      setState({ isExecuting: true })

      // First we retrieve configurations from Agilit-e
      const tmpAgiliteData = await getAgiliteData()
      dispatch(setAgiliteData(tmpAgiliteData))

      // Get User's DeSo Balance
      const currentUser = await getDeSoUser(desoData.profile.publicKey)

      // Get the rest of the DeSo Data TODO: This data is duplicated on app.js
      const tmpDeSoData = await getDeSoData(desoData.profile.publicKey, desoData, true)

      // Calculate the user's DeSo balance in DeSo and USD
      desoBalance = currentUser.Profile.DESOBalanceNanos / Enums.values.NANO_VALUE
      desoBalanceUSD = Math.floor(desoBalance * tmpDeSoData.desoPrice * 100) / 100
      desoBalance = Math.floor(desoBalance * 10000) / 10000

      // Add final pieces of user profile information to the DeSo data
      tmpDeSoData.profile = {
        ...tmpDeSoData.profile,
        username: currentUser.Profile.Username,
        profilePicUrl: await generateProfilePicUrl(currentUser.Profile.PublicKeyBase58Check),
        desoBalance,
        desoBalanceUSD
      }

      // Set the DeSo data in the redux store
      dispatch(setDeSoData(tmpDeSoData))

      // Update State
      setState({ isExecuting: false })
      return
    } catch (e) {
      message.error(e)
    }
  }

  const handleDistributeTo = async (distributeTo) => {
    let tmpHodlers = null

    try {
      // If user selects the current value, do nothing
      if (distributeTo === state.distributeTo) return

      // Reset Dashboard State, as all values depend on this selection, especially if user selects nothing
      resetState()
      if (!distributeTo) return

      // Then, if user selects NFT or Post, no extra work is needed
      if (distributeTo === Enums.values.NFT) {
        setState({ distributeTo, nftUrl: '', nftMetaData: {}, nftHodlers: [], openNftSearch: true })
        return
      }

      setState({ loading: true })

      // Fetch Hodlers that need to be set up
      switch (distributeTo) {
        case Enums.values.DAO:
          tmpHodlers = JSON.parse(JSON.stringify(desoData.profile.daoHodlers))
          break
        case Enums.values.CREATOR:
          tmpHodlers = JSON.parse(JSON.stringify(desoData.profile.ccHodlers))
          break
      }

      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(tmpHodlers)

      // Update State
      setState({ distributeTo, finalHodlers, tokenTotal, selectedTableKeys })
    } catch (e) {
      message.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionType = async (distributionType) => {
    const tmpHodlers = cloneDeep(state.finalHodlers)
    const tmpSelectedTableKeys = cloneDeep(state.selectedTableKeys)
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
    const finalHodlers = cloneDeep(state.finalHodlers)
    await calculateEstimatedPayment(finalHodlers, '')
    setState({ finalHodlers, tokenToUse, distributionAmount: null })
  }

  const handleConfirmNFT = async (nftMetaData, nftHodlers, nftUrl) => {
    try {
      setState({ loading: true })

      nftHodlers = cloneDeep(nftHodlers)
      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(nftHodlers)

      // Update States
      setState({ finalHodlers, tokenTotal, selectedTableKeys, nftMetaData, nftHodlers, nftUrl, openNftSearch: false })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handlePaymentDone = async () => {
    setState({ paymentModal: paymentModal() })
  }

  return (
    <>
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
                      rootState={state}
                      onDistributeTo={handleDistributeTo}
                      onDistributionType={handleDistributionType}
                      onTokenToUse={handleTokenToUse}
                      setRootState={setState}
                      onConfirmNFT={handleConfirmNFT}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Row>
                  <Col span={24}>
                    <QuickActionsCard
                      desoData={desoData}
                      onResetDashboard={resetState}
                      onRefreshWallet={handleRefreshWallet}
                      rootState={state}
                    />
                  </Col>
                </Row>
                <Divider style={styleParams.dividerStyle} />
                <Row>
                  <Col span={24}>
                    <SummaryCard
                      desoData={desoData}
                      agiliteData={agiliteData}
                      rootState={state}
                      setRootState={setState}
                      onRefreshWallet={handleRefreshWallet}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {state.distributeTo ? (
              <Row>
                <TableData desoData={desoData} rootState={state} setRootState={setState} />
              </Row>
            ) : null}
          </ContainerCard>
        </Col>
      </Row>
      <PaymentModal props={state.paymentModal} onPaymentDone={handlePaymentDone} />
    </>
  )
}

const BatchTransactionsForm = memo(_BatchTransactionsForm)

export default BatchTransactionsForm
