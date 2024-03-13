import React, { useEffect, useReducer } from 'react'
import { Card, Row, Col, Divider, InputNumber, Button, Alert, App } from 'antd'
import { cloneDeep } from 'lodash'
import { RightCircleOutlined } from '@ant-design/icons'

import CoreEnums from '../../../lib/enums'
import {
  calculateEstimatedPayment,
  prepDistributionTransaction,
  prepDistributionTransactionUpdate,
  slimRootState
} from '../controller'
import { distributionSummaryState } from '../data-models'
import Enums from '../enums'
import {
  changeDeSoLimit,
  diamondPosts,
  sendCreatorCoins,
  sendDAOTokens,
  sendDESO
} from '../../../lib/deso-controller-graphql'
import { randomize } from '../../../lib/utils'
import { createDistributionTransaction, updateDistributionTransaction } from '../../../lib/agilite-controller'

import './style.sass'
import { identity } from 'deso-protocol'
import { GET_POSTS } from 'custom/lib/graphql-models'
import { useApolloClient } from '@apollo/client'
import { diamondPostModel } from 'custom/lib/data-models'

const styleParams = {
  labelColXS: 11,
  labelColSM: 12,
  labelColMD: 8,
  labelColLG: 10,
  valueColXS: 13,
  valueColSM: 12,
  valueColMD: 16,
  valueColLG: 14,
  colRightXS: 24
}

const reducer = (state, newState) => ({ ...state, ...newState })

const SummaryCard = ({ desoData, configData, rootState, setRootState, onRefreshDashboard, deviceType }) => {
  const [state, setState] = useReducer(reducer, distributionSummaryState())
  const { modal, message } = App.useApp()
  const { desoPrice } = desoData
  const client = useApolloClient()

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    divider: { margin: '7px 0' },
    btnExecuteActive: {
      color: 'green',
      borderColor: 'green',
      backgroundColor: 'white',
      marginTop: -10
    },
    btnExecuteInactive: {
      color: '#D5D5D5',
      borderColor: '#D5D5D5',
      backgroundColor: 'white',
      marginTop: -10
    },
    fieldLabel: { fontSize: deviceType.isSmartphone ? 14 : deviceType.isTablet ? 18 : 16, fontWeight: 'bold' },
    fieldValue: { fontSize: deviceType.isSmartphone ? 14 : deviceType.isTablet ? 18 : 16 },
    distributionCost: {
      color: state.transactionFeeExceeded ? 'red' : '',
      fontSize: deviceType.isSmartphone ? 14 : deviceType.isTablet ? 18 : 16
    }
  }

  useEffect(() => {
    try {
      let desoOpsFeeUSD = 0
      let desoOpsFeeDESO = 0
      let desoOpsFeeDESOLabel = 0

      let totalFeeUSD = 0
      let totalFeeUSDLabel = 0
      let totalFeeDESO = 0
      let totalFeeDESOLabel = 0

      let amountLabel = ''
      let amountReadOnly = false

      let noOfPaymentTransactions = 0
      let desoGasFeesNanos = 0
      let distributionAmount = rootState.distributionAmount
      let amountExceeded = false
      let transactionFeeExceeded = false
      let selectedToken = null
      let warningMessages = []
      let isInFinalStage = false
      let executeDisabled = false
      let warningMsg = null
      let tokenToDistribute = ''
      let diamondCost = 0
      let diamondNanos = 0
      let diamondTotal = 0

      if (isNaN(distributionAmount)) distributionAmount = 0

      // Calculate the number of payment transactions
      noOfPaymentTransactions = rootState.finalHodlers.filter((hodler) => hodler.isActive && hodler.isVisible).length

      // If Distribution Type is Diamonds, apply additional logic
      if (rootState.distributionType === CoreEnums.paymentTypes.DIAMONDS) {
        noOfPaymentTransactions *= rootState.diamondOptionsModal.noOfPosts
        amountLabel = 'Posts'
        amountReadOnly = true

        // Calculate the distribution amount based on diamond levels
        diamondNanos = desoData.diamondLevels[rootState.diamondOptionsModal.noOfDiamonds]
        diamondTotal = diamondNanos * rootState.diamondOptionsModal.noOfPosts
        diamondCost = diamondTotal / 1e9

        totalFeeDESO = diamondCost
      }

      // Determine DESO Ops Fee - It's free if the actual account is DeSoOps
      if (desoData.profile.publicKey !== CoreEnums.values.DESO_OPS_PUBLIC_KEY) {
        desoOpsFeeUSD = noOfPaymentTransactions * rootState.feePerTransactionUSD
        desoOpsFeeDESO = desoOpsFeeUSD / desoData.desoPrice
      }

      if (isNaN(desoOpsFeeUSD)) desoOpsFeeUSD = 0

      if (isNaN(desoOpsFeeDESO)) {
        desoOpsFeeDESO = 0
      } else {
        desoOpsFeeDESOLabel = Math.floor(desoOpsFeeDESO * 10000) / 10000
      }

      // Determine Gas Fees using Switch
      switch (rootState.distributionType) {
        case CoreEnums.paymentTypes.DESO:
          desoGasFeesNanos = configData.desoGasFeesSendDESONanos * noOfPaymentTransactions
          break
        case CoreEnums.paymentTypes.CREATOR:
          desoGasFeesNanos = configData.desoGasFeesSendCCNanos * noOfPaymentTransactions
          break
        case CoreEnums.paymentTypes.DAO:
          desoGasFeesNanos = configData.desoGasFeesSendDAONanos * noOfPaymentTransactions
          break
        case CoreEnums.paymentTypes.DIAMONDS:
          desoGasFeesNanos =
            configData.desoGasFeesSendDESONanos * noOfPaymentTransactions * rootState.diamondOptionsModal.noOfPosts
          break
      }

      // Determine Total Cost
      totalFeeDESO += desoOpsFeeDESO + desoGasFeesNanos / CoreEnums.values.NANO_VALUE
      totalFeeDESOLabel = Math.floor(totalFeeDESO * 10000) / 10000
      totalFeeUSD = totalFeeDESO * desoData.desoPrice
      totalFeeUSDLabel = Math.floor(totalFeeUSD * 10000) / 10000

      if (totalFeeDESO >= desoData.profile.desoBalance) transactionFeeExceeded = true

      if (rootState.distributionType === CoreEnums.paymentTypes.DESO) {
        tokenToDistribute = `${CoreEnums.paymentTypes.DESO} (~${desoData.profile.desoBalance})`
        isInFinalStage = true

        if (totalFeeDESO + distributionAmount > desoData.profile.desoBalance) {
          amountExceeded = true
          warningMsg = 'The Amount exceeds your DESO Balance.'
        }
      } else if (rootState.distributionType === CoreEnums.paymentTypes.DIAMONDS) {
        tokenToDistribute = `${CoreEnums.paymentTypes.DIAMONDS}`
        isInFinalStage = true

        if (totalFeeDESO > desoData.profile.desoBalance) {
          amountExceeded = true
        }
      } else {
        if (rootState.tokenToUse) {
          isInFinalStage = true

          switch (rootState.distributionType) {
            case CoreEnums.paymentTypes.CREATOR:
              selectedToken = desoData.profile.ccHodlings.find((hodling) => hodling.publicKey === rootState.tokenToUse)
              break
            case CoreEnums.paymentTypes.DAO:
              selectedToken = desoData.profile.daoHodlings.find((hodling) => hodling.publicKey === rootState.tokenToUse)
              break
          }

          if (selectedToken) {
            tokenToDistribute = `${selectedToken.username} (~${selectedToken.tokenBalance})`

            if (distributionAmount > selectedToken.tokenBalance) {
              amountExceeded = true
              warningMsg = `The Amount exceeds your ${rootState.distributionType} Balance.`
            }
          }
        }
      }

      // Check to see if we need to display any warning messages, but only if most of the setup has been provided
      if (isInFinalStage) {
        if (transactionFeeExceeded) {
          warningMessages.push({ key: '1', value: '- The Transaction Fee exceeds your DESO Balance.' })
        }

        if (warningMsg) {
          warningMessages.push({ key: '2', value: `- ${warningMsg}` })
        }

        if (noOfPaymentTransactions === 0) {
          warningMessages.push({ key: '3', value: '- There are no users to distribute to.' })
        }
      }

      if (!rootState.distributionAmount || (isInFinalStage && warningMessages.length > 0)) {
        executeDisabled = true
      }

      setState({
        amountLabel,
        amountReadOnly,
        noOfPaymentTransactions,
        desoOpsFeeUSD,
        desoOpsFeeDESO,
        desoOpsFeeDESOLabel,
        desoGasFeesNanos,
        totalFeeUSD,
        totalFeeUSDLabel,
        totalFeeDESO,
        totalFeeDESOLabel,
        amountExceeded,
        transactionFeeExceeded,
        warningMessages,
        isInFinalStage,
        executeDisabled,
        tokenToDistribute
      })
    } catch (e) {
      console.error(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rootState.finalHodlers,
    rootState.tokenToUse,
    rootState.distributionType,
    rootState.feePerTransactionUSD,
    rootState.distributionAmount,
    rootState.diamondOptionsModal,
    desoData.profile.desoBalance,
    desoData.profile.daoHodlings,
    desoData.profile.ccHodlings,
    desoData.desoPrice,
    configData.estimateTimePerTransactionSeconds,
    configData.desoGasFeesSendDESONanos,
    configData.desoGasFeesSendCCNanos,
    configData.desoGasFeesSendDAONanos,
    desoData.profile.publicKey
  ])

  useEffect(() => {
    let desoPriceClass = ''

    if (!state.prevDesoPrice) {
      setState({ prevDesoPrice: desoData.desoPrice })
      return
    }

    if (desoData.desoPrice > state.prevDesoPrice) {
      desoPriceClass = 'updated-positive'
    } else {
      desoPriceClass = 'updated-negative'
    }

    // The price of $DESO changed. If there is an amount to distribute and it's $DESO, we need to update the estimated payment values
    if (rootState.distributionAmount && rootState.distributionType === CoreEnums.paymentTypes.DESO) {
      handleDistributionAmount(rootState.distributionAmount)
    }

    setState({ desoPriceClass, prevDesoPrice: desoData.desoPrice })

    setTimeout(() => {
      setState({ desoPriceClass: '' })
    }, 3000)
  }, [desoPrice]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBeforeUnload = (e) => {
    e.preventDefault()
    e.returnValue = 'Token distribution is still in progress. Are you sure you want to leave this page?'
  }

  const handleDistributionAmount = async (distributionAmount) => {
    // We need to update the estimatedPaymentToken and estimatedPaymentUSD values
    let finalHodlers = cloneDeep(rootState.finalHodlers)

    await calculateEstimatedPayment(
      distributionAmount,
      rootState.distributionType,
      rootState.spreadAmountBasedOn,
      finalHodlers,
      desoData
    )
    setRootState({ distributionAmount, finalHodlers })
  }

  const handleConfirmExecute = () => {
    const tokenName = rootState.tokenToUseLabel ? `$${rootState.tokenToUseLabel} token(s)` : rootState.distributionType
    const amount =
      rootState.distributionType === CoreEnums.paymentTypes.DIAMONDS
        ? tokenName
        : `${rootState.distributionAmount} ${tokenName}`
    const users = rootState.distributionType === CoreEnums.paymentTypes.DIAMONDS ? 'posts' : 'users'
    let title = `Please confirm you are ready to distribute ${amount}`
    title += ` to ${state.noOfPaymentTransactions} ${users}.`
    title += ' This operation cannot be undone.'

    modal.confirm({
      title,
      okText: 'Confirm',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setTimeout(() => {
          handleExecute()
        }, 0)
      },
      onCancel: () => {
        setState({ resetLoading: false })
      }
    })
  }

  const handleExecute = async () => {
    let status = Enums.paymentStatuses.PREPARING
    let tips = await randomize(configData.tips, null, configData.tips.length)
    let progressPercent = 10
    let paymentModal = null
    let finalHodlers = null
    let paymentCount = state.noOfPaymentTransactions
    let successCount = 0
    let failCount = 0
    let remainingCount = paymentCount
    let distTransaction = null
    let slimState = null
    let agiliteResponse = null
    let executeInCatch = false
    let newDeSoLimit = 0
    let desoTotal = state.totalFeeDESO
    let desoOpsFeeDESO = state.desoOpsFeeDESO
    let gqlProps = null
    let gqlData = null
    let timestamp = null
    let postsTotal = 0

    try {
      // Prompt user if they try to close the browser window
      window.addEventListener('beforeunload', handleBeforeUnload)

      // Check if the Spending Limit needs to be changed
      if (rootState.distributionType === CoreEnums.paymentTypes.DESO) {
        // The Payment is in $DESO, so we need to add the distribution amount to the Global DESO Limit
        desoTotal += rootState.distributionAmount
      }

      // Add a x $DESO buffer and then convert to nanos
      desoTotal = (desoTotal + CoreEnums.values.DESO_LIMIT_INCREASE_BUFFER) * 1e9

      if (desoTotal > identity.transactionSpendingLimitOptions.GlobalDESOLimit) {
        newDeSoLimit = Math.ceil(identity.transactionSpendingLimitOptions.GlobalDESOLimit + desoTotal)
        await changeDeSoLimit(newDeSoLimit)
      }

      // Prep the Payment Modal
      paymentModal = cloneDeep(rootState.paymentModal)

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

      // Flag all hodlers setting paymentStatus = CoreEnums.paymentStatuses.QUEUED
      finalHodlers = cloneDeep(rootState.finalHodlers)

      for (const hodler of finalHodlers) {
        if (hodler.isActive && hodler.isVisible) {
          hodler.paymentStatus = CoreEnums.paymentStatuses.QUEUED
        }
      }

      // Start execution and update Root State
      setRootState({
        isExecuting: true,
        paymentModal,
        finalHodlers
      })

      // If we are distributing Diamonds, we have to first fetch all Post Ids for each user based on the Diamond Options
      if (rootState.distributionType === CoreEnums.paymentTypes.DIAMONDS) {
        paymentModal.status = Enums.paymentStatuses.FETCHING_POSTS
        paymentModal.progressPercent = 15
        setRootState({ paymentModal })

        // Generate a timestamp for the query based on the current time minus the rootState.diamondOptionsModal.skipHours
        // Timestamp must be in the format of '2024-02-01 00:00:00.000Z'
        timestamp = new Date()
        timestamp.setHours(timestamp.getHours() - rootState.diamondOptionsModal.skipHours)
        timestamp = timestamp.toISOString()

        for (const hodler of finalHodlers) {
          try {
            // Reset the posts array
            hodler.diamondPosts = []

            // Ignore hodlers that are not active or visible
            if (!hodler.isActive || !hodler.isVisible) continue

            // Fetch the Posts for the user
            gqlProps = {
              condition: {
                posterPublicKey: hodler.publicKey,
                repostedPostHash: null
              },
              filter: {
                timestamp: {
                  lessThan: timestamp
                },
                parentPostExists: false
              },
              orderBy: 'TIMESTAMP_DESC',
              first: rootState.diamondOptionsModal.noOfPosts,
              diamondsFilter2: {
                diamondLevel: {
                  greaterThanOrEqualTo: rootState.diamondOptionsModal.noOfDiamonds
                },
                senderPkid: {
                  equalTo: desoData.profile.publicKey
                }
              }
            }

            gqlData = await client.query({
              query: GET_POSTS,
              variables: gqlProps,
              fetchPolicy: 'no-cache'
            })

            gqlData = gqlData.data.posts.nodes

            for (const post of gqlData) {
              if (post.diamonds.nodes.length === 0) {
                postsTotal++
                hodler.diamondPosts.push(diamondPostModel(post.postHash))
              }
            }
          } catch (e) {
            console.error(e)
          }
        }

        // If the postsTotal is less than the state.noOfPaymentTransactions, we need to update the DeSoOps Fee
        if (postsTotal < state.noOfPaymentTransactions) {
          // Update the Payment Counts
          paymentCount = postsTotal
          remainingCount = postsTotal
          paymentModal.paymentCount = paymentCount
          paymentModal.remainingCount = remainingCount

          // Calculate the new DeSoOps Fee
          desoOpsFeeDESO = (postsTotal * rootState.feePerTransactionUSD) / desoData.desoPrice
        }
      }

      // Prep and send the Distribution Transaction
      slimState = await slimRootState(rootState)
      distTransaction = await prepDistributionTransaction(desoData, slimState, state, finalHodlers, paymentModal)
      agiliteResponse = await createDistributionTransaction(distTransaction)
      executeInCatch = true

      // Pay the DeSoOps Transaction Fee
      if (desoOpsFeeDESO > 0) {
        await sendDESO(desoData.profile.publicKey, CoreEnums.values.DESO_OPS_PUBLIC_KEY, desoOpsFeeDESO)
      }

      // Update the Payment Modal
      paymentModal.distTransaction = agiliteResponse
      paymentModal.status = Enums.paymentStatuses.EXECUTING
      paymentModal.progressPercent = 20
      setRootState({ paymentModal })

      // Loop through state.holdersToPay and for each one, distribute the tokens using a for-of loop
      for (const hodler of finalHodlers) {
        // Pay the hodler
        try {
          // Ignore hodlers that are not active or visible
          if (!hodler.isActive || !hodler.isVisible) continue

          hodler.paymentStatus = CoreEnums.paymentStatuses.IN_PROGRESS
          setRootState({ finalHodlers })

          switch (rootState.distributionType) {
            case CoreEnums.paymentTypes.DESO:
              await sendDESO(desoData.profile.publicKey, hodler.publicKey, hodler.estimatedPaymentToken)
              break
            case CoreEnums.paymentTypes.DAO:
              await sendDAOTokens(
                desoData.profile.publicKey,
                hodler.publicKey,
                rootState.tokenToUse,
                hodler.estimatedPaymentToken
              )

              break
            case CoreEnums.paymentTypes.CREATOR:
              await sendCreatorCoins(
                desoData.profile.publicKey,
                hodler.publicKey,
                rootState.tokenToUse,
                hodler.estimatedPaymentToken
              )
              break
            case CoreEnums.paymentTypes.DIAMONDS:
              let hasErrors = null

              for (const post of hodler.diamondPosts) {
                hasErrors = false

                try {
                  await diamondPosts(
                    desoData.profile.publicKey,
                    hodler.publicKey,
                    post.postHash,
                    rootState.diamondOptionsModal.noOfDiamonds
                  )
                } catch (e) {
                  hasErrors = true
                  post.isError = true
                  post.errorMessage = e.message

                  // Use Enums.transactionErrors Determine if the error is known or not, and populate isKnownError
                  const knownError = CoreEnums.transactionErrors.find((error) =>
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
                setRootState({ paymentModal })
              }

              if (hasErrors) {
                hodler.paymentStatus = CoreEnums.paymentStatuses.FAILED
                hodler.isError = true
                hodler.errorMessage = 'DIAMONDS'
                hodler.isKnownError = true
              } else {
                hodler.paymentStatus = CoreEnums.paymentStatuses.SUCCESS
              }

              setRootState({ finalHodlers })

              break
          }
        } catch (e) {
          hodler.isError = true
          hodler.errorMessage = e.message

          // Use Enums.transactionErrors Determine if the error is known or not, and populate isKnownError
          const knownError = CoreEnums.transactionErrors.find((error) =>
            e.message.toLowerCase().includes(error.qry.toLowerCase())
          )

          if (knownError) {
            hodler.isKnownError = true
          }
        }

        // Update the Payment Modal, but ignore if the payment type is Diamonds
        if (rootState.distributionType !== CoreEnums.paymentTypes.DIAMONDS) {
          if (!hodler.isError) {
            successCount++
            remainingCount--
            paymentModal.successCount = successCount
            paymentModal.remainingCount = remainingCount
            hodler.paymentStatus = CoreEnums.paymentStatuses.SUCCESS
          } else {
            failCount++
            remainingCount--
            paymentModal.failCount = failCount
            paymentModal.remainingCount = remainingCount
            hodler.paymentStatus = CoreEnums.paymentStatuses.FAILED
          }

          paymentModal.progressPercent = Math.floor(20 + (70 * (successCount + failCount)) / paymentCount)
          setRootState({ paymentModal, finalHodlers })
        }
      }

      // Payments Completed, refresh the wallet and balances
      paymentModal.status = Enums.paymentStatuses.FINALIZING
      setRootState({ paymentModal })

      await onRefreshDashboard()

      // If there were any errors, add them to errors array and change the payment status
      paymentModal.progressPercent = 100

      if (failCount > 0) {
        paymentModal.status = Enums.paymentStatuses.ERROR_PAYMENT_TRANSACTION
        paymentModal.errors = finalHodlers.filter((hodler) => hodler.isError)
      } else {
        paymentModal.status = Enums.paymentStatuses.SUCCESS
        paymentModal.errors = []
      }

      distTransaction = await prepDistributionTransactionUpdate(agiliteResponse, finalHodlers, paymentModal)

      await updateDistributionTransaction(agiliteResponse._id, distTransaction)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      setRootState({ paymentModal, isExecuting: false })
    } catch (e) {
      console.error(e)

      // We need to post the error to Agilit-e and notify the user
      paymentModal.status = Enums.paymentStatuses.ERROR
      paymentModal.progressPercent = 100
      paymentModal.isError = true

      if (executeInCatch) {
        try {
          distTransaction = await prepDistributionTransactionUpdate(agiliteResponse, finalHodlers, paymentModal)

          distTransaction.isError = true
          distTransaction.errorDetails = {
            message: e.message,
            stack: e.stack
          }

          await updateDistributionTransaction(agiliteResponse._id, distTransaction)
        } catch (e) {
          // If we get here, we have serious problems
          console.error('We have serious problems if this error occurred')
          console.error(e)
        }
      }

      setRootState({
        isExecuting: false,
        paymentModal
      })

      window.removeEventListener('beforeunload', handleBeforeUnload)
      message.error(e.message)
    }
  }

  return (
    <Card
      title={<span style={styleProps.title}>Step 2: Distribution Summary</span>}
      size='small'
      headStyle={{ background: '#DDE6ED' }}
    >
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>Total transactions:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span style={styleProps.fieldValue}>{state.noOfPaymentTransactions}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>$DESO price:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span style={styleProps.fieldValue} className={state.desoPriceClass}>{`$${desoPrice}`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>DeSoOps fee:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span style={styleProps.fieldValue}>{`$${state.desoOpsFeeUSD} (~${state.desoOpsFeeDESOLabel} $DESO)`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>Gas fees:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span style={styleProps.fieldValue}>{`~${state.desoGasFeesNanos} nanos`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>Distribution cost:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span
            style={styleProps.distributionCost}
          >{`~$${state.totalFeeUSDLabel} (~${state.totalFeeDESOLabel} $DESO)`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          lg={styleParams.labelColLG}
          style={styleParams.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>Token to distribute:</span>
        </Col>
        <Col
          xs={styleParams.valueColXS}
          sm={styleParams.valueColSM}
          md={styleParams.valueColMD}
          lg={styleParams.valueColLG}
        >
          <span style={styleProps.fieldValue}>{state.tokenToDistribute}</span>
        </Col>
      </Row>
      {rootState.distributionAmountEnabled ? (
        <>
          <Divider style={styleProps.divider} />
          <Row>
            <Col
              xs={24}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              lg={styleParams.labelColLG}
              style={styleParams.labelColStyle}
            >
              <span style={styleProps.fieldLabel}>Amount to distribute:</span>
            </Col>
            <Col xs={24} sm={styleParams.valueColSM} md={styleParams.valueColMD} lg={styleParams.valueColLG}>
              <InputNumber
                status={state.amountExceeded ? 'error' : null}
                addonBefore={state.amountLabel}
                placeholder='0'
                readOnly={state.amountReadOnly}
                disabled={rootState.isExecuting || state.isExecuting}
                value={rootState.distributionAmount}
                style={{ width: deviceType.isSmartphone ? '100%' : 250 }}
                onChange={handleDistributionAmount}
              />
            </Col>
          </Row>
        </>
      ) : null}
      <Divider style={{ margin: '5px 0px 15px' }} />
      <Row justify='center'>
        <Col>
          <Button
            size={deviceType.isTablet ? 'large' : 'medium'}
            style={
              state.isExecuting || state.executeDisabled ? styleProps.btnExecuteInactive : styleProps.btnExecuteActive
            }
            icon={<RightCircleOutlined />}
            disabled={state.isExecuting || state.executeDisabled}
            onClick={handleConfirmExecute}
          >
            Execute Distribution
          </Button>
        </Col>
      </Row>
      {state.warningMessages.length > 0 ? (
        <>
          <Divider style={{ margin: '5px 0px 15px' }} />
          <Row justify='center'>
            <Col xs={24} md={18}>
              <Alert
                message={<span style={{ fontWeight: 'bold', fontSize: 14 }}>Warning</span>}
                description={
                  <ul style={{ paddingInlineStart: 20, marginTop: -5, marginBottom: 0 }}>
                    {state.warningMessages.map((entry) => (
                      <li key={entry.key}>{entry.value}</li>
                    ))}
                  </ul>
                }
                type='warning'
                style={{ fontSize: 13, paddingBlock: 3, paddingInline: 10 }}
              />
            </Col>
          </Row>
        </>
      ) : null}
    </Card>
  )
}

const app = ({ desoData, configData, rootState, setRootState, onRefreshDashboard, deviceType }) => {
  return (
    <App>
      <SummaryCard
        desoData={desoData}
        rootState={rootState}
        configData={configData}
        onRefreshDashboard={onRefreshDashboard}
        setRootState={setRootState}
        deviceType={deviceType}
      />
    </App>
  )
}

export default app
