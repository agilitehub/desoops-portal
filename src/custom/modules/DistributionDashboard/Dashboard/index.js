import React, { memo, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeepDiff } from 'deep-diff'
// UI Components
import { Row, Col, message, Divider } from 'antd'

// Custom Components
import ContainerCard from '../../../reusables/components/ContainerCard'
import WalletOverviewCard from '../WalletOverviewCard'
import SetupCard from '../SetupCard'
import QuickActionsCard from '../QuickActionsCard'
import SummaryCard from '../SummaryCard'
import TableData from '../TableData'

// Custom Utils
import Enums from '../../../lib/enums'
import { calculateEstimatedPayment, prepDistributionTemplate, setupHodlers } from '../controller'
import { customListModal, distributionDashboardState, paymentModal } from '../data-models'
import { setDeSoData, setConfigData, setDistributionTemplates } from '../../../reducer'
import { cloneDeep } from 'lodash'
import {
  getCCHodlersAndBalance,
  getDAOHodlersAndBalance,
  getInitialDeSoData,
  processTokenHodlers
} from '../../../lib/deso-controller-graphql'
import PaymentModal from '../PaymentModal'
import {
  createDistributionTemplate,
  deleteDistributionTemplate,
  getConfigData,
  updateDistributionTemplate
} from '../../../lib/agilite-controller'
import { useApolloClient } from '@apollo/client'
import { GET_HODLERS, GQL_GET_INITIAL_DESO_DATA, GQL_GET_TOKEN_HOLDERS } from 'custom/lib/graphql-models'
import { buildGQLProps } from 'custom/lib/utils'

const reducer = (state, newState) => ({ ...state, ...newState })

const _BatchTransactionsForm = () => {
  const dispatch = useDispatch()
  const desoData = useSelector((state) => state.custom.desoData)
  const configData = useSelector((state) => state.custom.configData)
  const distributionTemplates = useSelector((state) => state.custom.distributionTemplates)
  const client = useApolloClient()
  const [state, setState] = useReducer(reducer, distributionDashboardState(configData.feePerTransactionUSD))
  const { isTablet, isSmartphone, isMobile } = useSelector((state) => state.custom.userAgent)

  const styleProps = {
    divider: { margin: '4px 0', borderBlockStart: 0 },
    verticalGutter: isSmartphone ? 6 : 12
  }

  const deviceType = { isSmartphone, isTablet, isMobile }

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

  // Use Effect to monitor state.rulesEnabled and if truthy and a distribution template has been selected...
  // ...check to see if any changes have been made to the template and if so, ...
  // ...set the templateNameModal.isModified to true
  useEffect(() => {
    if (state.rulesEnabled && state.templateNameModal.id) {
      const template = distributionTemplates.find((template) => template._id === state.templateNameModal.id)
      let isModified = false

      if (template) {
        prepDistributionTemplate(desoData, state, state.templateNameModal.name, state.rulesEnabled, true).then(
          (newTemplate) => {
            // Set values that were not set by prepDistributionTemplate
            newTemplate.key = template.key
            newTemplate._id = template._id
            newTemplate.__v = template.__v
            newTemplate.createdAt = template.createdAt
            newTemplate.modifiedAt = template.modifiedAt

            const differences = DeepDiff(template, newTemplate)

            if (differences) isModified = true
            setState({ templateNameModal: { ...state.templateNameModal, isModified } })
          }
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.rulesEnabled,
    state.distributeTo,
    state.myHodlers,
    state.distributeDeSoUser,
    state.distributionType,
    state.tokenToUse,
    state.distributionAmount,
    state.nftHodlers,
    state.filterUsers,
    state.filterAmountIs,
    state.filterAmount,
    state.returnAmount,
    state.lastActiveDays,
    state.spreadAmountBasedOn
  ])

  const resetState = async () => {
    setState(distributionDashboardState(configData.feePerTransactionUSD))
  }

  const handleRefreshDashboard = async () => {
    let gqlProps = null
    let gqlData = null
    let tmpdata = null

    try {
      setState({ isExecuting: true })

      // First we retrieve configurations from Agilit-e
      const tmpConfigData = await getConfigData()
      dispatch(setConfigData(tmpConfigData))

      // Get the rest of the DeSo Data
      gqlProps = {
        publicKey: desoData.profile.publicKey,
        orderBy: 'BALANCE_NANOS_DESC'
      }

      gqlData = await client.query({ query: GQL_GET_INITIAL_DESO_DATA, variables: gqlProps, fetchPolicy: 'no-cache' })

      // Finalize the DeSo Data Object for the current User
      tmpdata = await getInitialDeSoData(desoData, gqlData.data)
      dispatch(setDeSoData(tmpdata))
      setState({ isExecuting: false })

      return
    } catch (e) {
      message.error(e)
    }
  }

  const handleDistributeTo = async (distributeTo, force = false) => {
    let myHodlers = true
    let distributeDeSoUser = []
    let hodlerData = null
    let gqlProps = null
    let gqlData = null

    try {
      // If user selects the current value, do nothing
      if (!force && distributeTo === state.distributeTo) return

      // Reset Dashboard State, as all values depend on this selection, especially if user selects nothing
      resetState()
      if (!distributeTo) return

      // Then, if user selects NFT or CUSTOM, no extra work is needed
      if (distributeTo === Enums.values.NFT) {
        setState({ distributeTo, nftUrl: '', nftMetaData: {}, nftHodlers: [], openNftSearch: true })
        return
      } else if (distributeTo === Enums.values.CUSTOM) {
        setState({ distributeTo, customListModal: customListModal(true) })
        return
      }

      // Once we get here, we need to fetch the hodlers for the selected option
      setState({ distributeTo, isExecuting: true, loading: true })

      // Next, we need to fetch the rest of the user's DeSo data
      gqlProps = await buildGQLProps(distributeTo, desoData)

      switch (distributeTo) {
        case Enums.values.DAO:
        case Enums.values.CREATOR:
          gqlData = await client.query({
            query: GQL_GET_TOKEN_HOLDERS,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processTokenHodlers(gqlData.data, state, desoData)
          break
      }

      // Update State
      setState({
        originalHodlers: hodlerData.originalHodlers,
        finalHodlers: hodlerData.finalHodlers,
        tokenTotal: hodlerData.tokenTotal,
        selectedTableKeys: hodlerData.selectedTableKeys,
        isExecuting: false,
        loading: false
      })

      // Update State
      setState({ distributeTo, myHodlers, distributeDeSoUser })
    } catch (e) {
      console.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionType = async (distributionType) => {
    setState({
      distributionType,
      tokenToUse: Enums.values.EMPTY_STRING,
      tokenToUseLabel: Enums.values.EMPTY_STRING,
      distributionAmount: null,
      spreadAmountBasedOn: 'Ownership'
    })
  }

  const handleDistributeMyHodlers = async (myHodlers) => {
    // Fetch Own Hodlers that need to be set up if checked
    if (myHodlers) {
      await handleDistributeTo(state.distributeTo, true)
    } else {
      // Update State
      setState({
        myHodlers,
        distributeDeSoUser: [],
        originalHodlers: [],
        finalHodlers: [],
        tokenTotal: 0,
        selectedTableKeys: [],
        distributionAmount: null
      })
    }
  }

  const handleDistributeDeSoUser = async (distributeDeSoUser) => {
    const gqlProps = {}
    let originalHodlers = null
    let gqlData = null

    if (distributeDeSoUser.length === 0) {
      setState({ distributeDeSoUser, originalHodlers: [], finalHodlers: [], tokenTotal: 0, selectedTableKeys: [] })
      return
    }

    setState({ loading: true, distributeDeSoUser })

    gqlProps.publicKey = distributeDeSoUser[0].key
    gqlProps.orderBy = 'BALANCE_NANOS_DESC'

    if (state.distributeTo === Enums.values.CREATOR) {
      gqlProps.filter = { isDaoCoin: { in: false } }

      gqlData = await client.query({ query: GET_HODLERS, variables: gqlProps, fetchPolicy: 'no-cache' })
      const { ccHodlers } = await getCCHodlersAndBalance(
        distributeDeSoUser[0].key,
        gqlData.data.accountByPublicKey.tokenBalancesAsCreator.nodes
      )
      originalHodlers = ccHodlers
    } else {
      gqlProps.filter = { isDaoCoin: { in: true } }
      gqlData = await client.query({ query: GET_HODLERS, variables: gqlProps, fetchPolicy: 'no-cache' })
      const { daoHodlers } = await getDAOHodlersAndBalance(
        distributeDeSoUser[0].key,
        gqlData.data.accountByPublicKey.tokenBalancesAsCreator.nodes
      )
      originalHodlers = daoHodlers
    }

    const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(originalHodlers, state)

    // Update State
    setState({ originalHodlers, finalHodlers, tokenTotal, selectedTableKeys, loading: false })
  }

  const handleTokenToUse = async (tokenToUse, tokenToUseLabel) => {
    const finalHodlers = cloneDeep(state.finalHodlers)
    await calculateEstimatedPayment(null, finalHodlers, state, desoData)
    setState({ finalHodlers, tokenToUse, tokenToUseLabel, distributionAmount: null })
  }

  const handleConfirmNFT = async (nftMetaData, nftHodlers, nftUrl) => {
    try {
      setState({ loading: true })

      nftHodlers = cloneDeep(nftHodlers)
      nftHodlers.sort((a, b) => b.tokenBalance - a.tokenBalance)

      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(nftHodlers, state)

      // Update States
      setState({
        originalHodlers: nftHodlers,
        finalHodlers,
        tokenTotal,
        selectedTableKeys,
        nftMetaData,
        nftHodlers,
        nftUrl,
        openNftSearch: false
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handleConfirmCustomList = async (userList) => {
    try {
      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(userList, state)

      setState({
        originalHodlers: userList,
        finalHodlers,
        tokenTotal,
        selectedTableKeys,
        customListModal: { ...state.customListModal, isOpen: false, userList }
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handleSelectTemplate = async (id) => {
    try {
      setState({ loading: true })
      let tmpHodlers = null

      // Clone a copy of the state
      const tmpState = cloneDeep(state)

      // fetch the selected template using id
      const template = distributionTemplates.find((template) => template._id === id)

      // update the state props using the selected template
      tmpState.distributeTo = template.distributeTo
      tmpState.myHodlers = template.myHodlers
      tmpState.distributeDeSoUser = template.distributeDeSoUser
      tmpState.distributionType = template.distributionType
      tmpState.tokenToUse = template.tokenToUse
      tmpState.distributionAmount = template.distributionAmount
      tmpState.rulesEnabled = template.rules.enabled
      tmpState.spreadAmountBasedOn = template.rules.spreadAmountBasedOn
      tmpState.filterUsers = template.rules.filterUsers
      tmpState.filterAmountIs = template.rules.filterAmountIs
      tmpState.filterAmount = template.rules.filterAmount
      tmpState.returnAmount = template.rules.returnAmount
      tmpState.lastActiveDays = template.rules.lastActiveDays

      if (template.distributeTo === Enums.values.CUSTOM) {
        tmpState.customListModal = customListModal()
        tmpState.customListModal.userList = template.customList
      }

      // Update tmpState.templateNameModal and close Select Template Modal
      tmpState.templateNameModal.id = template._id
      tmpState.templateNameModal.name = template.name
      tmpState.templateNameModal.isModified = false
      tmpState.selectTemplateModal.isOpen = false

      // Fetch Hodlers that need to be set up
      switch (tmpState.distributeTo) {
        case Enums.values.DAO:
          tmpHodlers = desoData.profile.daoHodlers
          break
        case Enums.values.CREATOR:
          tmpHodlers = desoData.profile.ccHodlers
          break
        case Enums.values.CUSTOM:
          tmpHodlers = template.customList
          break
        case Enums.values.NFT:
          tmpHodlers = template.nftHodlers
          break
      }

      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(tmpHodlers, state, desoData)

      setState({
        finalHodlers,
        selectedTableKeys,
        tokenTotal
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handleSetTemplateName = async (tmpName) => {
    try {
      setState({ loading: true })

      let id = state.templateNameModal.id
      let isUpdate = !!id
      const name = tmpName || state.templateNameModal.name
      const rulesEnabled = state.rulesEnabled
      const tmpTemplates = cloneDeep(distributionTemplates)
      let data = null
      let response = null

      if (state.templateNameModal.forceNew) {
        // Treat existing template as a new one and update
        id = null
        isUpdate = false
      }

      if (!state.distributeTo && isUpdate) {
        // It's only a rename of the Template Name, use existing data
        data = distributionTemplates.find((template) => template._id === id)
        data = cloneDeep(data)
        data.name = name
      } else {
        data = await prepDistributionTemplate(desoData, state, name, rulesEnabled, isUpdate)
      }

      if (!isUpdate) {
        response = await createDistributionTemplate(data)
        response.key = response._id

        // Add entry to the list of templates
        tmpTemplates.push(response)
      } else {
        response = await updateDistributionTemplate(id, data)
        response.key = response._id

        // Update entry in the list of templates
        const index = tmpTemplates.findIndex((template) => template._id === id)
        tmpTemplates[index] = response
      }

      dispatch(setDistributionTemplates(tmpTemplates))
      setState({
        templateNameModal: {
          ...state.templateNameModal,
          name,
          isOpen: false,
          isModified: false,
          forceNew: false,
          id: response._id
        }
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handleDeleteTemplate = async (id) => {
    try {
      setState({ loading: true })

      await deleteDistributionTemplate(id)
      const tmpTemplates = distributionTemplates.filter((item) => item._id !== id)
      dispatch(setDistributionTemplates(tmpTemplates))

      setState({ loading: false })
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
      <Row justify='center' gutter={[12, 12]}>
        <Col xs={22} xl={20} xxl={16}>
          <ContainerCard title={'Distribution Dashboard'} deviceType={deviceType}>
            <Row gutter={[12, styleProps.verticalGutter]}>
              <Col span={24}>
                <Row gutter={[12, styleProps.verticalGutter]}>
                  <Col xs={24} md={12}>
                    <WalletOverviewCard desoProfile={desoData.profile} deviceType={deviceType} />
                  </Col>
                  <Col xs={24} md={12}>
                    <QuickActionsCard
                      desoData={desoData}
                      onResetDashboard={resetState}
                      onRefreshDashboard={handleRefreshDashboard}
                      rootState={state}
                      deviceType={deviceType}
                      setRootState={setState}
                    />
                  </Col>
                </Row>
                <Divider style={styleProps.divider} />
                <Row gutter={[12, styleProps.verticalGutter]}>
                  <Col xs={24} lg={12}>
                    <SetupCard
                      desoData={desoData}
                      rootState={state}
                      templateNameModal={state.templateNameModal}
                      onDistributeTo={handleDistributeTo}
                      onDistributeMyHodlers={handleDistributeMyHodlers}
                      onDistributeDeSoUser={handleDistributeDeSoUser}
                      onDistributionType={handleDistributionType}
                      onTokenToUse={handleTokenToUse}
                      setRootState={setState}
                      onConfirmNFT={handleConfirmNFT}
                      onConfirmCustomList={handleConfirmCustomList}
                      onSelectTemplate={handleSelectTemplate}
                      onDeleteTemplate={handleDeleteTemplate}
                      onSetTemplateName={handleSetTemplateName}
                      deviceType={deviceType}
                      isLoading={state.loading}
                      distributionTemplates={distributionTemplates}
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <SummaryCard
                      desoData={desoData}
                      configData={configData}
                      rootState={state}
                      setRootState={setState}
                      onRefreshDashboard={handleRefreshDashboard}
                      deviceType={deviceType}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider style={styleProps.divider} />
            {state.distributeTo ? (
              <Row>
                <TableData desoData={desoData} rootState={state} setRootState={setState} deviceType={deviceType} />
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
