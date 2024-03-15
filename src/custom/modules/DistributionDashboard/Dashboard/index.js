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
import DashboardEnums from '../enums'

import {
  calculateEstimatedPayment,
  prepDistributionTemplate,
  prepDistributionTransactionUpdate,
  setupHodlers
} from '../controller'
import { customListModal, diamondOptionsModal, distributionDashboardState, paymentModal } from '../data-models'
import { setDeSoData, setConfigData, setDistributionTemplates } from '../../../reducer'
import { cloneDeep } from 'lodash'
import {
  diamondPosts,
  getInitialDeSoData,
  processCustomList,
  processNFTEntries,
  processTokenHodlers,
  sendCreatorCoins,
  sendDAOTokens,
  sendDESO
} from '../../../lib/deso-controller-graphql'
import PaymentModal from '../PaymentModal'
import {
  createDistributionTemplate,
  deleteDistributionTemplate,
  getConfigData,
  getOptOutProfile,
  getOptOutTemplate,
  updateDistributionTemplate,
  updateDistributionTransaction
} from '../../../lib/agilite-controller'
import { useApolloClient } from '@apollo/client'
import {
  FETCH_MULTIPLE_PROFILES,
  GET_FOLLOWERS,
  GET_FOLLOWING,
  GET_NFT_ENTRIES,
  GQL_GET_INITIAL_DESO_DATA,
  GQL_GET_TOKEN_HOLDERS
} from 'custom/lib/graphql-models'
import { buildGQLProps, randomize } from 'custom/lib/utils'

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
    let publicKey = null

    try {
      setState({ isExecuting: true })

      // First we retrieve configurations from Agilit-e
      const tmpConfigData = await getConfigData()
      const tmpOptOutTemplate = await getOptOutTemplate()
      tmpConfigData.optOutTemplate = tmpOptOutTemplate
      const tmpOptOutProfile = await getOptOutProfile({ publicKey: desoData.profile.publicKey })
      tmpConfigData.optOutProfile = tmpOptOutProfile
      dispatch(setConfigData(tmpConfigData))

      // Now we need to determine which public key to use based on myHodlers
      if (!state.myHodlers && state.distributeDeSoUser) {
        publicKey = state.distributeDeSoUser[0].key
      } else {
        publicKey = desoData.profile.publicKey
      }

      // Get the rest of the DeSo Data for the current User
      gqlProps = {
        publicKey: desoData.profile.publicKey
      }

      gqlData = await client.query({
        query: GQL_GET_INITIAL_DESO_DATA,
        variables: gqlProps,
        fetchPolicy: 'no-cache'
      })

      tmpdata = await getInitialDeSoData(desoData, gqlData.data, tmpConfigData)

      // Fetch DeSo data based on the Dashboard configurations
      const dashboardData = await fetchUsersFromDeSo(state.distributeTo, publicKey, state)

      // Update State and Redux Store
      dispatch(setDeSoData(tmpdata))

      setState({
        originalHodlers: dashboardData.originalHodlers,
        finalHodlers: dashboardData.finalHodlers,
        tokenTotal: dashboardData.tokenTotal,
        selectedTableKeys: dashboardData.selectedTableKeys,
        isExecuting: false,
        loading: false
      })

      return
    } catch (e) {
      message.error(e)
    }
  }

  const handlePostDistributionRefresh = async () => {
    let gqlProps = null
    let gqlData = null
    let tmpdata = null

    try {
      setState({ isExecuting: true })

      // First we retrieve configurations from Agilit-e
      const tmpConfigData = await getConfigData()
      const tmpOptOutTemplate = await getOptOutTemplate()
      tmpConfigData.optOutTemplate = tmpOptOutTemplate
      const tmpOptOutProfile = await getOptOutProfile({ publicKey: desoData.profile.publicKey })
      tmpConfigData.optOutProfile = tmpOptOutProfile
      dispatch(setConfigData(tmpConfigData))

      // Get the rest of the DeSo Data for the current User
      gqlProps = {
        publicKey: desoData.profile.publicKey
      }

      gqlData = await client.query({
        query: GQL_GET_INITIAL_DESO_DATA,
        variables: gqlProps,
        fetchPolicy: 'no-cache'
      })

      tmpdata = await getInitialDeSoData(desoData, gqlData.data, tmpConfigData)

      // Update State and Redux Store
      dispatch(setDeSoData(tmpdata))

      setState({
        isExecuting: false,
        loading: false
      })

      return
    } catch (e) {
      message.error(e)
    }
  }

  const handleDistributeTo = async (distributeTo, force = false) => {
    let myHodlers = true
    let distributeDeSoUser = []

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

      const hodlerData = await fetchUsersFromDeSo(distributeTo, desoData.profile.publicKey, state)

      // Update State
      setState({
        distributeTo,
        myHodlers,
        distributeDeSoUser,
        originalHodlers: hodlerData.originalHodlers,
        finalHodlers: hodlerData.finalHodlers,
        tokenTotal: hodlerData.tokenTotal,
        selectedTableKeys: hodlerData.selectedTableKeys,
        isExecuting: false,
        loading: false
      })
    } catch (e) {
      console.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionType = async (distributionType) => {
    // Then, if user selects Diamonds, load modal instead
    if (distributionType === Enums.paymentTypes.DIAMONDS) {
      setState({ distributionType, diamondOptionsModal: diamondOptionsModal(true) })
      return
    }

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
    if (distributeDeSoUser.length === 0) {
      setState({ distributeDeSoUser, originalHodlers: [], finalHodlers: [], tokenTotal: 0, selectedTableKeys: [] })
      return
    }

    setState({ loading: true, isExecuting: true, distributeDeSoUser })
    const hodlerData = await fetchUsersFromDeSo(state.distributeTo, distributeDeSoUser[0].key, state)

    setState({
      originalHodlers: hodlerData.originalHodlers,
      finalHodlers: hodlerData.finalHodlers,
      tokenTotal: hodlerData.tokenTotal,
      selectedTableKeys: hodlerData.selectedTableKeys,
      loading: false,
      isExecuting: false
    })
  }

  const handleTokenToUse = async (tokenToUse, tokenToUseLabel) => {
    const tmpState = cloneDeep(state)

    tmpState.tokenToUse = tokenToUse
    tmpState.tokenToUseLabel = tokenToUseLabel

    const tmpHodlers = cloneDeep(state.originalHodlers)
    const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(tmpHodlers, tmpState, desoData)

    tmpState.finalHodlers = finalHodlers
    tmpState.tokenTotal = tokenTotal
    tmpState.selectedTableKeys = selectedTableKeys

    setState(tmpState)
  }

  const handleConfirmNFT = async (nftMetaData, nftUrl) => {
    try {
      let nftEntries = null
      let nftHodlers = null

      setState({ loading: true, isExecuting: true, openNftSearch: false })

      const gqlProps = {
        condition: {
          nftPostHash: nftMetaData.id
        }
      }

      nftEntries = await client.query({ query: GET_NFT_ENTRIES, variables: gqlProps, fetchPolicy: 'no-cache' })
      nftEntries = nftEntries.data.nfts.nodes
      nftHodlers = await processNFTEntries(desoData.profile.publicKey, nftEntries)

      const { finalHodlers, tokenTotal, selectedTableKeys } = await setupHodlers(nftHodlers, state, desoData)

      // Update States
      setState({
        originalHodlers: nftHodlers,
        finalHodlers,
        tokenTotal,
        selectedTableKeys,
        nftMetaData,
        nftHodlers,
        nftUrl,
        openNftSearch: false,
        loading: false,
        isExecuting: false
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false })
  }

  const handleConfirmCustomList = async (publicKeys) => {
    try {
      setState({ loading: true, isExecuting: true, customListModal: { ...state.customListModal, isOpen: false } })

      // Refetch all data to ensure we have the latest
      const gqlProps = {
        filter: {
          publicKey: {
            in: publicKeys
          }
        }
      }

      const gqlData = await client.query({
        query: FETCH_MULTIPLE_PROFILES,
        variables: gqlProps,
        fetchPolicy: 'no-cache'
      })

      const { originalHodlers, finalHodlers, tokenTotal, selectedTableKeys } = await processCustomList(
        gqlData.data,
        state,
        desoData,
        configData
      )

      setState({
        originalHodlers,
        finalHodlers,
        tokenTotal,
        selectedTableKeys,
        customListModal: { ...state.customListModal, userList: finalHodlers, isOpen: false },
        loading: false,
        isExecuting: false
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
      setState({ loading: false, isExecuting: false })
    }
  }

  const handleSelectTemplate = async (id) => {
    try {
      setState({
        loading: true,
        isExecuting: true,
        selectTemplateModal: {
          ...state.selectTemplateModal,
          isOpen: false
        }
      })

      const tmpState = cloneDeep(state)
      const template = distributionTemplates.find((template) => template._id === id)

      let hodlerData = null
      let publicKeys = null
      let gqlProps = null
      let nftEntries = null
      let nftHodlers = null

      // update the state props using the selected template
      tmpState.distributeTo = template.distributeTo
      tmpState.distributionType = template.distributionType
      tmpState.myHodlers = template.myHodlers
      tmpState.distributeDeSoUser = template.distributeDeSoUser
      tmpState.tokenToUse = template.tokenToUse
      tmpState.distributionAmount = template.distributionAmount
      tmpState.rulesEnabled = template.rules.enabled
      tmpState.spreadAmountBasedOn = template.rules.spreadAmountBasedOn
      tmpState.filterUsers = template.rules.filterUsers
      tmpState.filterAmountIs = template.rules.filterAmountIs
      tmpState.filterAmount = template.rules.filterAmount
      tmpState.returnAmount = template.rules.returnAmount
      tmpState.lastActiveDays = template.rules.lastActiveDays

      // Update tmpState.templateNameModal and close Select Template Modal
      tmpState.templateNameModal.id = template._id
      tmpState.templateNameModal.name = template.name
      tmpState.templateNameModal.isModified = false
      tmpState.selectTemplateModal.isOpen = false

      switch (template.distributeTo) {
        case Enums.values.CUSTOM:
          tmpState.customListModal = customListModal()

          // Build the list of public keys
          publicKeys = template.customList.map((item) => item.publicKey)

          // Refetch all data to ensure we have the latest
          gqlProps = {
            filter: {
              publicKey: {
                in: publicKeys
              }
            }
          }

          const gqlData = await client.query({
            query: FETCH_MULTIPLE_PROFILES,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processCustomList(gqlData.data, tmpState, desoData, configData)
          tmpState.customListModal.userList = hodlerData.finalHodlers

          break
        case Enums.values.NFT:
          gqlProps = {
            condition: {
              nftPostHash: template.nftId
            }
          }

          nftEntries = await client.query({ query: GET_NFT_ENTRIES, variables: gqlProps, fetchPolicy: 'no-cache' })
          nftEntries = nftEntries.data.nfts.nodes
          nftHodlers = await processNFTEntries(desoData.profile.publicKey, nftEntries)
          hodlerData = await setupHodlers(nftHodlers, state, desoData)

          tmpState.nftId = template.nftId

          tmpState.nftMetaData = {
            id: template.nftId,
            imageUrl: template.nftImageUrl,
            description: template.nftDescription
          }

          tmpState.nftHodlers = hodlerData.finalHodlers
          tmpState.nftUrl = template.nftUrl

          break
        default:
          hodlerData = await fetchUsersFromDeSo(template.distributeTo, desoData.profile.publicKey, tmpState)
      }

      switch (template.distributionType) {
        case Enums.paymentTypes.DIAMONDS:
          tmpState.diamondOptionsModal.noOfDiamonds = template.diamondOptions.noOfDiamonds
          tmpState.diamondOptionsModal.noOfPosts = template.diamondOptions.noOfPosts
          tmpState.diamondOptionsModal.skipHours = template.diamondOptions.skipHours
          break
      }

      tmpState.originalHodlers = hodlerData.originalHodlers
      tmpState.finalHodlers = hodlerData.finalHodlers
      tmpState.tokenTotal = hodlerData.tokenTotal
      tmpState.selectedTableKeys = hodlerData.selectedTableKeys
      tmpState.loading = false
      tmpState.isExecuting = false

      // Update State
      setState(tmpState)
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }

    setState({ loading: false, isExecuting: false })
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

  const handleConfirmDiamondOptions = async (noOfPosts, noOfDiamonds, skipHours) => {
    try {
      // We need to auto determine the distribution amount and force some rules
      let finalHodlers = cloneDeep(state.finalHodlers)
      let distributionAmount = noOfPosts * finalHodlers.filter((hodler) => hodler.isActive && hodler.isVisible).length
      let rulesEnabled = true
      let spreadAmountBasedOn = 'Equal Spread'

      await calculateEstimatedPayment(
        distributionAmount,
        state.distributionType,
        spreadAmountBasedOn,
        finalHodlers,
        desoData
      )

      setState({
        distributionAmount,
        finalHodlers,
        rulesEnabled,
        spreadAmountBasedOn,
        diamondOptionsModal: { ...state.diamondOptionsModal, noOfDiamonds, noOfPosts, skipHours, isOpen: false }
      })
    } catch (e) {
      console.error(e)
      message.error(e.message)
    }
  }

  const handlePaymentDone = async () => {
    setState({ paymentModal: paymentModal() })
  }

  const fetchUsersFromDeSo = async (distributeTo, publicKey, tmpState) => {
    let hodlerData = null
    let gqlProps = null
    let gqlData = null
    let publicKeys = null
    let nftEntries = null
    let nftHodlers = null

    try {
      // Next, we need to fetch the rest of the user's DeSo data
      gqlProps = await buildGQLProps(distributeTo, publicKey, desoData)

      switch (distributeTo) {
        case Enums.values.DAO:
        case Enums.values.CREATOR:
          gqlData = await client.query({
            query: GQL_GET_TOKEN_HOLDERS,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processTokenHodlers(distributeTo, gqlData.data, tmpState, desoData, configData)

          break
        case Enums.values.FOLLOWERS:
          gqlData = await client.query({
            query: GET_FOLLOWERS,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processTokenHodlers(distributeTo, gqlData.data, tmpState, desoData, configData)

          break
        case Enums.values.FOLLOWING:
          gqlData = await client.query({
            query: GET_FOLLOWING,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processTokenHodlers(distributeTo, gqlData.data, tmpState, desoData, configData)

          break
        case Enums.values.CUSTOM:
          // Build the list of public keys
          publicKeys = tmpState.customListModal.userList.map((item) => item.publicKey)

          // Refetch all data to ensure we have the latest
          gqlProps = {
            filter: {
              publicKey: {
                in: publicKeys
              }
            }
          }

          gqlData = await client.query({
            query: FETCH_MULTIPLE_PROFILES,
            variables: gqlProps,
            fetchPolicy: 'no-cache'
          })

          hodlerData = await processCustomList(gqlData.data, tmpState, desoData, configData)

          break
        case Enums.values.NFT:
          gqlProps = {
            condition: {
              nftPostHash: tmpState.nftMetaData.id
            }
          }

          nftEntries = await client.query({ query: GET_NFT_ENTRIES, variables: gqlProps, fetchPolicy: 'no-cache' })
          nftEntries = nftEntries.data.nfts.nodes
          nftHodlers = await processNFTEntries(publicKey, nftEntries)
          hodlerData = await setupHodlers(nftHodlers, tmpState, desoData)

          break
        default:
          // No Distribute To option selected Return defaults
          hodlerData = {
            originalHodlers: [],
            finalHodlers: [],
            tokenTotal: 0,
            selectedTableKeys: []
          }
      }

      return hodlerData
    } catch (e) {
      return e
    }
  }

  const handleRetryExecute = async () => {
    let status = DashboardEnums.paymentStatuses.PREPARING
    let tips = await randomize(configData.tips, null, configData.tips.length)
    let progressPercent = 10
    let paymentModal = null
    let finalHodlers = null
    let paymentCount = 0
    let successCount = 0
    let failCount = 0
    let remainingCount = paymentCount
    let executeInCatch = false
    let errorHodlersCount = null

    try {
      // Flag all hodlers setting paymentStatus = CoreEnums.paymentStatuses.QUEUED where isKnownError = true
      // Also create array of hodlers who have known errors
      finalHodlers = cloneDeep(state.finalHodlers)

      for (const hodler of finalHodlers) {
        if (state.distributionType === Enums.paymentTypes.DIAMONDS) {
          for (const post of hodler.diamondPosts) {
            if (post.isKnownError) {
              hodler.paymentStatus = Enums.paymentStatuses.QUEUED
              errorHodlersCount++
            }
          }
        } else {
          if (hodler.isKnownError) {
            hodler.paymentStatus = Enums.paymentStatuses.QUEUED
            errorHodlersCount++
          }
        }
      }

      // Start execution and update Root State
      setState({
        isExecuting: true,
        finalHodlers
      })

      // Prep the Payment Modal, by incrementing the remainingCount, decrementing the failCount
      paymentModal = cloneDeep(state.paymentModal)

      paymentCount = paymentModal.paymentCount
      successCount = paymentModal.successCount
      failCount = paymentModal.failCount - errorHodlersCount
      remainingCount = paymentModal.remainingCount + errorHodlersCount

      paymentModal = {
        ...paymentModal,
        paymentCount,
        successCount,
        failCount,
        remainingCount,
        isOpen: true,
        status,
        tips,
        progressPercent
      }

      executeInCatch = true

      // Update the Payment Modal
      paymentModal.status = DashboardEnums.paymentStatuses.EXECUTING
      paymentModal.progressPercent = 20
      setState({ paymentModal })

      // Loop through state.holdersToPay and for each one, distribute the tokens using a for-of loop
      for (const hodler of finalHodlers) {
        // Pay the hodler
        try {
          // Ignore hodlers that are not active or visible and don't have a known error
          if (!hodler.isActive || !hodler.isVisible || !hodler.isKnownError) continue

          hodler.isError = false
          hodler.errorMessage = ''
          hodler.isKnownError = false
          hodler.paymentStatus = Enums.paymentStatuses.IN_PROGRESS

          setState({ finalHodlers })

          switch (state.distributionType) {
            case Enums.paymentTypes.DESO:
              await sendDESO(desoData.profile.publicKey, hodler.publicKey, hodler.estimatedPaymentToken)
              break
            case Enums.paymentTypes.DAO:
              await sendDAOTokens(
                desoData.profile.publicKey,
                hodler.publicKey,
                state.tokenToUse,
                hodler.estimatedPaymentToken
              )

              break
            case Enums.paymentTypes.CREATOR:
              await sendCreatorCoins(
                desoData.profile.publicKey,
                hodler.publicKey,
                state.tokenToUse,
                hodler.estimatedPaymentToken
              )
              break
            case Enums.paymentTypes.DIAMONDS:
              let hasErrors = null

              for (const post of hodler.diamondPosts) {
                try {
                  // Ignore posts that are not Known Errors
                  if (!post.isKnownError) continue

                  post.isError = false
                  post.errorMessage = ''
                  post.isKnownError = false

                  await diamondPosts(
                    desoData.profile.publicKey,
                    hodler.publicKey,
                    post.postHash,
                    state.diamondOptionsModal.noOfDiamonds
                  )
                } catch (e) {
                  hasErrors = true
                  post.isError = true
                  post.errorMessage = e.message

                  // Use Enums.transactionErrors Determine if the error is known or not, and populate isKnownError
                  const knownError = Enums.transactionErrors.find((error) =>
                    e.message.toLowerCase().includes(error.qry.toLowerCase())
                  )

                  if (knownError) {
                    post.isKnownError = true
                  }
                }

                // Update the Payment Modal
                if (!post.isError) {
                  successCount++
                  remainingCount--
                  paymentModal.successCount = successCount
                  paymentModal.remainingCount = remainingCount
                } else {
                  failCount++
                  remainingCount--
                  paymentModal.failCount = failCount
                  paymentModal.remainingCount = remainingCount
                }

                paymentModal.progressPercent = Math.floor(20 + (70 * (successCount + failCount)) / paymentCount)
                setState({ paymentModal })
              }

              if (hasErrors) {
                hodler.paymentStatus = Enums.paymentStatuses.FAILED
                hodler.isError = true
                hodler.errorMessage = 'DIAMONDS'
                hodler.isKnownError = true
              } else {
                hodler.paymentStatus = Enums.paymentStatuses.SUCCESS
              }

              setState({ finalHodlers })

              break
          }
        } catch (e) {
          hodler.isError = true
          hodler.errorMessage = e.message

          // Use Enums.transactionErrors Determine if the error is known or not, and populate isKnownError
          const knownError = Enums.transactionErrors.find((error) =>
            e.message.toLowerCase().includes(error.qry.toLowerCase())
          )

          if (knownError) {
            hodler.isKnownError = true
          }
        }

        // Update the Payment Modal, but ignore if the payment type is Diamonds
        if (state.distributionType !== Enums.paymentTypes.DIAMONDS) {
          if (!hodler.isError) {
            successCount++
            remainingCount--
            paymentModal.successCount = successCount
            paymentModal.remainingCount = remainingCount
            hodler.paymentStatus = Enums.paymentStatuses.SUCCESS
          } else {
            failCount++
            remainingCount--
            paymentModal.failCount = failCount
            paymentModal.remainingCount = remainingCount
            hodler.paymentStatus = Enums.paymentStatuses.FAILED
          }
        }

        paymentModal.progressPercent = Math.floor(20 + (70 * (successCount + failCount)) / paymentCount)
        setState({ paymentModal, finalHodlers })
      }

      // If there were any errors, add them to errors array and change the payment status
      paymentModal.progressPercent = 100

      if (failCount > 0) {
        paymentModal.status = DashboardEnums.paymentStatuses.ERROR_PAYMENT_TRANSACTION
        paymentModal.errors = finalHodlers.filter((hodler) => hodler.isError)
      } else {
        paymentModal.status = DashboardEnums.paymentStatuses.SUCCESS
        paymentModal.errors = []
      }

      paymentModal.distTransaction = await prepDistributionTransactionUpdate(
        paymentModal.distTransaction,
        finalHodlers,
        paymentModal
      )
      await updateDistributionTransaction(paymentModal.distTransaction._id, paymentModal.distTransaction)

      setState({ paymentModal, isExecuting: false })
    } catch (e) {
      console.error(e)

      // We need to post the error to Agilit-e and notify the user
      paymentModal.status = DashboardEnums.paymentStatuses.ERROR
      paymentModal.progressPercent = 100
      paymentModal.isError = true

      if (executeInCatch) {
        try {
          paymentModal.distTransaction = await prepDistributionTransactionUpdate(
            paymentModal.distTransaction,
            finalHodlers,
            paymentModal
          )

          paymentModal.distTransaction.isError = true
          paymentModal.distTransaction.errorDetails = {
            message: e.message,
            stack: e.stack
          }

          await updateDistributionTransaction(paymentModal.distTransaction._id, paymentModal.distTransaction)
        } catch (e) {
          // If we get here, we have serious problems
          console.error('We have serious problems if this error occurred')
          console.error(e)
        }
      }

      setState({
        isExecuting: false,
        paymentModal
      })

      message.error(e.message)
    }
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
                      configData={configData}
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
                      onConfirmDiamondOptions={handleConfirmDiamondOptions}
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
                      onRefreshDashboard={handlePostDistributionRefresh}
                      deviceType={deviceType}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider style={styleProps.divider} />
            <Row>
              <TableData desoData={desoData} rootState={state} setRootState={setState} deviceType={deviceType} />
            </Row>
          </ContainerCard>
        </Col>
      </Row>
      <PaymentModal props={state.paymentModal} onPaymentDone={handlePaymentDone} onRetryExecute={handleRetryExecute} />
    </>
  )
}

const BatchTransactionsForm = memo(_BatchTransactionsForm)

export default BatchTransactionsForm
