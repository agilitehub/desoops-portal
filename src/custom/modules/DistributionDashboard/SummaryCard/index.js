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
import { changeDeSoLimit, sendCreatorCoins, sendDAOTokens, sendDESO } from '../../../lib/deso-controller-graphql'
import { randomize } from '../../../lib/utils'
import { createDistributionTransaction, updateDistributionTransaction } from '../../../lib/agilite-controller'

import './style.sass'
import { identity } from 'deso-protocol'

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
      const noOfPaymentTransactions = rootState.finalHodlers.filter(
        (hodler) => hodler.isActive && hodler.isVisible
      ).length

      const estimateDurationMinutes = (noOfPaymentTransactions * configData.estimateTimePerTransactionSeconds) / 60
      const estimateDurationLabel = estimateDurationMinutes < 1 ? '< 1' : Math.ceil(estimateDurationMinutes)

      let desoOpsFeeUSD = 0
      let desoOpsFeeDESO = 0
      let desoOpsFeeDESOLabel = 0

      let totalFeeUSD = 0
      let totalFeeUSDLabel = 0
      let totalFeeDESO = 0
      let totalFeeDESOLabel = 0

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

      if (isNaN(distributionAmount)) distributionAmount = 0

      // Determine DESO Ops Fee - It's free if the actual account is DeSoOps
      if (desoData.profile.publicKey !== CoreEnums.values.DESO_OPS_PUBLIC_KEY) {
        desoOpsFeeDESO = desoOpsFeeUSD / desoData.desoPrice
        desoOpsFeeUSD = noOfPaymentTransactions * rootState.feePerTransactionUSD
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
      }

      // Determine Total Cost
      totalFeeDESO = desoOpsFeeDESO + desoGasFeesNanos / CoreEnums.values.NANO_VALUE
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
        noOfPaymentTransactions,
        desoOpsFeeUSD,
        desoOpsFeeDESO,
        desoOpsFeeDESOLabel,
        desoGasFeesNanos,
        totalFeeUSD,
        totalFeeUSDLabel,
        totalFeeDESO,
        totalFeeDESOLabel,
        estimateDurationMinutes,
        estimateDurationLabel,
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
  }, [
    rootState.finalHodlers,
    rootState.tokenToUse,
    rootState.distributionType,
    rootState.feePerTransactionUSD,
    rootState.distributionAmount,
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
    let title = `Please confirm you are ready to distribute ${rootState.distributionAmount}`
    title += ` ${tokenName} to ${state.noOfPaymentTransactions} users.`
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

      // Prep and send the Distribution Transaction
      slimState = await slimRootState(rootState)
      distTransaction = await prepDistributionTransaction(desoData, slimState, state, finalHodlers, paymentModal)
      agiliteResponse = await createDistributionTransaction(distTransaction)
      executeInCatch = true

      // Pay the DeSoOps Transaction Fee
      await sendDESO(desoData.profile.publicKey, CoreEnums.values.DESO_OPS_PUBLIC_KEY, state.totalFeeDESO)

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

        // Update the Payment Modal
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
    <Card title={<span style={styleProps.title}>Step 2: Distribution Summary</span>} size='small'>
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
                addonBefore={rootState.distributionType}
                placeholder='0'
                disabled={rootState.isExecuting || state.isExecuting}
                value={rootState.distributionAmount}
                style={{ width: deviceType.isSmartphone ? '100%' : 250 }}
                onChange={handleDistributionAmount}
              />
            </Col>
          </Row>
        </>
      ) : null}
      <Divider style={{ margin: '10px 0' }} />
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
          <Divider style={{ margin: '10px 0' }} />
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
