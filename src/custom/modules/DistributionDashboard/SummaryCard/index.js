import React, { useEffect, useReducer } from 'react'
import { Card, Row, Col, Divider, InputNumber, Button, Alert, App } from 'antd'
import { cloneDeep } from 'lodash'
import { RightCircleOutlined } from '@ant-design/icons'

import CoreEnums from '../../../lib/enums'
import { calculateEstimatedPayment, prepDistributionTransaction, slimRootState } from '../controller'
import { distributionSummaryState } from '../data-models'
import Enums from '../enums'
import { sendCreatorCoins, sendDAOTokens, sendDESO } from '../../../lib/deso-controller'
import { randomize } from '../../../lib/utils'
import { createDistributionTransaction, updateDistributionTransaction } from '../../../lib/agilite-controller'
import { useSelector } from 'react-redux'

const styleParams = {
  labelColXS: 12,
  labelColSM: 12,
  labelColMD: 10,
  valueColXS: 12,
  valueColSM: 12,
  valueColMD: 14,
  colRightXS: 24,
  labelColStyle: {},
  dividerStyle: { margin: '7px 0' },
  btnExecuteActive: { color: 'green', borderColor: 'green', backgroundColor: 'white' },
  btnExecuteInactive: { color: '#D5D5D5', borderColor: '#D5D5D5', backgroundColor: 'white' }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const SummaryCard = ({ desoData, agiliteData, rootState, setRootState, onRefreshWallet }) => {
  const [state, setState] = useReducer(reducer, distributionSummaryState())
  const { isMobile, isTablet } = useSelector((state) => state.custom)
  const { modal, message } = App.useApp()

  useEffect(() => {
    try {
      const noOfPaymentTransactions = rootState.finalHodlers.filter(
        (hodler) => hodler.isActive && hodler.isVisible
      ).length

      let totalFeeUSD = noOfPaymentTransactions * rootState.feePerTransactionUSD
      let totalFeeDESO = totalFeeUSD / desoData.desoPrice
      let totalFeeDESOLabel = 0
      let distributionAmount = rootState.distributionAmount
      let amountExceeded = false
      let transactionFeeExceeded = false
      let selectedToken = null
      let warningMessages = []
      let isInFinalStage = false
      let executeDisabled = false
      let warningMsg = null
      let tokenToDistribute = ''

      if (isNaN(totalFeeUSD)) totalFeeUSD = 0
      if (isNaN(distributionAmount)) distributionAmount = 0
      if (isNaN(totalFeeDESO)) {
        totalFeeDESO = 0
      } else {
        totalFeeDESOLabel = Math.floor(totalFeeDESO * 10000) / 10000
      }

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
          warningMessages.push({ key: '1', value: 'The Transaction Fee exceeds your DESO Balance.' })
        }

        if (warningMsg) {
          warningMessages.push({ key: '2', value: warningMsg })
        }

        if (noOfPaymentTransactions === 0) {
          warningMessages.push({ key: '3', value: 'There are no users to distribute to.' })
        }
      }

      if (!rootState.distributionAmount || (isInFinalStage && warningMessages.length > 0)) {
        executeDisabled = true
      }

      setState({
        noOfPaymentTransactions,
        totalFeeUSD,
        totalFeeDESO,
        totalFeeDESOLabel,
        amountExceeded,
        transactionFeeExceeded,
        warningMessages,
        isInFinalStage,
        executeDisabled,
        tokenToDistribute
      })
    } catch (error) {
      console.error(error)
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
    desoData.desoPrice
  ])

  const handleDistributionAmount = async (distributionAmount) => {
    let desoPrice = null
    let finalHodlers = null

    // We need to update the estimatedPaymentToken and estimatedPaymentUSD values
    finalHodlers = cloneDeep(rootState.finalHodlers)
    if (rootState.distributionType === CoreEnums.paymentTypes.DESO) desoPrice = desoData.desoPrice
    await calculateEstimatedPayment(finalHodlers, distributionAmount, rootState.spreadAmountBasedOn, desoPrice)
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
    let tips = await randomize(agiliteData.tips, null, agiliteData.tips.length)
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

    try {
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
          console.error('Error', hodler)
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

      await onRefreshWallet()

      // If there were any errors, add them to errors array and change the payment status
      paymentModal.progressPercent = 100
      if (failCount > 0) {
        paymentModal.status = Enums.paymentStatuses.ERROR_PAYMENT_TRANSACTION
        paymentModal.errors = finalHodlers.filter((hodler) => hodler.isError)
      } else {
        paymentModal.status = Enums.paymentStatuses.SUCCESS
      }

      distTransaction = await prepDistributionTransaction(
        desoData,
        slimState,
        state,
        finalHodlers,
        paymentModal,
        true,
        distTransaction.startedAt
      )

      await updateDistributionTransaction(agiliteResponse._id, distTransaction)
      setRootState({ paymentModal })
    } catch (e) {
      console.error(e)

      // We need to post the error to Agilit-e and notify the user
      paymentModal.status = Enums.paymentStatuses.ERROR
      paymentModal.progressPercent = 100
      paymentModal.isError = true

      if (executeInCatch) {
        try {
          distTransaction = await prepDistributionTransaction(
            desoData,
            slimState,
            state,
            finalHodlers,
            paymentModal,
            true,
            distTransaction.startedAt
          )

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
      message.error(e.message)
    }
  }

  return (
    <Card title='Step 3: Distribution Summary' size='small'>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Total transactions:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{state.noOfPaymentTransactions}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>DeSo price:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{`$${desoData.desoPrice}`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Transaction fee:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{`$${rootState.feePerTransactionUSD} per transaction`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Distribution cost:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span
            style={{ color: state.transactionFeeExceeded ? 'red' : '' }}
          >{`$${state.totalFeeUSD} (~${state.totalFeeDESOLabel} $DESO)`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Token to distribute:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{state.tokenToDistribute}</span>
        </Col>
      </Row>
      {rootState.distributionAmountEnabled ? (
        <>
          <Divider style={styleParams.dividerStyle} />
          <Row>
            <Col xs={24} sm={styleParams.labelColSM} md={styleParams.labelColMD} style={styleParams.labelColStyle}>
              <span style={{ fontWeight: 'bold' }}>Amount to distribute:</span>
            </Col>
            <Col xs={24} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <InputNumber
                status={state.amountExceeded ? 'error' : null}
                addonBefore={rootState.distributionType}
                placeholder='0'
                disabled={rootState.isExecuting || state.isExecuting}
                value={rootState.distributionAmount}
                style={{ width: isMobile && !isTablet ? '100%' : 250 }}
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
            style={
              state.isExecuting || state.executeDisabled ? styleParams.btnExecuteInactive : styleParams.btnExecuteActive
            }
            icon={<RightCircleOutlined />}
            size='large'
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
            <Col span={18}>
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

const app = ({ desoData, agiliteData, rootState, setRootState, onRefreshWallet }) => {
  return (
    <App>
      <SummaryCard
        desoData={desoData}
        rootState={rootState}
        agiliteData={agiliteData}
        onRefreshWallet={onRefreshWallet}
        setRootState={setRootState}
      />
    </App>
  )
}

export default app
